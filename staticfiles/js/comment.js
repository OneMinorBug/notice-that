$(document).ready(function() {
    document.querySelectorAll('a.reply[data-comment-id]').forEach(function (button) {
        button.addEventListener('click', function (event) {
            // Prevent the default action of the button
            event.preventDefault();
            const commentId = this.getAttribute('data-comment-id');
            const replyForm = document.getElementById('reply-form-' + commentId);

            // Toggle visibility of the corresponding reply form
            const isVisible = replyForm.style.display === 'block';
            replyForm.style.display = isVisible ? 'none' : 'block'; 

            // Check if this form has already been set up. We only do this once.
            const isInitialized = replyForm.getAttribute('data-initialized');

            // If the form is being opened for the first time
            if (!isVisible && !isInitialized) {
                $(`#reply-form-${commentId}`).form({
                    on: 'blur', // Validate when the user clicks away from the textarea
                    inline: true,
                    fields: {
                        content: {
                            identifier: 'content',
                            rules: [{type: 'notEmpty', prompt: 'Your reply cannot be empty.'}]
                        }
                    }
                });

                // Mark the form as initialized so we don't set it up again.
                replyForm.setAttribute('data-initialized', 'true');
            }
        });
    });
});