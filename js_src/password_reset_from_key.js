$(document).ready(function() {
	// Target the form for setting a new password
	$('.ui.large.form').form({
		on: 'blur',
		inline: true,
		fields: {
			password1: {
                identifier: 'password1',
                rules: [
                    {type: 'notEmpty', prompt: 'Please enter a password'},
                    {type: 'minLength[8]', prompt: 'Your password must be at least 8 characters long'}
                ]
            },
            password2: {
                identifier: 'password2',
                rules: [
                    {type: 'notEmpty', prompt: 'Please confirm your password'},
                    {type: 'match[password1]', prompt: 'Passwords do not match'}
                ]
            }
		}
	});
});