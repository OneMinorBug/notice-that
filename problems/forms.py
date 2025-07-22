from django import forms
from .models import Problem, Comment
from bs4 import BeautifulSoup

def is_content_effectively_empty(html_content):
    if not html_content:
        return True

    soup = BeautifulSoup(html_content, 'html.parser')
    # Check for significant non-text tags.
    if soup.find(['img', 'iframe', 'video']):
        return False
    
    text_content = soup.get_text(strip=True)
    return not text_content

class ProblemForm(forms.ModelForm):
    class Meta:
        model = Problem
        fields = ['title', 'content', 'image', 'scheduled_post_at', 'solution_post_at']
        widgets = {
            'content': forms.Textarea(attrs={
                'id': 'problem-content',
                'style': 'display: none;',
            }),
            'scheduled_post_at': forms.DateTimeInput(attrs={'type': 'datetime-local'}),
            'solution_post_at': forms.DateTimeInput(attrs={'type': 'datetime-local'}),
        }

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['content']
        widgets = {
            'content': forms.Textarea(attrs={
                'id': 'comment-content',
                'style': 'display: none;',
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
        if is_content_effectively_empty(content):
            if self.fields['content'].required:
                raise forms.ValidationError("This field cannot be empty.")
            else:
                # If the field is OPTIONAL, we treat this "effectively empty" content as a truly empty submission. We return an empty string.
                return '' 
        
        # If we get here, the content is not empty and is valid.
        return content
