document.addEventListener("DOMContentLoaded", function() {
    const user_type = localStorage.getItem('user_type');
    const home_page = document.getElementById("home_page");
    const account_page = document.getElementById("account_page");
    const community_page = document.getElementById("community_page");
    const library_page = document.getElementById("library_page");
    const create_page = document.getElementById("create_page");
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
            window.location.href = "#";
        }
    })
    community_page.addEventListener("click", function(){
        if (user_type == "guest"){
            window.location.href = "../Community Page - front/community_hub.html";
        }
        else {
            window.location.href = "../Community Page - front/community_hub.html";
        }
    })
});


document.addEventListener("DOMContentLoaded", function () {
    fetch("http://127.0.0.1:8000/api/add_library/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
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


        data.forEach((library, index) => {
            const library_block = document.createElement("button");
            library_block.className = "post";

            library_block.setAttribute("data-library-id", library.library_id);

            library_block.addEventListener("click", function () {
                const library_id = this.getAttribute("data-library-id");
                window.location.href = `library1.html?library_id=${library_id}`;
            });

            library_block.innerHTML = `
                <div class="post-title-container">
                    <span class="post-title">${library.organisation_name}</span>
                    <img src="Visuals/next.png" alt="more_info_button" class="next_button">
                </div>
                <div class="post-image-container">
                    <img src="${library.image}" alt="Post Image">
                </div>
            `
            container.appendChild(library_block);



        });

        
    })

    .catch(error => {
        console.error("Org fetch error:", error);
    });
});