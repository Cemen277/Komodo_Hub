document.addEventListener("touchstart", function() {}, true);

document.getElementById("forgot_password_form").addEventListener("submit", function(event) {
    const email = document.getElementById("email").value;

    if (email == ""){
        alert("Please fill in the field");
        event.preventDefault();
    }
});
