document.addEventListener("DOMContentLoaded", function() {
    const user_type = localStorage.getItem('user_type');
    const home_page = document.getElementById("home_page");
    const account_page = document.getElementById("account_page");
    const community_page = document.getElementById("community_page");
    const library_page = document.getElementById("library_page");
    const create_page = document.getElementById("create_page");
    home_page.addEventListener("click", function(){
        if (user_type == "guest"){
            window.location.href = "home_page_nonreg.html";
        }
    })
    create_page.addEventListener("click", function(){
        if (user_type == "guest"){
            window.location.href = "../Create Page - front/create_nonreg.html";
        }
    })
    library_page.addEventListener("click", function(){
        if (user_type == "guest"){
            window.location.href = "../Library_Page/library.html";
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
    })
});