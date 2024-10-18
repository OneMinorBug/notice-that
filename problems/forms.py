from django import forms
from .models import Problem, Comment

class ProblemForm(forms.ModelForm):
    class Meta:
        model = Problem
        fields = ['title', 'content', 'image']

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['content']
        widgets = {
            'content': forms.Textarea(attrs={
                'placeholder': 'Type your reply here...',
                'rows': 3,  # Adjust the height if needed
            })
        }
