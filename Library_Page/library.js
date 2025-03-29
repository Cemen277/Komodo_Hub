document.addEventListener("DOMContentLoaded", function () {
    const user_id = localStorage.getItem('user_id');
    console.log("Loaded user_id:", user_id);

    if (!user_id) {
        console.error("No user_id found in localStorage");
        return;
    }
    
    fetch("http://127.0.0.1:8000/api/add_library/", {
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

        const container = document.querySelector(".block_wrapper");


        data.forEach((library, index) => {
            const library_block = document.createElement("button");
            library_block.className = "post";

            library_block.setAttribute("data-library-id", library.library_id);

            library_block.addEventListener("click", function () {
                const library_id = this.getAttribute("data-library-id");
                window.location.href = `library1.html?library_id=${library_id}`;
            });

            library_block.innerHTML = `
                <div class="post-title-container">
                    <span class="post-title">${library.organisation_name}</span>
                    <img src="Visuals/next.png" alt="more_info_button" class="next_button">
                </div>
                <div class="post-image-container">
                    <img src="${library.image}" alt="Post Image">
                </div>
            `
            container.appendChild(library_block);



        });

        
    })

    .catch(error => {
        console.error("Org fetch error:", error);
    });
});