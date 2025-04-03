document.getElementById("reset_password_button").addEventListener("click", async function(event) {
    event.preventDefault(); 

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

    const response = await fetch("https://komodo-hub.onrender.com/api/new_password/", {
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
