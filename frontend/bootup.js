document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
        const screenWidth = window.innerWidth;
        if (screenWidth > 425) {
            window.location.href = "Redirect/redirect.html"; 
        } else {
            window.location.href = encodeURI("Login Page - front/log_in.html");
        }
    }, 2000); 
});