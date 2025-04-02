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
            window.location.href = "library.html";
        }
        else{
            window.location.href = "library.html";
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
    const library_id = params.get("library_id");

    if (!library_id) {
        console.error("No library_id found in the link");
        return;
    }

    fetch("http://127.0.0.1:8000/api/library_content/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ library_id }),
    })
    .then(response => {
        console.log("Raw response:", response);
        if (!response.ok) {
            throw new Error("Failed to fetch organisation name");
        }
        return response.json();
    })
    .then(data => {
        const container = document.querySelector(".block_wrapper");

        const summury_container = document.createElement("div");
        summury_container.className = "library-summary-container";

        summury_container.innerHTML = `
            <div class="library-summary-header">
                <div class="back-button-container" onclick="window.location.href='library.html';">
                    <img src="Visuals/back.png" alt="Back Button" class="back-button">
                </div>
                <div class="library-summary-text">
                    <span class="library-summary-title">${data.organisation.organisation_name}</span>
                    <span class="library-summary-members">${data.organisation.members_num} members</span>
                </div>
            </div>
            <div class="library-summary-content">
                ${data.organisation.organisation_description}
            </div>
        `;
        container.appendChild(summury_container);

        data.articles.forEach((article) => {
            const article_container = document.createElement("button");
            article_container.className = "article";
            article_container.setAttribute("data-article-id", article.article_id);

            article_container.addEventListener("click", function () {
                const article_id = this.getAttribute("data-article-id");
                window.location.href = `article-content.html?library_id=${library_id}&article_id=${article_id}`;
            });

            article_container.innerHTML = `
                <div class="article-title-container">
                    <span class="article-title">${article.article_header}</span>
                    <img src="Visuals/next.png" alt="more_info_button" class="next_button">
                </div>
                <div class="article-image-container">
                    <img src="${article.cover_image}" alt="article Image" id="cover_image">
                </div>
            `;

            const cover_img = article_container.querySelector("#cover_image");
            if (article.cover_image) {
                cover_img.src = `http://127.0.0.1:8000${article.cover_image}`;
            }

            container.appendChild(article_container);
        });
    })
    .catch(error => {
        console.error("Activity fetch error:", error);
    });
});
