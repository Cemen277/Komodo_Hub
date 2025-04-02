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
    fetch("http://127.0.0.1:8000/api/list_organisations/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(response => {
        console.log("Raw response:", response);
        if (!response.ok) {
            throw new Error("Failed to fetch organisation name");
        }
        return response.json();
    })
    .then(data => {

        const container = document.getElementById("organisation_container");
        const organisations_container = container.querySelector(".organisations_list");


        data.forEach((organisation, index) => {
            const organisation_list = document.createElement("div");
            organisation_list.className = "chat";
            organisation_list.innerHTML = `
                <div class="button-text">${organisation.organisation_name}</div>
                <img src="Visuals/next.png" alt="Next" class="next_image">
            `;

            const line = document.createElement("div");
            line.className = "line";

            organisation_list.addEventListener("click", function(){
                if (organisation.organisation_id) {
                    window.location.href = `join_community.html?organisation_id=${organisation.organisation_id}`;
                } else {
                    console.error("Missing conversation ID in API response:", data);
                    alert("Something went wrong creating the conversation.");
                }
            });

            

            organisations_container.appendChild(organisation_list);
            organisations_container.appendChild(line);



        });

        
    })

    .catch(error => {
        console.error("Org fetch error:", error);
    });
});