document.querySelectorAll('.reply').forEach(function (button) {
    button.addEventListener('click', function () {
        const commentId = this.getAttribute('data-comment-id');
        const replyForm = document.getElementById('reply-form-' + commentId);
        // Toggle visibility of the corresponding reply form
        if (replyForm) {
            if (replyForm.style.display === 'none' || replyForm.style.display === '') {
                replyForm.style.display = 'block';
            } else {
                replyForm.style.display = 'none';
            }
        }
    });
});