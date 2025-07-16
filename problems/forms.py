from django import forms
from .models import Problem, Comment
from django.utils.html import strip_tags

def is_empty_content(content):
    if not content:
        return True
    # Strip HTML tags
    text_only = strip_tags(content)
    # Replace &nbsp; with regular space and strip
    cleaned = text_only.replace('&nbsp;', ' ').strip()
    return not cleaned or cleaned.isspace()

class ProblemForm(forms.ModelForm):
    created_at = forms.DateTimeField(widget=forms.DateTimeInput(attrs={'type': 'datetime-local'}), required=False)
    scheduled_post_at = forms.DateTimeField(required=False, widget=forms.TextInput(attrs={'type': 'datetime-local'}))
    solution_post_at = forms.DateTimeField(required=False, widget=forms.TextInput(attrs={'type': 'datetime-local'}))
    
    class Meta:
        model = Problem
        fields = ['title', 'content', 'image', 'scheduled_post_at', 'solution_post_at']
        widgets = {
            'scheduled_post_at': forms.DateTimeInput(attrs={'type': 'datetime-local'}),
            'solution_post_at': forms.DateTimeInput(attrs={'type': 'datetime-local'}),
        }

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
    
    def __init__(self, *args, **kwargs):
        # We will pop our custom argument before calling the parent's __init__
        # We default to True, so content is required unless we explicitly say otherwise.
        content_required = kwargs.pop('content_required', True)
        super().__init__(*args, **kwargs)    
        # Set the 'required' attribute based on the argument we passed.
        self.fields['content'].required = content_required

    # Custom validation to prevent effectively empty comments, but only if there's content to check.
    def clean_content(self):
        content = self.cleaned_data.get('content')
        if is_empty_content(content):
            if self.fields['content'].required:
                raise forms.ValidationError("This field cannot be empty.")
            else:
                # If the field is OPTIONAL, we treat this "effectively empty" content as a truly empty submission. We return an empty string.
                return '' 
        
        # If we get here, the content is not empty and is valid.
        return content
