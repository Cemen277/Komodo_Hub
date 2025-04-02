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
    const user_id = localStorage.getItem("user_id");
    fetch("http://127.0.0.1:8000/api/list_programs/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id : user_id
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

        const container = document.getElementById("programme_container");
        const programs_container = container.querySelector(".programs_list");


        data.forEach((programme, index) => {
            const programme_list = document.createElement("div");
            programme_list.className = "chat";
            programme_list.innerHTML = `
                <div class="button-text">${programme.programme_name}</div>
                <button class="update" id="update">${programme.button_text}</button>
            `;

            const line = document.createElement("div");
            line.className = "line";

            programs_container.appendChild(programme_list);
            programs_container.appendChild(line);
            const update_button = programme_list.querySelector(".update");
            update_button.addEventListener("click", function () {
                if (programme.button_text == "Join"){
                    fetch("http://127.0.0.1:8000/api/update_programme/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            user_id: user_id,
                            programme_id: programme.programme_id
                        }),
                    })
                    .then(res => res.json())
                    .then(response => {
                        console.log("Update response:", response);
                        window.location.href = "registered.html";
                    })
                    .catch(error => {
                        console.error("Membership update error:", error);
                    });
                }
                else if (programme.button_text == "Leave"){
                    fetch("http://127.0.0.1:8000/api/leave_programme/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({user_id: user_id}),
                    })
                    .then(res => res.json())
                    .then(response => {
                        console.log("Update response:", response);
                        window.location.href = "registered.html";
                    })
                    .catch(error => {
                        console.error("Membership update error:", error);
                    });
                }
                    
            });


        });

        
    })

    .catch(error => {
        console.error("Org fetch error:", error);
    });
});