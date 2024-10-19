from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from django.views.decorators.http import require_GET
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.http import JsonResponse
from django.contrib import messages
from django.db.models import Q
from django.utils import timezone
from .models import Problem, Comment
from .forms import ProblemForm, CommentForm

# Create your views here.

def home(request):
    problems = Problem.objects.filter(scheduled_post_at__lte=timezone.now())
    return render(request, 'home.html', {'problems': problems})

def archives(request):
    problems = Problem.objects.filter(scheduled_post_at__lte=timezone.now())
    return render(request, 'archives.html', {'problems': problems})

def about(request):
    return render(request, 'about.html', {})

def problem_detail(request, pk):
    problem = get_object_or_404(Problem, pk=pk)
    if not request.user.is_staff and problem.scheduled_post_at and problem.scheduled_post_at > timezone.now():
        messages.error(request, "This problem is not available.")
        return redirect('problems:home')
    show_solution = problem.solution_post_at and problem.solution_post_at <= timezone.now()
    pinned_comment = problem.comments.filter(pinned=True, created_at__lte=timezone.now()).first()
    comments = problem.comments.filter(parent=None).exclude(id=pinned_comment.id if pinned_comment else None)   # Exclude pinned comment only if it exists
    user_has_commented = problem.comments.filter(account=request.user).exists() if request.user.is_authenticated else False
    reply_form = CommentForm()
    comment_form = CommentForm()
    total_comments = comments.count() + (1 if pinned_comment and show_solution else 0)

    if request.method == 'POST':
        if 'comment_id' in request.POST:  # Check if a reply is being submitted
            reply_form = CommentForm(request.POST)
            if reply_form.is_valid():
                reply = reply_form.save(commit=False)
                reply.account = request.user
                reply.problem = problem
                reply.parent = get_object_or_404(Comment, id=request.POST['comment_id'])  # Get parent comment
                reply.save()
                return redirect('problems:problem_detail', pk=problem.pk)
        elif 'pin_comment' in request.POST and request.user.is_staff:  # Pinning functionality for staff users
            comment_to_pin = get_object_or_404(Comment, id=request.POST['pin_comment'])
            # Unpin any previously pinned comment
            Comment.objects.filter(problem=problem, pinned=True).update(pinned=False)
            comment_to_pin.pinned = True
            comment_to_pin.save()
            return redirect('problems:problem_detail', pk=problem.pk)
        else:
            comment_form = CommentForm(request.POST)
            if comment_form.is_valid():
                comment = comment_form.save(commit=False)
                comment.account = request.user
                comment.problem = problem
                comment.parent = None
                comment.save()
                print("Comment saved:", comment.content)
                return redirect('problems:problem_detail', pk=problem.pk)
            else:
                print("Comment form errors:", comment_form.errors)  # Log any form errors
    else:
        reply_form = CommentForm()

    return render(request, 'problem_detail.html', {
        'problem': problem,
        'comments': comments,
        'pinned_comment': pinned_comment,
        'reply_form': reply_form,
        'user_has_commented': user_has_commented,
        'total_comments': total_comments,
        'show_solution': show_solution
    })

@login_required
@staff_member_required
def post_problem(request):
    if request.method == 'POST':
        form = ProblemForm(request.POST, request.FILES)
        if form.is_valid():
            problem = form.save(commit=False)
            if form.cleaned_data.get('scheduled_post_at'):
                problem.scheduled_post_at = form.cleaned_data['scheduled_post_at']
            else:
                problem.scheduled_post_at = timezone.now()
            problem.save()
            # Save the pinned comment if provided
            solution_content = form.cleaned_data.get('solution')
            if solution_content:
                Comment.objects.create(
                    problem=problem,
                    account=request.user,
                    content=solution_content,
                    pinned=True,
                    created_at=problem.created_at
                )
            messages.success(request, 'Added one new problem')
            return redirect('problems:home')
        else:
            print(form.errors)
            messages.error(request, "Parameter error, failed to post")
    else:
        form = ProblemForm()
    return render(request, 'post_problem.html', {'form': form})

@require_GET
def search(request):
    q = request.GET.get('q')
    problems = Problem.objects.filter(Q(title__icontains=q)|Q(content__icontains=q), scheduled_post_at__lte=timezone.now())
    return render(request, 'archives.html', {'problems': problems})

@csrf_exempt
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