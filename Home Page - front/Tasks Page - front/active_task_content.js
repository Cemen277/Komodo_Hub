document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const task_id = params.get("task_id");

    if (!task_id) {
        console.error("No task_id found in the link");
        return;
    }
    
    fetch("http://127.0.0.1:8000/api/active_task_content/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({task_id}),
    })
    .then(response => {
        console.log("Raw response:", response);
        if (!response.ok) {
            throw new Error("Failed to fetch organisation name");
        }
        return response.json();
    })
    .then(data => {

        const container = document.querySelector(".block_wraper");

        const task_container = document.createElement("div");
        task_container.className = "task_block";

        task_container.innerHTML = `
            <div class="header_container">
                <button class="go_back" onclick="window.location.href='all_tasks.html';">
                    <img src="../Visuals/back.png" alt="Go back">
                </button>
                <h1>${data.task_name}</h1>
               
            </div>
            <div class="line"></div>

            <label class="checkbox_container">
                <input type="checkbox" id="custom checkbox">
                <span class="checkmark"></span>
                Mark as completed
            </label>

            <div class="text_container">
                <p>${data.task_description}</p>
            </div>
            <div class="timestamp">
                <p>${timeAgo(data.created_timestamp)}</p>
            </div>
        `;

        container.appendChild(task_container);
    })
    .catch(error => {
        console.error("Activity fetch error:", error);
    });
});

function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const secondsAgo = Math.floor((now - date) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
    };

    for (const [unit, seconds] of Object.entries(intervals)) {
        const count = Math.floor(secondsAgo / seconds);
        if (count >= 1) {
            return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
        }
    }
    return "Just now";
}