document.addEventListener("DOMContentLoaded", function () {
    const user_id = localStorage.getItem('user_id');
    console.log("Loaded user_id:", user_id);

    if (!user_id) {
        console.error("No user_id found in localStorage");
        return;
    }
    
    fetch("http://127.0.0.1:8000/api/organisation_activity/", {
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


        data.forEach((activity, index) => {
            const activity_block = document.createElement("div");
            activity_block.className = "block";

            activity_block.setAttribute("data_activity_id", activity.activity_id);

            activity_block.addEventListener("click", function () {
                const activity_id = this.getAttribute("data_activity_id");
                window.location.href = `activity_content.html?activity_id=${activity_id}`;
            });

            activity_block.innerHTML = `
                <div class="header">
                    <div class="text_container">${activity.activity_header}</div>
                    <img src="../Visuals/next.png" alt="next" class="next_button">
                </div>
                <div class="image_container">
                    <img src="${activity.cover_image}" alt="activity image">
                </div>
            `
            container.appendChild(activity_block);



        });

        
    })

    .catch(error => {
        console.error("Org fetch error:", error);
    });
});