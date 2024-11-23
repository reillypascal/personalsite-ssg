
// Animate dropdown menu
function hamburgerToggle() {
    let x = document.getElementById("menuLinks");
    if (x.style.display === "block") {
        x.style.display = "none";
        
        let dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    } else {
        x.style.display = "block";
    }
}

// Switch from dropdown to menu bar if >= 900px
function hamburgerOnOff() {
    // get window width and font rem size
    let size = window.innerWidth;
    const documentHTML = document.querySelector("html");
    const remSize = window.getComputedStyle(documentHTML).fontSize.replace("px", "");
    
    // get menu div
    let menu = document.getElementById("menuLinks");
    // get all dropdown content divs
    let dropdowns = document.getElementsByClassName("dropdown-content");

    // calculate window size in rem; show/hide nav
    if (size >= 56.25 * remSize) { // was 900px
        menu.style.display = "contents";

        for (let i = 0; i < dropdowns.length; i++) {
            let dropdown = dropdowns[i];
            dropdown.style.position = "absolute";
        }
    } else {
        menu.style.display = "none";
        for (let i = 0; i < dropdowns.length; i++) {
            let dropdown = dropdowns[i];
            dropdown.style.position = "static";
        }
    }
}

function showDropdown(dropdownID) {
    document.getElementById(dropdownID).classList.toggle("show");
}

// closes dropdowns and hamburger
function hideDropdown(event) {
    // get window width and font rem size
    let size = window.innerWidth;
    const documentHTML = document.querySelector("html");
    const remSize = window.getComputedStyle(documentHTML).fontSize.replace("px", "");

    if (!event.target.matches('.dropbtn') && size >= 56.25 * remSize) {
        let dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }

    // if (!event.target.closest('.nav')) {
    //     let hamburger = document.getElementById("menuLinks");
    //     if (hamburger.style.display === "block") {
    //         hamburger.style.display = "none";
    //     }
    // }
}

window.addEventListener('click', hideDropdown);