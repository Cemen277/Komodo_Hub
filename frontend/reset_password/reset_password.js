document.getElementById("reset_password_form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Stop default form behaviour

    const new_password = document.getElementById("new_password").value.trim();

    if (new_password == "") {
        alert("Please enter your new password");
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const data = {
        new_password,
        token,
    };

    const response = await fetch("http://127.0.0.1:8000/api/new_password/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
        alert("Password reset successful!");
        window.location.href = encodeURI("/login/log_in.html");
    } else {
        alert("Error: " + JSON.stringify(result));
    }
});
