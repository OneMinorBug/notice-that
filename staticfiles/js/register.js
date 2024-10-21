// JavaScript for sending the verification code
document.getElementById('send-code-btn').addEventListener('click', function() {
    const emailField = document.getElementById('id_email').value;

    if (emailField) {
        fetch("/accounts/send-code/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value
            },
            body: new URLSearchParams({
                'email': emailField
            })
        })
        .then(response => response.text())
        .then(data => {
            alert('Verification code sent to your email.');
            document.getElementById('id_email').setAttribute('readonly', true); // Optional
        })
        .catch(error => {
            alert('Error sending verification code. Please try again.');
        });
    } else {
        alert('Please enter your email first.');
    }
});

// JavaScript for checking username availability
document.getElementById('id_username').addEventListener('input', function() {
    const usernameField = this.value;
    if (usernameField) {
        fetch("/accounts/check-username/?username=" + usernameField)
        .then(response => response.json())
        .then(data => {
            const usernameError = document.getElementById('username-error');
            if (data.is_taken) {
                usernameError.textContent = 'Username is already taken.';
            } else {
                usernameError.textContent = ''; // Clear error message
            }
        });
    } else {
        document.getElementById('username-error').textContent = ''; // Clear error message if input is empty
    }
});

// JavaScript for checking email availability
document.getElementById('id_email').addEventListener('input', function() {
    const emailField = this.value;
    if (emailField) {
        fetch("/accounts/check-email/?email=" + emailField)
        .then(response => response.json())
        .then(data => {
            const emailError = document.getElementById('email-error');
            if (data.is_taken) {
                emailError.textContent = 'Email is already in use.';
            } else {
                emailError.textContent = ''; // Clear error message
            }
        });
    } else {
        document.getElementById('email-error').textContent = ''; // Clear error message if input is empty
    }
});
