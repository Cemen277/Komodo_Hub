window.onload = function () {
    setTimeout(() => {
        const screenWidth = window.innerWidth;
        if (screenWidth >= 450) {
            window.location.href = "Redirect/redirect.html";
        } else {
            window.location.href = "login/log_in.html";
        }
    }, 200); 
};