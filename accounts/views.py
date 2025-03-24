import random
import string
from django.core.mail import send_mail
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.conf import settings
from django.http import JsonResponse
from .forms import RegistrationForm

def generate_verification_code():
    #Generates a random 6-character verification code.
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

def send_verification_code(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        if email:
            verification_code = generate_verification_code()
            # Store both email and code in session
            request.session['verification_code'] = verification_code
            request.session['verification_email'] = email  # Store email
            request.session.set_expiry(0)

            # Send the code via email
            subject = f'NoticeThat Email Verification Code - {verification_code}'
            message = f'Hey there, \n\n Thank you for signing up for notice-that.com. Your email verification code is: \n\n <b>{verification_code}</b> \n\n If you received this email by mistake, you can ignore it.'
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [email]

            try:
                send_mail(subject, message, from_email, recipient_list)
                return render(request, 'register.html', {
                    'form': RegistrationForm(),
                    'success': f"Verification code sent to {email}."
                })
            except Exception as e:
                messages.error(request, "Error sending verification code. Please try again.")
        else:
            messages.error(request, "Please provide an email address.")
    return redirect('accounts:register')


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
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect('problems:home')
        else:
            messages.error(request, "Login failed. Please check your username and password.")
    return render(request, 'login.html')

@login_required
def logout_view(request):
    logout(request)
    messages.success(request, "You have successfully logged out.")
    return redirect('accounts:login')
