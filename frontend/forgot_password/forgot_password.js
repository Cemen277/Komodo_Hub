document.getElementById("forgot_password_button").addEventListener("click", async function(event) {
    event.preventDefault(); 

    const email = document.getElementById("email").value.trim();

    if (email == "") {
        alert("Please enter your email");
        return;
    }

    const data = {
        email: email,
    };

    const response = await fetch("https://komodo-hub.onrender.com/api/reset_password/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
        alert("Password reset sent!");
        
    } else {
        alert("Error: " + JSON.stringify(result));
    }
});
