from django.contrib import admin
from .models import Problem, Comment

# Register your models here.
@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):
    list_display = ['title', 'content', 'has_solution','scheduled_post_at']
    list_per_page = 20
    search_fields = ['title', 'content']
    ordering = ['-scheduled_post_at']
    raw_id_fields = ('solution_comment',)

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
    readonly_fields = ['account', 'parent', 'problem']
    ordering = ['-created_at']
    view_on_site = True
    raw_id_fields = ('problem', 'parent')

    @admin.display(boolean=True, description='Pinned?')
    def is_pinned(self, obj):
        if obj.problem.solution_comment:
            return obj.problem.solution_comment_id == obj.id
        return False

    def view_on_site(self, obj):
        return obj.problem.get_absolute_url()