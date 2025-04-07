document.addEventListener("DOMContentLoaded", function () {
    const message_input = document.getElementById("message_input");
    const send_button = document.getElementById("send_button");
    const media_button = document.getElementById("media_button");
    const media_upload = document.getElementById("media_upload");

    // Show/hide send/media button based on input
    message_input.addEventListener("input", function () {
        if (this.value.trim() !== "") {
            send_button.style.display = "inline-block";
            media_button.style.display = "none";
        } else {
            send_button.style.display = "none";
            media_button.style.display = "inline-block";
        }
    });

    media_button.addEventListener("click", function () {
        media_upload.click();
    });

    const user_id = localStorage.getItem('user_id');
    const params = new URLSearchParams(window.location.search);
    const conversation_id = params.get("conversation_id");

    if (!conversation_id || !user_id) {
        console.error("Missing conversation_id or user_id");
        return;
    }

    // Fetch other user's data
    fetch("https://komodo-hub.onrender.com/api/conversation_data/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            conversation_id : conversation_id,
            user_id : user_id
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch user data");
        }
        return response.json();
    })
    .then(data => {
        const chat_background = document.querySelector(".top");

        const image_name_container = document.createElement("div");
        image_name_container.className = "chat_background";
        image_name_container.innerHTML = `
            <div class="go_back">
                <img src="../Visuals/back.png" alt="Go Back">
            </div>
            <div class="image_container">
                <img src="${data.profile_image}" alt="Profile image">
            </div>
            <h2>${data.username}</h2>
        `;
        chat_background.innerHTML = "";
        chat_background.appendChild(image_name_container);

        // Fetch conversation messages
        fetch("https://komodo-hub.onrender.com/api/conversation_content/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                conversation_id : conversation_id,
                user_id : user_id
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch conversation content");
            }
            return response.json();
        })
        .then(convoData => {
            const scroll_block = document.getElementById("scroll_block");

            convoData.sender_data.forEach(message => {
                const messageDiv = document.createElement("div");
                messageDiv.className = "message right";
                messageDiv.textContent = message.message_out;
                scroll_block.appendChild(messageDiv);
            });

            convoData.receiver_data.forEach(message => {
                const messageDiv = document.createElement("div");
                messageDiv.className = "message left";
                messageDiv.textContent = message.message_out;
                scroll_block.appendChild(messageDiv);
            });

            scroll_block.scrollTop = scroll_block.scrollHeight;
        })
        .catch(error => {
            console.error("Conversation content error:", error);
        });

        // Send message handler
        send_button.addEventListener("click", function () {
            const message_text = message_input.value.trim();

            if (message_text !== "") {
                fetch("https://komodo-hub.onrender.com/api/send_message/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        conversation_id,
                        sender_id: user_id,
                        receiver_id: data.user_id, // from earlier fetch
                        message_content: message_text,
                        message_type: "message"
                    }),
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to send message");
                    }
                    return response.json();
                })
                .then(() => {
                    const messageDiv = document.createElement("div");
                    messageDiv.className = "message right";
                    messageDiv.textContent = message_text;

                    const scroll_block = document.getElementById("scroll_block");
                    scroll_block.appendChild(messageDiv);
                    scroll_block.scrollTop = scroll_block.scrollHeight;

                    message_input.value = "";
                    send_button.style.display = "none";
                    media_button.style.display = "inline-block";
                })
                .catch(error => {
                    console.error("Send message error:", error);
                });
            }
        });
    })
    .catch(error => {
        console.error("Conversation data error:", error);
    });
});
