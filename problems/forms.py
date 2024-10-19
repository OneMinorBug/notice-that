from django import forms
from .models import Problem, Comment

class ProblemForm(forms.ModelForm):
    created_at = forms.DateTimeField(widget=forms.DateTimeInput(attrs={'type': 'datetime-local'}), required=False)
    solution = forms.CharField(widget=forms.Textarea, required=False, label="Solution")
    scheduled_post_at = forms.DateTimeField(required=False, widget=forms.TextInput(attrs={'type': 'datetime-local'}))
    solution_post_at = forms.DateTimeField(required=False, widget=forms.TextInput(attrs={'type': 'datetime-local'}))
    
    class Meta:
        model = Problem
        fields = ['title', 'content', 'image', 'scheduled_post_at', 'solution', 'solution_post_at']

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
