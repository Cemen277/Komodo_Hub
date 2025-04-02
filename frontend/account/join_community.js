document.addEventListener("DOMContentLoaded", function() {
    const user_type = localStorage.getItem('user_type');
    const home_page = document.getElementById("home_page");
    const account_page = document.getElementById("account_page");
    const community_page = document.getElementById("community_page");
    const library_page = document.getElementById("library_page");
    const create_page = document.getElementById("create_page");
    home_page.addEventListener("click", function(){
        if (user_type == "guest"){
            window.location.href = "/home/home_page_nonreg.html";
        }
        else {
            window.location.href = "/home/home_page.html";
        }
    })
    create_page.addEventListener("click", function(){
        if (user_type == "guest"){
            window.location.href = "/create/create_nonreg.html";
        }
        else {
            window.location.href = "/create/create_reg.html";
        }
    })
    library_page.addEventListener("click", function(){
        if (user_type == "guest"){
            window.location.href = "/library/library.html";
        }
        else{
            window.location.href = "/library/library.html";
        }
    })
    account_page.addEventListener("click", function(){
        if (user_type == "guest"){
            window.location.href = "nonreg.html";
        }
        else{
            window.location.href = "registered.html";
        }
    })
    community_page.addEventListener("click", function(){
        if (user_type == "guest"){
            window.location.href = "/community/community_hub.html";
        }
        else{
            window.location.href = "/community/community_hub.html";
        }
    })
});

document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const organisation_id = params.get("organisation_id");
    const user_id = localStorage.getItem("user_id");
    if (!organisation_id) {
        console.error("No organisation_id found in the link");
        return;
    }

    fetch("https://komodo-hub.onrender.com/api/join_organisation/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            organisation_id : organisation_id,
            user_id : user_id
        }),
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

        const summury_container = document.createElement("div");
        summury_container.className = "organisation-summary-container";

        summury_container.innerHTML = `
            <div class="organisation-summary-header">
                <div class="back-button-container" onclick="window.location.href='change_community.html';">
                    <img src="Visuals/back.png" alt="Back Button" class="back-button">
                </div>
                <div class="organisation-summary-text">
                    <span class="organisation-summary-title">${data.organisation_name}</span>
                    <span class="organisation-summary-members">${data.members_num} members</span>
                </div>
            </div>
            <div class="organisation-summary-content">
                ${data.organisation_description}
            </div>
            <button class="update" id="update">${data.button_text}</button>
        `;
        container.appendChild(summury_container);
        const update_button = document.getElementById("update");
        update_button.addEventListener("click", function () {
            if (data.button_text == "Join"){
                fetch("https://komodo-hub.onrender.com/api/update_organisation/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_id: user_id,
                        organisation_id: organisation_id
                    }),
                })
                .then(res => res.json())
                .then(response => {
                    console.log("Update response:", response);
                    window.location.href = "change_community.html";
                })
                .catch(error => {
                    console.error("Membership update error:", error);
                });
            }
            else if (data.button_text == "Leave"){
                fetch("https://komodo-hub.onrender.com/api/leave_organisation/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({user_id: user_id}),
                })
                .then(res => res.json())
                .then(response => {
                    console.log("Update response:", response);
                    window.location.href = "change_community.html";
                })
                .catch(error => {
                    console.error("Membership update error:", error);
                });
            }
                
        });
        
    })
    .catch(error => {
        console.error("Activity fetch error:", error);
    });
});
