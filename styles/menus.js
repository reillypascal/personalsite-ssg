let buttonStates = {};

function dropdownCleanup(event) {
    // event represented by `this` keyword
    if (buttonStates[this.id] == 1) {
        buttonStates[this.id] = 0;
        this.blur();
    } else {
        buttonStates[this.id] = 1;
    }
}

// wait until window fully loads before adding event listeners to dropdowns
window.addEventListener("load", (event) => {
    let buttons = document.getElementsByClassName("dropbtn");
    for (const element of buttons) {
        element.addEventListener("click", dropdownCleanup);
    }
});