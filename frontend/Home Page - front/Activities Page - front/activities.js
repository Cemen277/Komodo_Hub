console.log("Checking control button presence:");
console.log("home:", document.getElementById("home_page"));
console.log("create:", document.getElementById("create_page"));

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

            activity_block.setAttribute("data-activity-id", activity.activity_id);

            activity_block.addEventListener("click", function () {
                const activity_id = this.getAttribute("data-activity-id");
                window.location.href = `activity_content.html?activity_id=${activity_id}`;
            });


            activity_block.innerHTML = `
                <div class="header">
                    <div class="text_container">${activity.activity_header}</div>
                    <img src="../Visuals/next.png" alt="next" class="next_button">
                </div>
                <div class="image_container">
                    <img src="${activity.cover_image}" alt="activity image" id="cover_image">
                </div>
            `

            const cover_img = activity_block.querySelector("#cover_image");
            if (activity.cover_image) {
                cover_img.src = `http://127.0.0.1:8000${activity.cover_image}`;
            }
            container.appendChild(activity_block);



        });

        
    })

    .catch(error => {
        console.error("Org fetch error:", error);
    });
});