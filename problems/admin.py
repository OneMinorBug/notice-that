from django.contrib import admin
from .models import Problem, Comment

# Register your models here.
class ProblemAdmin(admin.ModelAdmin):
    list_display = ['title', 'content', 'scheduled_post_at']
    list_per_page = 20
    search_fields = ['title', 'content']
    ordering = ['-scheduled_post_at']

    def view_on_site(self, obj):
        return obj.get_absolute_url()

class CommentAdmin(admin.ModelAdmin):
    list_display = ['account', 'problem', 'content', 'pinned', 'created_at']
    list_per_page = 20
    list_filter = ['pinned']
    search_fields = ['account', 'problem', 'content']
    readonly_fields = ['account', 'parent']
    ordering = ['-created_at']
    view_on_site = True

    def view_on_site(self, obj):
        return obj.problem.get_absolute_url()

admin.site.register(Problem, ProblemAdmin)
admin.site.register(Comment, CommentAdmin)