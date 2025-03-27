document.addEventListener("DOMContentLoaded", function () {
    const user_id = localStorage.getItem('user_id');
    console.log("Loaded user_id:", user_id);

    if (!user_id) {
        console.error("No user_id found in localStorage");
        return;
    }
    
    fetch("http://127.0.0.1:8000/api/active_tasks/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({user_id}),
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


        data.forEach((task, index) => {
            const tasks_block = document.createElement("div");
            tasks_block.className = "task_container";

            tasks_block.setAttribute("data_task_id", task.task_id);

            tasks_block.addEventListener("click", function () {
                const task_id = this.getAttribute("data_task_id");
                window.location.href = `active_task_content.html?task_id=${task_id}`;
            });

            tasks_block.innerHTML = `
                <h1>${task.task_name}</h1>
                <button class="open_task">
                    <img src="../Visuals/next.png" alt="Open task">
                </button>

            `
            container.appendChild(tasks_block);



        });

        
    })

    .catch(error => {
        console.error("Org fetch error:", error);
    });
});