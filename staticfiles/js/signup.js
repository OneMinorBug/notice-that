$(document).ready(function() {
    // Fomantic UI form validation
    $('#signup_form').form({
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
            password: {
                identifier: 'password',
                rules: [
                    {type: 'notEmpty', prompt: 'Please enter a password'},
                    {type: 'minLength[8]', prompt: 'Your password must be at least 8 characters long'}
                ]
            },
            password2: {
                identifier: 'password2',
                rules: [
                    {type: 'notEmpty', prompt: 'Please confirm your password'},
                    {type: 'match[password]', prompt: 'Passwords do not match'}
                ]
            }
        }
    });
});