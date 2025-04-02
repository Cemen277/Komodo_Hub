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
    
    const delete_button_current = document.getElementById("delete_button_current")
    const delete_button_new = document.getElementById("delete_button_new")
    console.log(user_id)

    delete_button_current.addEventListener("click", function(){
        const password = document.getElementById("change_password");
        let current = password.value.trim();

        if (current != ""){
            password.value = "";
        }
    });

    delete_button_new.addEventListener("click", function(){
        const new_password = document.getElementById("new_password");
        let new_pass = new_password.value.trim();

        if (new_pass != ""){
            new_password.value = "";
        }
    });

    
    update_button.addEventListener("click", function(){
        const password = document.getElementById("change_password").value.trim();
        const new_password = document.getElementById("new_password").value.trim();

        if (!password || !new_password) {
            console.error("No user_id found");
            return;
        }

        const data = {
            user_id : user_id,
            password : password,
            new_password : new_password
        }
        fetch("http://127.0.0.1:8000/api/change_password/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            console.log("Raw response:", response);
            if (!response.ok) {
                throw new Error("Password doesn't mactch");
            }
            return response.json();
        })

        .then(data => {
            document.getElementById("change_password").value = "";
            document.getElementById("new_password").value = "";
        })
        .catch(error => {
            console.error("Update error:", error);
        });

        
    })
    
    
    
    
    
    
});

