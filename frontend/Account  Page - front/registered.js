document.addEventListener("touchstart", function() {}, true);
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
            window.location.href = "../Library_Page/library.html";
        }
        else {
            window.location.href = "../Library_Page/library.html";
        }
    })
    account_page.addEventListener("click", function(){
        if (user_type == "guest"){
            window.location.href = "nonreg.html";
        }
        else {
            window.location.href = "registered.html";
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
    const organisation = document.getElementById("organisation");
    const user_id = localStorage.getItem("user_id");
    const username = document.getElementById("username");
    const full_name = document.getElementById("full_name");
    const check_org = document.getElementById("programme_button");
    const profile_img = document.getElementById("profile_image");

    console.log(user_id)

    fetch("http://127.0.0.1:8000/api/get_user_info/", {
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
            profile_img.src = `http://127.0.0.1:8000${data.profile_image}`;
        }

        if (data.organisation_name == "No organisation yet") {
            check_org.style.display = "none";
        }


    })
    .catch(error => {
        console.error("Error fetching user info:", error);
    });
    
    
});

document.getElementById("media_input").addEventListener("change", async function () {
    const file = this.files[0];
    const user_id = localStorage.getItem("user_id");

    if (!file || !user_id) return;

    const formData = new FormData();
    formData.append("media", file);
    formData.append("user_id", user_id);  

    try {
        const response = await fetch("http://127.0.0.1:8000/api/profile_image/", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (response.ok) {
            alert("Profile image updated successfully!");
            document.getElementById("profile_image").src = URL.createObjectURL(file); 
        } else {
            alert("Upload failed: " + JSON.stringify(result));
        }
    } catch (err) {
        console.error("Upload error:", err);
        alert("An error occurred while uploading.");
    }
});

