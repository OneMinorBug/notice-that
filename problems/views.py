import os
from django.shortcuts import render, get_object_or_404, redirect
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from django.views.decorators.http import require_GET
from django.core.files.storage import default_storage
from django.http import Http404, HttpResponse, JsonResponse
from django.contrib import messages
from django.db import transaction
from django.db.models import Q
from django.utils import timezone
from .models import Problem, Comment
from .forms import ProblemForm, CommentForm

# Create your views here.
User = get_user_model()

# Helper function to find all IDs in a comment tree, used for solution comments visibility in problem detail view.
def get_comment_tree_ids(start_comment):
    if not start_comment:
        return set()

    id_set = {start_comment.id}
    for reply in start_comment.replies.all():
        id_set.update(get_comment_tree_ids(reply)) # Merges the sets
    return id_set

def home(request):
    if request.user.is_authenticated:
        return redirect('problems:problems')
    return render(request, 'home.html', {})

@login_required
def problems(request):
    if request.user.is_staff:
        problems = Problem.objects.all()
    else:
        problems = Problem.objects.filter(scheduled_post_at__lte=timezone.now())
    return render(request, 'problems/problems.html', {'problems': problems})

def archives(request):
    if request.user.is_staff:
        problems = Problem.objects.all()
    else:
        problems = Problem.objects.filter(scheduled_post_at__lte=timezone.now())
    return render(request, 'problems/archives.html', {'problems': problems})

def about(request):
    return render(request, 'about.html', {})

def contact(request):
    return render(request, 'contact.html', {})

def problem_detail(request, pk):
    problem = get_object_or_404(Problem, id=pk)
    if not request.user.is_staff and problem.scheduled_post_at and problem.scheduled_post_at > timezone.now():
        messages.error(request, "This problem is not available.")
        previous_page = request.META.get('HTTP_REFERER', '/')
        return redirect(previous_page)
    comment_form = CommentForm()
    parent_id_with_error = None

    if request.method == 'POST':
        if not request.user.is_authenticated:
            return redirect('login')
            
        if 'pin_comment_id' in request.POST and request.user.is_staff:  # Pinning for staffs
            comment_to_pin = get_object_or_404(Comment, id=request.POST['pin_comment_id'], problem=problem)
            # This pins the comment and unpin the previously pinned comment if it exists
            problem.set_solution(comment_to_pin)
            messages.success(request, 'Solution has been pinned.')
            return redirect('problems:problem_detail', pk=problem.id)
        
        if 'unpin_comment' in request.POST and request.user.is_staff:  # Unpinning for staffs
            problem.clear_solution()
            messages.success(request, 'Solution has been unpinned.')
            return redirect('problems:problem_detail', pk=problem.id)
        
        comment_form = CommentForm(request.POST)
        if comment_form.is_valid():
            comment = comment_form.save(commit=False)
            comment.account = request.user
            comment.problem = problem
            parent_id = request.POST.get('parent_id')
            if parent_id:
                try:
                    comment.parent = Comment.objects.get(id=parent_id, problem=problem)
                except Comment.DoesNotExist:
                    # Handle case where parent comment doesn't exist or belongs to another problem
                    messages.error(request, "Invalid reply target.")
                    # Fall through to render the form with an error
            if not comment_form.errors: # Double-check no errors were added during parent lookup
                comment.save()
                return redirect('problems:problem_detail', pk=problem.id)
        
        # This block will now be reached if form is invalid OR if parent_id was bad
        print("Comment Form Errors:", comment_form.errors)
        messages.error(request, "There was an error with your comment.")
        parent_id_with_error = request.POST.get('parent_id')
        print("Parent ID with error:", parent_id_with_error)
        
    show_solution = request.user.is_staff or (problem.solution_post_at and problem.solution_post_at <= timezone.now())
    pinned_comment = problem.solution_comment if show_solution else None
    comments_qs = problem.comments.all()

    if not show_solution and problem.solution_comment:
        solution_thread_ids = get_comment_tree_ids(problem.solution_comment)
        comments_qs = comments_qs.exclude(id__in=solution_thread_ids)

    total_visible_comments = comments_qs.count()
    # Exclude the main pinned comment from the main list if it exists
    if problem.solution_comment:
        comments_qs = comments_qs.exclude(pk=problem.solution_comment.pk)

    visible_top_level_comments = comments_qs.filter(parent=None)
    user_has_commented = problem.comments.filter(account=request.user).exists() if request.user.is_authenticated else False

    return render(request, 'problems/problem_detail.html', {
        'problem': problem,
        'comments': visible_top_level_comments,
        'pinned_comment': pinned_comment,
        'comment_form': comment_form,
        'parent_id_with_error': parent_id_with_error,
        'user_has_commented': user_has_commented,
        'total_comments': total_visible_comments,
        'show_solution': show_solution,
        'now': timezone.now(),
    })

@login_required
@staff_member_required
def post_problem(request):
    if request.method == 'POST':
        problem_form = ProblemForm(request.POST, request.FILES, prefix='problem')
        solution_form = CommentForm(request.POST, prefix='solution', content_required=False)  # !!! Solution is not required

        if problem_form.is_valid() and solution_form.is_valid():
            with transaction.atomic():
                problem = problem_form.save(commit=False)
                if not problem.scheduled_post_at:
                    problem.scheduled_post_at = timezone.now()
                if not problem.solution_post_at:
                    problem.solution_post_at = problem.scheduled_post_at
                problem.save()

                # Save the pinned comment if provided
                solution_content = solution_form.cleaned_data.get('content')
                if solution_content:
                    solution_comment = solution_form.save(commit=False)
                    solution_comment.problem = problem
                    solution_comment.account = request.user
                    solution_comment.created_at = problem.solution_post_at
                    solution_comment.save()
                    problem.solution_comment = solution_comment
                    problem.save() # Save the problem again to store the link
                
                messages.success(request, 'Added one new problem')
                return redirect('problems:problems')
        else:
            print("Problem Form Errors:", problem_form.errors)
            print("Solution Form Errors:", solution_form.errors)
            messages.error(request, "Parameter error, failed to post. Please check the form.")
    else:
        problem_form = ProblemForm(prefix='problem')
        solution_form = CommentForm(prefix='solution', content_required=False) # !!! Solution is not required
    return render(request, 'problems/post_problem.html', {'problem_form': problem_form, 'solution_form': solution_form})

@require_GET
def search(request):
    q = request.GET.get('q')
    problems = Problem.objects.filter(Q(title__icontains=q)|Q(content__icontains=q), scheduled_post_at__lte=timezone.now())
    return render(request, 'problems/archives.html', {'problems': problems})

@login_required
def upload_image(request):
    if request.method == 'POST':
        image = request.FILES.get('file')
        if not image:
            return JsonResponse({'error': 'No file uploaded'}, status=400)
        # Save the uploaded image to the default storage
        image_name = default_storage.save(image.name, image)
        image_url = default_storage.url(image_name)
        # Return the image URL to be used in WangEditor
        return JsonResponse({'errno': 0, 'data': {'url': image_url}})
    return JsonResponse({'error': 'Invalid request'}, status=400)

@staff_member_required
def view_log_file(request, filename):
    # Sanitize the filename
    safe_filename = os.path.basename(filename) # This strips any directory information
    file_path = settings.LOG_DIR / safe_filename

    # Check that the final path is still inside your log directory (extra safety)
    if not file_path.is_file() or not str(file_path).startswith(str(settings.LOG_DIR)):
        raise Http404("Log file does not exist or access is denied")

    with open(file_path, 'r') as file:
        response = HttpResponse(file.read(), content_type='text/plain')
        return response