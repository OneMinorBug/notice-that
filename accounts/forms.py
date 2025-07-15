from django import forms
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

class RegistrationForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    confirm_password = forms.CharField(widget=forms.PasswordInput)
    verification_code = forms.CharField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def clean_email(self):
        email = self.cleaned_data['email']
        if User.objects.filter(email=email).exists():
            raise ValidationError("Email already in use. Please use a different email address.")
        return email

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")
        verification_code = cleaned_data.get("verification_code")
        email = cleaned_data.get("email")

        # Password confirmation check
        if password and confirm_password and password != confirm_password:
            raise ValidationError("Passwords do not match. Please try again.")

        # Check if the email matches the one used for sending the verification code
        verification_email = self.request.session.get('verification_email')
        session_verification_code = self.request.session.get('verification_code')

        if not verification_email or verification_email != email:
            raise ValidationError("The email does not match the one used for verification.")
        
        if not session_verification_code or session_verification_code != verification_code:
            raise ValidationError("Invalid verification code. Please try again.")

        return cleaned_data


