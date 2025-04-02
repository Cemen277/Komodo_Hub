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