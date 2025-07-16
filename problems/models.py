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
    solution_comment = models.OneToOneField('Comment', null=True, blank=True, on_delete=models.SET_NULL, related_name='problem_as_solution')

    class Meta:
        ordering = ['scheduled_post_at']

    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        # Pop our custom flag before calling the parent save.
        is_sync_update = kwargs.pop('_from_sync', False)
        super().save(*args, **kwargs)

        if not is_sync_update:
            if self.solution_comment:
                if self.solution_comment.created_at != self.solution_post_at:
                    self.solution_comment.created_at = self.solution_post_at or timezone.now()
                     # Save the comment, passing the flag to prevent an infinite loop.
                    self.solution_comment.save(_from_sync=True, update_fields=['created_at'])

    def get_absolute_url(self):
        return reverse("problems:problem_detail", kwargs={"pk": self.id})
    

class Comment(models.Model):
    problem = models.ForeignKey(Problem, related_name='comments', on_delete=models.CASCADE)
    account = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(max_length=100000, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    parent = models.ForeignKey('self', null=True, blank=True, related_name='replies', on_delete=models.CASCADE)

    def __str__(self):
        return f'Comment by {self.account.username} on {self.problem.title}'
    
    def save(self, *args, **kwargs):
        # We'll add a custom, internal flag to prevent infinite loops. If this save was triggered by the Problem model, we don't want to sync back.
        is_sync_update = kwargs.pop('_from_sync', False)
        super().save(*args, **kwargs)

        if not is_sync_update:
            try:
                problem = self.problem_as_solution
                if problem.solution_post_at != self.created_at:
                    problem.solution_post_at = self.created_at
                    # Save the problem, passing the flag to prevent it from syncing back to us.
                    problem.save(_from_sync=True, update_fields=['solution_post_at'])
            except Problem.DoesNotExist:
                pass