$(document).ready(function() {
  
    // Fomantic UI form validation
    $('#registration-form').form({
        on: 'blur', // Validate fields when the user moves away from them
        inline: true, // Display error messages inline
        fields: {
            username: {
                identifier: 'username',
                rules: [{type: 'notEmpty', prompt: 'Please enter a username'}]
            },
            email: {
                identifier: 'email',
                rules: [
                    {type: 'notEmpty', prompt: 'Please enter your email address'},
                    {type: 'email',prompt: 'Please enter a valid email address'}
                ]
            },
            verification_code: {
                identifier: 'verification_code',
                rules: [{type: 'notEmpty', prompt: 'Please enter the verification code'}]
            },
            password: {
                identifier: 'password',
                rules: [
                    {type: 'notEmpty', prompt: 'Please enter a password'},
                    {type: 'minLength[6]', prompt: 'Your password must be at least 6 characters long'}
                ]
            },
            confirm_password: {
                identifier: 'confirm_password',
                rules: [
                    {type: 'notEmpty', prompt: 'Please confirm your password'},
                    {type: 'match[password]', prompt: 'Passwords do not match'}
                ]
            }
        }
    });

    // JavaScript for "Get Code" button
    $('#send-code-btn').on('click', function() {
        const $this = $(this);

        // Manually trigger validation on the email field
        $('#registration-form').form('validate field', 'email');

        // Check if the field is now valid
        if ( $('#registration-form').form('is valid', 'email') ) {

            // Start the countdown timer
            $this.prop('disabled', true);
            let countdown = 60;
            $this.text(countdown + "s");
            
            let timer = setInterval(function() {
                countdown--;
                if (countdown <= 0) {
                    clearInterval(timer);
                    $this.text("Send Code").prop('disabled', false);
                } else {
                    $this.text(countdown + "s");
                }
            }, 1000);

            // Send the verification code via AJAX
            const emailField = $('#id_email').val();
            fetch("/accounts/send-code/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': $('input[name="csrfmiddlewaretoken"]').val()
            },
            body: JSON.stringify({ 'email': emailField })
            })
            .then(response => response.json())
            .then(data => {
                // Check the status from our new API view
                if (data.status === 'success') {
                    alert(data.message); // Show the success message from the server
                    $('#id_email').prop('readonly', true);
                } else {
                    alert(data.message); // Show the error message from the server
                    // Reset the button so the user can try again
                    clearInterval(timer);
                    $this.text("Send Code").prop('disabled', false);
                }
            })
            .catch(error => {
                console.error('Error sending verification code:', error);
                alert('Error sending verification code. Please try again.');
                // If sending fails, reset the button immediately
                clearInterval(timer);
                $this.text("Send Code").prop('disabled', false);
            });
        }
        // --- If not valid, do nothing. The validation trigger above will have already shown the error message. ---
    });

    // JavaScript for checking username availability
    $('#id_username').on('blur', function() { // Changed to 'blur' to match form validation trigger
        const usernameField = this.value;
        if (usernameField) {
        fetch("/accounts/check-username/?username=" + encodeURIComponent(usernameField))
            .then(response => response.json())
            .then(data => {
            if (data.is_taken) {
                // Use Fomantic's way of showing an error
                $('#registration-form').form('add prompt', 'username', 'This username is already taken.');
            }
            });
        }
    });

    // JavaScript for checking email availability
    $('#id_email').on('blur', function() { // Changed to 'blur' to match form validation trigger
        const emailField = this.value;
        // Only check if the email is not readonly and has a value
        if (emailField && !$(this).prop('readonly')) {
        fetch("/accounts/check-email/?email=" + encodeURIComponent(emailField))
            .then(response => response.json())
            .then(data => {
            if (data.is_taken) {
                // Use Fomantic's way of showing an error
                $('#registration-form').form('add prompt', 'email', 'This email is already in use.');
            }
            });
        }
    });

});