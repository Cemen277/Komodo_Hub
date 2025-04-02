document.getElementById("sign_up_form").addEventListener("submit", async function(event) {
    event.preventDefault(); 

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
        user_type: "student", 
        username  
    };

    const response = await fetch("https://komodo-hub.onrender.com/api/register/", {
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
        window.location.href = "/community/community_hub.html";

    } else {
        alert("Error: " + JSON.stringify(result));
    }
});
