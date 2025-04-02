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
            window.location.href = "/account/nonreg.html";
        }
        else{
            window.location.href = "/account/registered.html";
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
                        <img class="like_button-np" id="like_button-np" src="Visuals/like - unpressed.png" alt="like_button" style="display: block;">
                        <img class="like_button-p" id="like_button-p" src="Visuals/like - pressed.png" alt="like_button" style="display: none;">
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
            
            const mediaUrl = post.media ? `http://127.0.0.1:8000${post.media}` : null;

            if (mediaUrl && (mediaUrl.endsWith(".jpg") || mediaUrl.endsWith(".png") || mediaUrl.endsWith(".jpeg"))) {
                imageEl.style.display = "block";
                imageEl.src = mediaUrl;
            } else if (mediaUrl && mediaUrl.endsWith(".mp4")) {
                videoEl.style.display = "block";
                videoEl.src = mediaUrl;
            } 

            const profile_image = community_block.querySelector(".profile_picture");
            if (profile_image && post.profile_image) {
                profile_image.src = `http://127.0.0.1:8000${post.profile_image}`;
            }
            
            const like_button_np = community_block.querySelector(".like_button-np");
            const like_button_p = community_block.querySelector(".like_button-p");
            const like_counter = community_block.querySelector(".like_counter");

            like_button_np.addEventListener("click", function() {
                if (user_type === "guest") {
                    alert("Please sign up first.");
                    return;
                }

                const data = {
                    "post_id": post.post_id,
                    "user_id": user_id
                };

                fetch("http://127.0.0.1:8000/api/add_like/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                })
                .then(res => {
                    if (res.ok) {
                        like_button_np.style.display = "none";
                        like_button_p.style.display = "block";

                        // Optional: increment the like count on click
                        let count = parseInt(like_counter.textContent, 10);
                        like_counter.textContent = count + 1;
                    }
                });
            });



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