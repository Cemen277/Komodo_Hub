document.addEventListener("touchstart", function() {}, true);

document.getElementById("sign_up_form").addEventListener("submit", function(event) {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const fullname = document.getElementById("fullname").value;
    const username = document.getElementById("username").value;

    if (email == "" && password == "" && fullname == "" && username == ""){
        alert("Please fill in all fields");
        event.preventDefault();
    }
});
