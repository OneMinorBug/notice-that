$(document).ready(function() {
	// Fomantic UI form validation
	$('.ui.large.form').form({
		on: 'blur',
		inline: true,
		fields: {
			email: {
                identifier: 'email',
                rules: [
                    {type: 'notEmpty', prompt: 'Please enter your email address'},
                    {type: 'email',prompt: 'Please enter a valid email address'}
                ]
            }
		}
	});
});