document.getElementById("forgot_password_form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Stop default form behaviour

    const email = document.getElementById("email").value.trim();

    if (email == "") {
        alert("Please enter your email");
        return;
    }

    const data = {
        email,
    };

    const response = await fetch("http://127.0.0.1:8000/api/reset_password/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
        alert("Password reset sent!");
        // You can redirect here if needed
    } else {
        alert("Error: " + JSON.stringify(result));
    }
});
