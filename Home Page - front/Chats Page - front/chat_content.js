const message_input = document.getElementById("message_input");
const send_button = document.getElementById("send_button");
const media_button = document.getElementById("media_button");
const out = document.getElementById("out");
const scroll_block = document.getElementById("scroll_block");
const media_upload = document.getElementById("media_upload");

// Make sure that the media button is always a default 
window.onload = function () {
    send_button.style.display = "none";
    media_button.style.display = "inline-block"; 
};

document.addEventListener("DOMContentLoaded", function () {
    const user_id = localStorage.getItem('user_id');
    const params = new URLSearchParams(window.location.search);
    const conversation_id = params.get("conversation_id");
    
    if (!conversation_id || !user_id) {
        console.error("Missing conversation_id or user_id");
        return;
    }
    
    fetch("http://127.0.0.1:8000/api/conversation_data/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            conversation_id,
            user_id: user_id
        }),
    })
    .then(response => {
        console.log("Raw response:", response);
        if (!response.ok) {
            throw new Error("Failed to fetch username");
        }
        return response.json();
    })
    .then(data => {

        const chat_background = document.querySelector(".chat_background");
        const image_name_container = document.createElement("div");
        image_name_container.className = "image_name_container";

        image_name_container.innerHTML = `
            <div class="go_back">
                <img src="../Visuals/back.png" alt="Go Back">
            </div>
            <div class="image_container">
                <img src="${data.profile_image}" alt="Profile image">
            </div>
            <h2>${data.username}</h2>
        `;

        chat_background.appendChild(image_name_container);
    })
    .catch(error => {
        console.error("Conversation error:", error);
    });

});

// Changing media to send and vise verse
message_input.addEventListener("input", function(){
    if (this.value.trim() !== "") {
        send_button.style.display = "inline-block";
        media_button.style.display = "none";

    }
    else {
        send_button.style.display = "none";
        media_button.style.display = "inline-block";
    }
});

// Send the message
send_button.addEventListener("click", function(){
    let message_text = message_input.value.trim();

    if (message_text !== ""){
        let message = document.createElement("div");
        message.classList.add("message", "right");
        message.innerText = message_text;

        scroll_block.appendChild(message);

        message_input.value = "";
        send_button.style.display = "none";
        media_button.style.display = "inline-block";
    }
    
});

// Open the file explorer to upload image or video
media_button.addEventListener("click", function(){
    media_upload.click();
});
