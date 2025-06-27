// Wait for the DOM to be fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');
    // Get all potential inputs, checking if they exist
    const firstname_input = document.getElementById('user-input'); // Renamed to match signup.php's username input ID
    const email_input = document.getElementById('email-input');
    const password_input = document.getElementById('password-input');
    const repeat_password_input = document.getElementById('repeat-password-input');
    const error_message = document.getElementById('client-error-message'); // Corrected ID based on your signup.php HTML

    // Ensure the form element exists before adding a listener to it
    if (!form) {
        console.error("Error: Form element with ID 'form' not found.");
        return; // Stop script execution if form is not found
    }

    // Attach the single submit event listener to the form
    form.addEventListener('submit', (e) => {
        let errors = [];

        // Determine if it's a signup form (if firstname_input and repeat_password_input exist) or a login form
        // Using both for a more robust check in case a login form somehow has a firstname_input but no repeat_password_input
        if (firstname_input && repeat_password_input) {
            // It's a signup form
            errors = getSignupFormErrors(
                firstname_input.value,
                email_input ? email_input.value : '', // Defensive check
                password_input ? password_input.value : '',
                repeat_password_input.value
            );
        } else {
            // It's a login form (assuming only email and password inputs are present)
            errors = getLoginFormErrors(
                email_input ? email_input.value : '', // Defensive check
                password_input ? password_input.value : ''
            );
        }

        // Display errors if any
        if (errors.length > 0) {
            e.preventDefault(); // Prevent the form from submitting if there are errors
            if (error_message) {
                error_message.innerText = errors.join(". "); // Display all errors
            } else {
                console.error("Error: Client error message element with ID 'client-error-message' not found.");
            }
        } else {
            // If there are no errors, the form will submit naturally.
            if (error_message) {
                error_message.innerText = ''; // Clear any previous error messages
            }
        }
    });

    // --- Helper Functions ---

    // Function to get validation errors for a signup form
    function getSignupFormErrors(firstname, email, password, repeatPassword) {
        let errors = [];

        // Reset incorrect class for all signup inputs before validating
        if (firstname_input) firstname_input.parentElement.classList.remove('incorrect');
        if (email_input) email_input.parentElement.classList.remove('incorrect');
        if (password_input) password_input.parentElement.classList.remove('incorrect');
        if (repeat_password_input) repeat_password_input.parentElement.classList.remove('incorrect');

        if (firstname === '' || firstname === null) {
            errors.push('Username is required'); // Changed to Username as per signup.php
            if (firstname_input) firstname_input.parentElement.classList.add('incorrect');
        }
        if (email === '' || email === null) {
            errors.push('Email is required');
            if (email_input) email_input.parentElement.classList.add('incorrect');
        } else if (!isValidEmail(email)) {
            errors.push('Please enter a valid email address');
            if (email_input) email_input.parentElement.classList.add('incorrect');
        }

        if (password === '' || password === null) {
            errors.push('Password is required');
            if (password_input) password_input.parentElement.classList.add('incorrect');
        } else if (password.length < 6) { // Changed to 6 characters as per signup.php
            errors.push('Password must have at least 6 characters');
            if (password_input) password_input.parentElement.classList.add('incorrect');
        }

        if (repeatPassword === '' || repeatPassword === null) {
            errors.push('Please confirm password'); // Changed to match PHP phrasing
            if (repeat_password_input) repeat_password_input.parentElement.classList.add('incorrect');
        } else if (password !== repeatPassword) {
            errors.push('Password did not match'); // Changed to match PHP phrasing
            if (password_input) password_input.parentElement.classList.add('incorrect');
            if (repeat_password_input) repeat_password_input.parentElement.classList.add('incorrect');
        }

        return errors;
    }

    // Function to get validation errors for a login form
    function getLoginFormErrors(email, password) {
        let errors = [];

        // Reset incorrect class for login inputs before validating
        if (email_input) email_input.parentElement.classList.remove('incorrect');
        if (password_input) password_input.parentElement.classList.remove('incorrect');

        if (email === '' || email === null) {
            errors.push('Please enter your email.'); // Changed to match PHP phrasing
            if (email_input) email_input.parentElement.classList.add('incorrect');
        } else if (!isValidEmail(email)) {
            errors.push('Please enter a valid email address'); // Added email format validation for login
            if (email_input) email_input.parentElement.classList.add('incorrect');
        }

        if (password === '' || password === null) {
            errors.push('Please enter your password.'); // Changed to match PHP phrasing
            if (password_input) password_input.parentElement.classList.add('incorrect');
        }

        return errors;
    }

    // Helper function for basic email format validation
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Add input event listeners to clear errors as user types
    // Only add listeners to inputs that actually exist on the page
    [firstname_input, email_input, password_input, repeat_password_input].filter(input => input != null).forEach(input => {
        input.addEventListener('input', () => {
            if (input.parentElement.classList.contains('incorrect')) {
                input.parentElement.classList.remove('incorrect');
                // Clear the general error message only if no other errors are present
                if (error_message) {
                    // A more advanced approach would re-run validation on input
                    // For now, if the user corrects one field, we clear the general message.
                    // This might be less precise if multiple fields were invalid.
                    // To improve, you'd re-run the full validation and update the message.
                    error_message.innerText = '';
                }
            }
        });
    });
});