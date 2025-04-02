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
            window.location.href = "create_nonreg.html";
        }
        else {
            window.location.href = "create_reg.html";
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

document.addEventListener("DOMContentLoaded", function(){
    const textarea = document.getElementById("user_message");

    textarea.addEventListener("input", function(){ 
        this.style.height = "auto";
        this.style.height = (this.scrollHeight) + "px";
    })
})

document.addEventListener("DOMContentLoaded", function() { // For Letter counter
    const textarea = document.getElementById("user_message");
    const letterCounter = document.getElementById("letter_counter");
    const maxLength = textarea.getAttribute("maxlength");

    textarea.addEventListener("input", function() {
        const letterCount = textarea.value.trim().length;
        letterCounter.textContent = `${letterCount}/${maxLength}`;
    });
});

document.getElementById("upload_container").addEventListener("click", function(){
    document.getElementById("media_input").click();
});

document.getElementById("publish_button").addEventListener("click", async function(event) {
    const user_id = localStorage.getItem("user_id");
    event.preventDefault(); 

    const fileInput = document.getElementById("media_input");
    const file = fileInput.files[0];
    const text = document.getElementById("user_message").value.trim();

    if (!text || !file) {
        alert("Please write a message and upload a file before publishing.");
        return;
    }

    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("post_text", text);
    formData.append("media", file);

    const response = await fetch("http://127.0.0.1:8000/api/create_post/", {
        method: "POST",
        body: formData,
    });

    const result = await response.json();
    
    if (response.ok) {
        alert("Post published successfully!");
        window.location.href = "../Community Page - front/community_hub.html";
    } else {
        alert("Failed to publish post: " + JSON.stringify(result));
    }
});
