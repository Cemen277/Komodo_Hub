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
    const organisation = document.getElementById("organisation");
    const user_id = localStorage.getItem("user_id");
    const username = document.getElementById("username");
    const full_name = document.getElementById("full_name");
    const check_org = document.getElementById("programme_button");
    const profile_img = document.getElementById("profile_image");

    console.log(user_id)

    fetch("https://komodo-hub.onrender.com/api/get_user_info/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user_id }),
    })
    .then((response) => response.json())
    .then(data => {
        organisation.textContent = data.organisation_name;
        username.textContent = data.username;
        full_name.textContent = data.full_name;

        if (data.profile_image) {
            profile_img.src = data.profile_image;
        }

        if (data.organisation_name == "No organisation yet") {
            check_org.style.display = "none";
        }


    })
    .catch(error => {
        console.error("Error fetching user info:", error);
    });
    
    
});

document.addEventListener("DOMContentLoaded", function () {
    const mediaInput = document.getElementById("media_input");
    const user_id = localStorage.getItem("user_id");

    if (mediaInput && user_id) {
        mediaInput.addEventListener("change", async function () {
            const file = mediaInput.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("media", file);
            formData.append("user_id", user_id);  

            try {
                const response = await fetch("https://komodo-hub.onrender.com/api/profile_image/", {
                    method: "POST",
                    body: formData,
                });

                const result = await response.json();

                if (response.ok) {
                    alert("Profile image updated successfully!");
                    document.getElementById("profile_image").src = `${result.media_url}?t=${Date.now()}`;
                    window.location.href = "registered.html"; 
                } else {
                    alert("Upload failed: " + JSON.stringify(result));
                }
            } catch (err) {
                console.error("Upload error:", err);
                alert("An error occurred while uploading.");
            }
        });
    }
});
