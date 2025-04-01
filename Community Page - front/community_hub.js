document.addEventListener("touchstart", function() {}, true);
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
            window.location.href = "../Library_Page/library.html";
        }
        else{
            window.location.href = "../Library_Page/library.html";
        }
    })
    account_page.addEventListener("click", function(){
        if (user_type == "guest"){
            window.location.href = "../Library_Page/library.html";
        }
    })
    community_page.addEventListener("click", function(){
        if (user_type == "guest"){
            window.location.href = "community_hub.html";
        }
        else{
            window.location.href = "community_hub.html";
        }
    })
});


document.addEventListener("DOMContentLoaded", function() {
    const user_id = localStorage.getItem('user_id');
    const user_type = localStorage.getItem('user_type');
    
    console.log("Loaded user_id:", user_id);
    fetch("http://127.0.0.1:8000/api/pull_posts/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((response) => response.json())
    .then(data => {
        const container = document.querySelector(".block_wrapper");

        data.forEach((post, index) => {
            const community_block = document.createElement("div");
            community_block.className = "community_container";
            community_block.innerHTML = `
                <div class="profile_container">
                    <div class="profile_image">
                        <img src="${post.profile_image}" alt="User Image" class="profile_picture">
                    </div>
                    <div class="user_details">
                        <div class="username">${post.username}</div>
                        <div class="community_name">${post.organisation_name}</div>
                    </div>
                    <div class="more_button">
                        <img src="Visuals/more.png" alt="more_button">
                    </div>
                </div>
                <div class="user_message">
                    <p class="message" name="message" id="user_message" maxlength="500">${post.post_text}</p>
                </div>


                <div class="file_container">
                    <img class="image_file" src="${post.media}" alt="Post image" style="display: none;">
                    <video class="video_file" controls style="display: none;"></video>
                </div>
                <div class="button_section">
                    <div class="like">
                        <img class="like_button" id="like_button" src="Visuals/like - unpressed.png" alt="like_button">
                        <div class="like_counter">${post.likes_count}</div>
                    </div>
                    <div class="comment">
                        <img src="Visuals/comment - unpressed.png" alt="comment_button" class="comment_button">
                        <div class="comment_counter">${post.comments_count}</div>
                    </div>
                    <div class="time_posted">
                        <div class="time_stamp">${timeAgo(post.created_timestamp)}</div>
                    </div>
                </div>
            `
            
            container.appendChild(community_block);

            const imageEl = community_block.querySelector(".image_file");
            const videoEl = community_block.querySelector(".video_file");

            if (post.media && (post.media.endsWith(".jpg") || post.media.endsWith(".png"))) {
                imageEl.style.display = "block";
                imageEl.src = post.media;
            } else if (post.media && post.media.endsWith(".mp4")) {
                videoEl.style.display = "block";
                videoEl.src = post.media;
            }
            
            const like_button = community_block.querySelector(".like_button");
            like_button.addEventListener("click", function(){
                if (user_type == "guest"){
                    alert("Please sign up first.");
                }
            
                const data = {
                    "post_id" : post.post_id,
                    "user_id" : user_id
                };
            
                fetch("http://127.0.0.1:8000/api/add_like/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });

                like_button.style.display = "block";
            })




        });

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
        h: 3600,
        minute: 60,
    };

    for (const [unit, seconds] of Object.entries(intervals)) {
        const count = Math.floor(secondsAgo / seconds);
        if (count >= 1) {
            return `${count}${unit}${count > 1 ? "s" : ""} ago`;
        }
    }
    return "Just now";
}