// closes other dropdowns when opening new one
// progressive enhancement only - menu still works without this
function dropdownCleanup(obj) {
  let clickTarget = obj.target;
  let checkboxes = document.getElementsByClassName("dropdown-checkbox");
  for (let i = 0; i < checkboxes.length; i++) {
    // if a checkbox is not the current target and is checked, uncheck it
    if (checkboxes[i].id != clickTarget.id && checkboxes[i].checked == true) {
      checkboxes[i].checked = false;
    }
  }
}

// wait until window fully loads before adding event listeners to dropdowns
window.addEventListener("load", (event) => {
  let checkboxes = document.getElementsByClassName("dropdown-checkbox");
  for (const element of checkboxes) {
    element.addEventListener("click", dropdownCleanup);
  }
});
