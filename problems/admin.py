from django.contrib import admin
from .models import Problem, Comment

# Register your models here.
@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):
    list_display = ['title', 'content', 'has_solution','scheduled_post_at']
    list_per_page = 20
    search_fields = ['title', 'content']
    ordering = ['-scheduled_post_at']

    @admin.display(boolean=True, description='Has Solution?')
    def has_solution(self, obj):
        return obj.solution_comment is not None
    
    def view_on_site(self, obj):
        return obj.get_absolute_url()

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['account', 'problem', 'content', 'is_pinned', 'created_at']
    list_per_page = 20
    list_filter = ['is_pinned']
    date_hierarchy = 'created_at'
    search_fields = ['account__username', 'problem__title', 'problem__content', 'content']
    readonly_fields = ['account', 'parent', 'problem']
    ordering = ['-created_at']
    view_on_site = True

    @admin.display(boolean=True, description='Pinned?')
    def is_pinned(self, obj):
        return obj.problem.solution_comment == obj if obj.problem.solution_comment else False

    def view_on_site(self, obj):
        return obj.problem.get_absolute_url()