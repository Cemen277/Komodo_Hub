document.addEventListener("touchstart", function() {}, true);

document.addEventListener("DOMContentLoaded", function() {
    const textarea = document.getElementById("user_message");
    const wordCounter = document.getElementById("letter_counter");
    const maxLength = textarea.getAttribute("maxlength");

    textarea.addEventListener("input", function() {
        const letterCount = textarea.value.trim().length;
        wordCounter.textContent = `${letterCount}/${maxLength}`;
    });
});
