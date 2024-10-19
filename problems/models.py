from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.

class Problem(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField(max_length=5000)
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='problem_images/', null=True, blank=True)
    solution = models.TextField(max_length=5000, null=True, blank=True)
    solution_post_at = models.DateTimeField(null=True, blank=True)
    scheduled_post_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.title

class Comment(models.Model):
    problem = models.ForeignKey(Problem, related_name='comments', on_delete=models.CASCADE)
    account = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)
    parent = models.ForeignKey('self', null=True, blank=True, related_name='replies', on_delete=models.CASCADE)
    pinned = models.BooleanField(default=False)

    def __str__(self):
        return f'Comment by {self.account.username} on {self.problem.title}'
