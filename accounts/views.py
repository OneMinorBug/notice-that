import random
import string
import json
from django.core.mail import send_mail
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import get_user_model
from .forms import RegistrationForm

User = get_user_model()

def generate_verification_code():
    #Generates a random 6-character verification code.
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

@require_POST
def send_verification_code(request):
    try:
        email = json.loads(request.body).get('email')

        if not email:
            return JsonResponse({'status': 'error', 'message': 'Please provide an email address.'}, status=400)

        validate_email(email)

        # Check if the email is already in use
        if User.objects.filter(email=email).exists():
            return JsonResponse({'status': 'error', 'message': 'This email is already registered.'}, status=400)

    except (json.JSONDecodeError, ValidationError):
        # Bad JSON or a bad email format from validate_email
        return JsonResponse({'status': 'error', 'message': 'Please provide a valid email address.'}, status=400)
    except Exception:
        return JsonResponse({'status': 'error', 'message': 'An unexpected error occurred. Please try again later.'}, status=500)

    try:
        verification_code = generate_verification_code()
        # Store both email and code in session
        request.session['verification_code'] = verification_code
        request.session['verification_email'] = email
        request.session.set_expiry(300)  # Set session expiry to 5 minutes

        # Send the code via email
        subject = f'NoticeThat Email Verification Code - {verification_code}'
        message = f'Hey there, \n\n Thank you for signing up for notice-that.com. Your email verification code is: \n\n <b>{verification_code}</b> \n\n This code will expire in 5 minutes.\n\n If you received this email by mistake, you can ignore it.'
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email], fail_silently=False)

        return JsonResponse({'status': 'success', 'message': f'Verification code sent to {email}.'})

    except Exception as e:
        print(f"Error sending email: {e}") 
        return JsonResponse({'status': 'error', 'message': 'Failed to send verification code. Please try again later.'}, status=500)


def check_username(request):
    username = request.GET.get('username', None)
    response = {
        'is_taken': User.objects.filter(username__iexact=username).exists()
    }
    return JsonResponse(response)

def check_email(request):
    email = request.GET.get('email', None)
    response = {
        'is_taken': User.objects.filter(email__iexact=email).exists()
    }
    return JsonResponse(response)

def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        form.request = request  # Pass the request to the form

        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.save()
            messages.success(request, 'Registration successful. You can now log in.')
            return redirect('accounts:login')
    else:
        form = RegistrationForm()

    return render(request, 'register.html', {'form': form})


def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)

        if form.is_valid():
            login(request, form.get_user())
            return redirect('problems:home')
    else:
        form = AuthenticationForm()

    return render(request, 'login.html', {'form': form})

@login_required
def logout_view(request):
    logout(request)
    messages.success(request, "You have successfully logged out.")
    return redirect('accounts:login')
