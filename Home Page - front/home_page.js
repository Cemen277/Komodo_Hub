document.addEventListener("DOMContentLoaded", function () {
    const user_id = localStorage.getItem('user_id');
    console.log("Loaded user_id:", user_id);

    if (!user_id) {
        console.error("No user_id found in localStorage");
        return;
    }

    fetch("http://127.0.0.1:8000/api/organisation_name/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id }),
    })
    .then(response => {
        console.log("Raw response:", response);
        if (!response.ok) {
            throw new Error("Failed to fetch organisation name");
        }
        return response.json();
    })
    .then(data => {
        console.log("Got org data:", data);
        const org_name = data.organisation_name || "No organisation assigned yet";
        const prog_name = data.programme_name || "No programme assigned yet";
        document.getElementById('organisation_name').innerText = org_name;
        document.getElementById('programme_name').innerText = prog_name;
        
    })

    .catch(error => {
        console.error("Org fetch error:", error);
    });
});