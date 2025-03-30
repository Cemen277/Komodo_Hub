document.addEventListener("touchstart", function() {}, true);


document.addEventListener("DOMContentLoaded", function() {
   const image = document.getElementById("like_button");
   const like_counter = document.getElementById("like_counter")
   const unpressed = "Visuals/like - unpressed.png";
   const pressed = "Visuals/like - pressed.png";
   let like_count = 0;
   let i = true;


   image.addEventListener("click", function() {


       if(i) {
           like_count++;
       }
       else {
           like_count--;
       }


       like_counter.textContent = like_count.toString();


       if (this.getAttribute("src").endsWith(unpressed)) {
           image.src = pressed;
       }
       else {
           image.src = unpressed;
       }


       i = !i
   });
});
