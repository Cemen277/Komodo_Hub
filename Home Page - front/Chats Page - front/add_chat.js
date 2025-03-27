document.addEventListener("DOMContentLoaded", function () {
    const user_id = localStorage.getItem('user_id');
    console.log("Loaded user_id:", user_id);

    if (!user_id) {
        console.error("No user_id found in localStorage");
        return;
    }
    
    fetch("http://127.0.0.1:8000/api/list_users/", {
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

        const container = document.getElementById("chats_container");
        const chats_container = container.querySelector(".chats_container");


        data.forEach((user, index) => {
            const chat = document.createElement("div");
            chat.className = "chat";
            chat.innerHTML = `
                <img src="${user.profile_image}" alt="profile" class="profile_image">
                <div class="chat_name">${user.username}</div>
            `;

            chat.addEventListener("click", function(){
                fetch("http://127.0.0.1:8000/api/add_conversation/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        sender_id: user_id,
                        receiver_id: user.user_id
                    }),
                })
                .then(response => {
                    console.log("Raw response:", response);
                    if (!response.ok) {
                        throw new Error("Failed to fetch organisation name");
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.conversation_id) {
                        window.location.href = `chat_content.html?conversation_id=${data.conversation_id}`;
                    } else {
                        console.error("Missing conversation ID in API response:", data);
                        alert("Something went wrong creating the conversation.");
                    }
                })
                .catch(error => {
                    console.error("Conversation error:", error);
                });
            });

            const line = document.createElement("div");
            line.className = "line";

            chats_container.appendChild(chat);
            chats_container.appendChild(line);



        });

        
    })

    .catch(error => {
        console.error("Org fetch error:", error);
    });
});