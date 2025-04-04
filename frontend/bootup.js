document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
        const screenWidth = window.innerWidth;
        if (screenWidth >= 450) {
            window.location.href = "Redirect/redirect.html"; 
        } else {
            window.location.href = encodeURI("login/log_in.html");
        }
    }, 2000); 
});