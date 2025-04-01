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

    if (response.ok && result.user_id) {
        localStorage.setItem("user_id", result.user_id);
        console.log("Stored user_id:", result.user_id);
        alert("Logged in successfully!");
        
        window.location.href = "http://127.0.0.1:5500/Community%20Page%20-%20front/community_hub.html";
    } else {
        alert("Error: " + JSON.stringify(result));
    }
});

function guest_mode(){
    localStorage.setItem("user_id", "guest_" + Date.now());
    localStorage.setItem("user_type", "guest");
    window.location.href = "../Community Page - front/community_hub.html";
}