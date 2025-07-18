$(document).ready(function() {
  // Fomantic UI form validation
  $('#login_form').form({
    on: 'blur',
    inline: true,
    fields: {
      login: {
        identifier: 'login',
        rules: [{ type: 'notEmpty', prompt: 'Please enter a username or email' }]
      },
      password: {
        identifier: 'password',
        rules: [{ type: 'notEmpty', prompt: 'Please enter a password' }]
      }
    }
  });
});