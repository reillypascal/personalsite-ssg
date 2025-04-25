let buttonStates = {};

function dropdownCleanup(event) {
    let buttons = document.getElementsByClassName("dropbtn");
    // event represented by `this` keyword
    if (buttonStates[event.target.id] == 1) {
        buttonStates[event.target.id] = 0;
        event.target.blur();
    } else {
        buttonStates[event.target.id] = 1;
        for (const element of buttons) {
            // if (!element.classList.contains("navIcon") && element.id != this.id) {
            if (element.id != event.target.id) {
                buttonStates[element.id] = 0;
            }
        }
    }
}

// wait until window fully loads before adding event listeners to dropdowns
window.addEventListener("load", (event) => {
    let buttons = document.getElementsByClassName("dropbtn");
    for (const element of buttons) {
        element.addEventListener("click", dropdownCleanup);
    }
});

window.addEventListener("click", (event) => {
    if (!event.target.classList.contains("dropbtn")) {
        for (const [key, value] of Object.entries(buttonStates)) {
            buttonStates[key] = 0;
        }
        // console.log(buttonStates);
    }
});
