document.addEventListener('DOMContentLoaded', function() {
    
    const lightbox = document.getElementById('simple-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const targetImages = document.querySelectorAll('.comment .content img, #problem-content-segment img');

    targetImages.forEach(image => {
        image.addEventListener('click', () => {
            const imageUrl = image.src;
            lightboxImg.src = imageUrl;
            lightbox.style.display = 'flex'; // Show the lightbox
        });
    });

    lightbox.addEventListener('click', event => {
        // if the click is on the dark overlay, not on the image itself.
        if (event.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });

    document.addEventListener('keydown', event => {
        if (lightbox.style.display === 'flex' && event.key === 'Escape') {
            lightbox.style.display = 'none';
        }
    });

});