document.addEventListener("touchstart", function() {}, true);

document.addEventListener("DOMContentLoaded", function(){
    const textarea = document.getElementById("user_message");

    textarea.addEventListener("input", function(){ 
        this.style.height = "auto";
        this.style.height = (this.scrollHeight) + "px";
    })
})

document.addEventListener("DOMContentLoaded", function() { // For Letter counter
    const textarea = document.getElementById("user_message");
    const letterCounter = document.getElementById("letter_counter");
    const maxLength = textarea.getAttribute("maxlength");

    textarea.addEventListener("input", function() {
        const letterCount = textarea.value.trim().length;
        letterCounter.textContent = `${letterCount}/${maxLength}`;
    });
});

document.getElementById("upload_container").addEventListener("click", function(){
    document.getElementById("file_upload").click();
});
