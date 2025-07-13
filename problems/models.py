from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse
from django.utils import timezone
import uuid

# Create your models here.

def generate_id():
    return uuid.uuid4().hex[:8]

class Problem(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField(max_length=10000)
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='problem_images/', null=True, blank=True)
    solution_post_at = models.DateTimeField(null=True, blank=True)
    scheduled_post_at = models.DateTimeField(null=True, blank=True)
    id = models.CharField(max_length=8, unique=True, editable=False, default=generate_id, primary_key=True)
    solution_comment = models.OneToOneField('Comment', null=True, blank=True, on_delete=models.SET_NULL)

    class Meta:
        ordering = ['scheduled_post_at']

    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
    def get_absolute_url(self):
        return reverse("problems:problem_detail", kwargs={"pk": self.id})
    

class Comment(models.Model):
    problem = models.ForeignKey(Problem, related_name='comments', on_delete=models.CASCADE)
    account = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(max_length=100000)
    created_at = models.DateTimeField(default=timezone.now)
    parent = models.ForeignKey('self', null=True, blank=True, related_name='replies', on_delete=models.CASCADE)

    def __str__(self):
        return f'Comment by {self.account.username} on {self.problem.title}'
