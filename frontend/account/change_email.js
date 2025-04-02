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
    const update_button = document.getElementById("update");
    const user_id = localStorage.getItem("user_id");
    const input_placeholder = document.getElementById("change_email");
    const delete_button = document.getElementById("delete_button")
    console.log(user_id)

    delete_button.addEventListener("click", function(){
        let email_input = change_email.value.trim();

        if (email_input != ""){
            change_email.value = "";
        }
    });

    fetch("http://127.0.0.1:8000/api/get_user_info/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user_id }),
    })
    .then((response) => response.json())
    .then(data => {
        input_placeholder.placeholder = data.email;
    })
    .catch(error => {
        console.error("Error fetching user info:", error);
    });
    update_button.addEventListener("click", function(){
        const new_email = document.getElementById("change_email").value.trim()
        if (!user_id || !new_email) {
            console.error("No user_id found");
            return;
        }

        const data = {
            user_id : user_id,
            new_email : new_email
        }
        fetch("http://127.0.0.1:8000/api/update_email/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            console.log("Raw response:", response);
            if (!response.ok) {
                throw new Error("Failed to fetch user_id");
            }
            return response.json();
        })

        .then(data => {
            input_placeholder.placeholder = new_email;
            input_placeholder.value = "";
        })
        .catch(error => {
            console.error("Update error:", error);
        });
    })
    
    
    
    
    
    
});

