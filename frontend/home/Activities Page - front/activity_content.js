document.addEventListener("DOMContentLoaded", function() {
    const user_type = localStorage.getItem('user_type');
    const home_page = document.getElementById("home_page");
    const account_page = document.getElementById("account_page");
    const community_page = document.getElementById("community_page");
    const library_page = document.getElementById("library_page");
    const create_page = document.getElementById("create_page");
    home_page.addEventListener("click", function(){
        if (user_type == "guest"){
            window.location.href = "home_page_nonreg.html";
        }
        else {
            window.location.href = "home_page.html";
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
            window.location.href = "/account/nonreg.html";
        }
        else{
            window.location.href = "/account/registered.html";
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
    const activity_id = params.get("activity_id");

    if (!activity_id) {
        console.error("No activity_id found in the link");
        return;
    }
    
    fetch("http://127.0.0.1:8000/api/activity_content/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({activity_id}),
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

        const activity_container = document.createElement("div");
        activity_container.className = "activity_block";

        activity_container.innerHTML = `
            <div class="header_container">
                <button class="go_back" onclick="window.location.href='activities.html';">
                    <img src="../Visuals/back.png" alt="Go back">
                </button>
                <h1>${data.activity_header}</h1>
            </div>
            <div class="line"></div>
            <div class="text_container">
                <p>${data.activity_text}</p>
            </div>
        `;

        container.appendChild(activity_container);
    })
    .catch(error => {
        console.error("Activity fetch error:", error);
    });
});