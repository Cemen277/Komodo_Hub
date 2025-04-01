document.addEventListener("DOMContentLoaded", function() {
    const user_type = localStorage.getItem('user_type');
    const home_page = document.getElementById("home_page");
    const account_page = document.getElementById("account_page");
    const community_page = document.getElementById("community_page");
    const create_page = document.getElementById("create_page");
    const library_page = document.getElementById("library_page");
    home_page.addEventListener("click", function(){
        if (user_type == "guest"){
            window.location.href = "../Home Page - front/home_page_nonreg.html";
        }
        else {
            window.location.href = "../Home Page - front/home_page.html";
        }
    })
    create_page.addEventListener("click", function(){
        if (user_type == "guest"){
            window.location.href = "../Create Page - front/create_nonreg.html";
        }
        else {
            window.location.href = "../Create Page - front/create_reg.html";
        }
    })
    library_page.addEventListener("click", function(){
        if (user_type == "guest"){
            window.location.href = "library.html";
        }
        else {
            window.location.href = "library.html";
        }
    })
    account_page.addEventListener("click", function(){
        if (user_type == "guest"){
            window.location.href = "../Account  Page - front/nonreg.html";
        }
        else{
            window.location.href = "../Account  Page - front/registered.html";
        }
    })
    community_page.addEventListener("click", function(){
        if (user_type == "guest"){
            window.location.href = "../Community Page - front/community_hub.html";
        }
        else{
            window.location.href = "../Community Page - front/community_hub.html";
        }
    })
});


document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const article_id = params.get("article_id");
    const library_id = params.get("library_id");

    if (!article_id) {
        console.error("No activity_id found in the link");
        return;
    }
    
    fetch("http://127.0.0.1:8000/api/article_content/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({article_id}),
    })
    .then(response => {
        console.log("Raw response:", response);
        if (!response.ok) {
            throw new Error("Failed to fetch article");
        }
        return response.json();
    })
    .then(data => {

        const container = document.querySelector(".block_wrapper");

        const article_container = document.createElement("div");
        article_container.className = "article-container";

        article_container.innerHTML = `
            <div class="article-header">
                <div class="back-button" onclick="window.location.href='library1.html?library_id=${library_id}';">
                    <img src="Visuals/back.png" alt="Go back" class="back-icon">
                </div>
                <div class="article-title">${data.article_header}</div>
            </div>
            <div class="line"></div>
            <div class="article-content">${data.article_text}</div>
            <div class="article_media">
                <img src="${data.media_url}" alt="Article Media" id="article_img">
            </div>
            <div class="article-content">${timeAgo(data.created_timestamp)}</div>
        `;

        const article_img = article_container.querySelector("#article_img");
            if (data.media) {
                article_img.src = `http://127.0.0.1:8000${data.media}`;
            }

        container.appendChild(article_container);
    })
    .catch(error => {
        console.error("Activity fetch error:", error);
    });
});

function timeAgo(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) return "Unknown time"; 

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