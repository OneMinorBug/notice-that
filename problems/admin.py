from django.contrib import admin
from .models import Problem, Comment

# Register your models here.
class ProblemAdmin(admin.ModelAdmin):
    list_display = ['title', 'content', 'created_at']

class CommentAdmin(admin.ModelAdmin):
    list_display = ['title', 'content', 'account', 'created_at']

admin.site.register(Problem)
admin.site.register(Comment)