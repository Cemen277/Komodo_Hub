document.getElementById("sign_up_form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Stop default form behaviour

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const full_name = document.getElementById("full_name").value.trim();
    const username = document.getElementById("username").value.trim();

    if (!email || !password || !full_name || !username) {
        alert("Please fill in all fields");
        return;
    }

    const data = {
        email,
        password,
        full_name,
        user_type: "student", // or any default you'd like
        username  // include only if your backend supports it
    };

    const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok && result.user_id) {
        localStorage.setItem("user_id", result.user_id);
        localStorage.setItem("user_type", "user");
        alert("Signed up successfully!");
        window.location.href = "../Community Page - front/community_hub.html";

    } else {
        alert("Error: " + JSON.stringify(result));
    }
});
