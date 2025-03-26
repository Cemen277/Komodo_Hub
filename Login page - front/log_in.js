document.getElementById("login_form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Stop default form behaviour

    const identifier = document.getElementById("identifier").value.trim();
    const password = document.getElementById("password").value.trim();
    

    if (!identifier || !password) {
        alert("Please fill in all fields");
        return;
    }

    const data = {
        identifier,
        password
    };

    const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
        alert("Loged in successfully!");
        // You can redirect here if needed
    } else {
        alert("Error: " + JSON.stringify(result));
    }
});
