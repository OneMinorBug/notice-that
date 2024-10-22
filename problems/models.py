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
    content = models.TextField(max_length=5000)
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='problem_images/', null=True, blank=True)
    solution = models.TextField(max_length=5000, null=True, blank=True)
    solution_post_at = models.DateTimeField(null=True, blank=True)
    scheduled_post_at = models.DateTimeField(null=True, blank=True)
    id = models.CharField(max_length=8, unique=True, editable=False, default=generate_id, primary_key=True)

    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.id:
            self.id = generate_id()
        super().save(*args, **kwargs)
        
    def get_absolute_url(self):
        return reverse("problems:problem_detail", kwargs={"pk": self.id})
    

class Comment(models.Model):
    problem = models.ForeignKey(Problem, related_name='comments', on_delete=models.CASCADE)
    account = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(max_length=1000)
    created_at = models.DateTimeField(default=timezone.now)
    parent = models.ForeignKey('self', null=True, blank=True, related_name='replies', on_delete=models.CASCADE)
    pinned = models.BooleanField(default=False)

    def __str__(self):
        return f'Comment by {self.account.username} on {self.problem.title}'
