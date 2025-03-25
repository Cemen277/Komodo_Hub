document.addEventListener("touchstart", function() {}, true);

document.getElementById("forgot_password_form").addEventListener("submit", function(event) {
    const password = document.getElementById("password").value;

    if (password == ""){
        alert("Please fill in the field");
        event.preventDefault();
    }
});
