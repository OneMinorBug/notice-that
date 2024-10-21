$(function() {
    let timer;
 
    function bindCodeButtonClick() {
        $("#send-code-btn").off('click').on('click', function(event) {
            let $this = $(this);
            
            // Disable the button
            $this.prop('disabled', true);

            let countdown = 60;
            clearInterval(timer); // Clear any existing timer
            timer = setInterval(function() {
                if (countdown <= 0) {
                    $this.text("Get Code"); // Reset button text
                    clearInterval(timer); // Clear the timer
                    $this.prop('disabled', false); // Re-enable the button
                } else {
                    countdown--;
                    $this.text(countdown + "s"); // Update button text with countdown
                }
            }, 1000);
        });
    }

    bindCodeButtonClick(); // Initial binding of the click event
});
