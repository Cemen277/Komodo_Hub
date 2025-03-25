document.addEventListener("touchstart", function() {}, true);

document.getElementById("login_form").addEventListener("submit", function(event) {
    const login = document.getElementById("login").value;
    const password = document.getElementById("password").value;

    if (login == "" && password == ""){
        alert("Please fill in all fields");
        event.preventDefault();
    }
});
