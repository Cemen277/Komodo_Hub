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
