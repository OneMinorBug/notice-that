from django.contrib import admin, messages
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.utils.html import format_html
from .models import Problem, Comment

# Register your models here.
@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):
    list_display = ['title', 'content', 'has_solution','scheduled_post_at']
    list_per_page = 20
    search_fields = ['title', 'content']
    ordering = ['-scheduled_post_at']
    fieldsets = [
        ("Problem", {"fields": ["title", "content", "image", "scheduled_post_at"]}),
        ("Solution", {"fields": ["solution_comment", "solution_post_at"]}),
    ]
    
    def save_model(self, request, obj, form, change):
        """
        Custom save logic to enforce date synchronization.
        """
        super().save_model(request, obj, form, change)

        if obj.solution_comment:
            if obj.solution_comment.created_at != obj.solution_post_at:
                obj.solution_comment.created_at = obj.solution_post_at
                obj.solution_comment.save(update_fields=['created_at'])

     # Filter the dropdown to only show relevant comments
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if obj and obj.pk:
            form.base_fields['solution_comment'].queryset = Comment.objects.filter(problem=obj)
        else:
            form.base_fields['solution_comment'].queryset = Comment.objects.none()
        return form

    @admin.display(boolean=True, description='Has Solution?')
    def has_solution(self, obj):
        return obj.solution_comment is not None
    
    def view_on_site(self, obj):
        return obj.get_absolute_url()

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['account', 'problem', 'content', 'is_pinned', 'created_at']
    list_per_page = 20
    search_fields = ['account__username', 'problem__title', 'problem__content', 'content']
    ordering = ['-created_at']
    view_on_site = True
    
    def get_fieldsets(self, request, obj=None):
        if obj and obj.pk:
            return [(None, {'fields': ('account', 'problem', 'parent', 'content', 'created_at', 'pinning_controls')})]
        if not obj:
            return [('Add New Top-Level Comment', {
                'fields': ('account', 'problem', 'parent', 'content', 'created_at'),
                'description': 'Note: New comments added here will not be pinned as solutions automatically. Use the pin controls after saving. The comment author will be set to your account automatically upon saving.'
            })]

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return ['account', 'parent', 'problem', 'pinning_controls']
        else:
            return ['account', 'parent', 'pinning_controls']
        
    def save_model(self, request, obj, form, change):
        """
        When a new comment is created via the admin, set the author
        to the currently logged-in user.
        """
        if not change: # 'change' is False when creating an object
            obj.account = request.user
        super().save_model(request, obj, form, change)

    @admin.display(description='Pin Control')
    def pinning_controls(self, obj):
        problem = obj.problem
        if problem.solution_comment_id == obj.id:
            return format_html(
                '<p>This comment is currently the pinned solution.</p>'
                '<input type="submit" name="_unpin_as_solution" value="Unpin Solution" style="background-color: #ba2121; color: white;">'
            )
        else:
            return format_html(
                '<input type="submit" name="_pin_as_solution" value="Pin as Solution">'
            )

    def response_change(self, request, obj):
        """
        Handles the custom button logic after the admin form has been processed.
        """
        if "_pin_as_solution" in request.POST:
            problem = obj.problem
            problem.solution_comment = obj
            problem.solution_post_at = obj.created_at
            problem.save()
            self.message_user(request, "This comment has been successfully pinned as the solution.", messages.SUCCESS)
            return HttpResponseRedirect(".")

        if "_unpin_as_solution" in request.POST:
            problem = obj.problem
            if problem.solution_comment_id == obj.id:
                problem.solution_comment = None
                problem.save()
                self.message_user(request, "The solution has been successfully unpinned.", messages.SUCCESS)
            else:
                self.message_user(request, "This comment was not the solution, so no action was taken.", messages.WARNING)
            return HttpResponseRedirect(".")

        return super().response_change(request, obj)

    @admin.display(boolean=True, description='Pinned?')
    def is_pinned(self, obj):
        return Problem.objects.filter(solution_comment_id=obj.id).exists()

    def view_on_site(self, obj):
        return obj.problem.get_absolute_url()