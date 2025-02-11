// variable that keeps track of the current sort direction (ascending or descending).
let currentSortDirectionLockers = "asc";

// Store the initual values of the popup because later the changed values should be found.
let initualPopupValues = {};

// Call getLockers when the page refreshes or the website is opened on the lockers page.
window.addEventListener("load", function () {
    const location = window.location.hash;
    if (location == "#lockers") {
        getLockers();
    }
});

// Call the getLockers function when the lockers page is loaded.
window.addEventListener("hashchange", function (event) {
    const location = window.location.hash;
    if (location == "#lockers") {
        getLockers();
    }
});

const getLockers = async () => {
    // Get the data from the API.
    fetch(`api/get.php?getLockers`)
        .then((response) => response.json())
        .then(async (data) => {
            if (data.success == true){
                // Column names
                const columns = ["Locker ID", "Status", "Number", ""];
                // Create a new table to display the data
                const newTable = document.createElement("table");
                newTable.id = "locker_table";
                const newTableHead = document.createElement("thead");
                const headerRow = document.createElement("tr");
                // Loop through the columns to create headers
                columns.forEach((col, index) => {
                    const th = document.createElement("th");
                    th.textContent = col;
                    // Create sort icon element for each column
                    const sortIcon = document.createElement("span");
                    sortIcon.classList.add("sort-icon");
                    // Append the sort icon to the header
                    th.appendChild(sortIcon);
                    // Bind click events to the table head.
                    th.onclick = () => {
                        sortTable(index);
                        updateSortIcons(index, sortIcon);
                    };
                    headerRow.appendChild(th);
                });
                // Append the header row to the table head
                newTableHead.appendChild(headerRow);
                newTable.appendChild(newTableHead);
                // Create a table body to add the lockers to.
                const newTableBody = document.createElement("tbody");
                newTable.appendChild(newTableBody);
                // Append the data gathered from the API.
                for (locker of data.data) {
                    // Properties of the 'locker' object
                    const lockerProperties = ['locker_id', 'locker_status', 'locker_number'];
                    // Create a new row
                    const newRow = document.createElement("tr");
                    // Loop through locker properties to create td elements
                    for (const property of lockerProperties) {
                        const td = document.createElement("td");
                        // Assign the corresponding locker property
                        td.textContent = locker[property];
                        newRow.appendChild(td);
                    }
                    const td = document.createElement("td");
                    // Create the button element.
                    let button = document.createElement("button");
                    // Properties of the button.
                    button.textContent = "Open";
                    button.className = "lockerOpenButton";
                    button.id = locker['locker_id']; 
                    // Button click event.
                    button.addEventListener("click", function () {
                        openLocker(newRow);
                    });
                    // Append the button to the table collumn and row.
                    td.appendChild(button);
                    newRow.appendChild(td);
                    // Append the new row to the table body.
                    newTableBody.appendChild(newRow);
                }
                // Show the newly created table on the page.
                const target = document.getElementById("locker_table_div");
                target.innerHTML = "";
                target.appendChild(newTable);
            } else {
                const target = document.getElementById("locker_table_div");
                target.innerHTML = "";
            }
        });
};

// Function is used to sort the locker table.
function sortTable(n){
    var table = document.getElementById("locker_table");
    // Variable used to check if switch was made to let the while loop know if the loop has to continue.
    var switching = true;
    // Variable used to check if the sort order has to be reversed.
    var dir = "asc";
    // Variable used to check if the sort order has to be reversed
    var switchCount = 0;
    // Variable used to check if a switch has to be made.
    var shouldSwitch = false;
    // Set the currentSortDirectionLockers variable that is used to give the table headers symbols in the updateSortIcons function.
    currentSortDirectionLockers = "asc";
    //variables used for indexing the for loop and later finding the location of the rows to be switched.
    var i;
    while (switching) {
        // Set switching to false 
        switching = false;
        var rows = table.rows;
        // Loop through all table rows.
        for ( i = 1; i < (rows.length - 1); i++) {
            // Set shouldSwitch to false because no switch has to be made yet.
            shouldSwitch = false;
            // Get the two elements you want to compare, one from current row and one from the next.
            let x = rows[i].getElementsByTagName("TD")[n];
            let y = rows[i + 1].getElementsByTagName("TD")[n];
            // Check if the two rows should switch place.
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
            if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            // Switch the rows found in the for loop.
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // Increase the switch count so that the function knows that a switch was made.
            switchCount ++;
          } 
        else {
            // If no switch was made and the opposite direction was not tried the table has to be reversed.
            if (switchCount == 0 && dir == "asc") {
              dir = "desc";
              switching = true;
              currentSortDirectionLockers = "desc";
            }
          }
    }
}

// Function to update the sort icons in the table headers
function updateSortIcons(n) {
    const allIcons = document.querySelectorAll(".sort-icon"); // Get all sort icons
    allIcons.forEach(icon => icon.textContent = " -"); // Reset all icons to the neutral arrow

    // Get the icon in the clicked header (column)
    const icon = document.getElementsByTagName("th")[n].getElementsByClassName("sort-icon")[0];

    // Change the icon based on the current sort direction
    if (currentSortDirectionLockers === "asc") {
        icon.textContent = " ↑"; // Ascending
    } else {
        icon.textContent = " ↓"; // Descending
    }
}

// Function to get a popup for a locker after clicking the open button in the HTML.
function openLocker(row) {
    // API function to open a locker.
    /////////// Add function here. ///////////

    // Get the row that can be altered.
    const button = row.querySelector('button.lockerOpenButton');
    const idValue = button ? button.id : null;

    // Ask the user if the row should be altered or opening the locker is enough.
    let userChoice = confirm("Do you want to alter the data of row " + idValue + "?");
    if (userChoice) {
        changeLockerData(row)
    }
}

// Function that opens correct locker after clicking the open button on the locker dashboard page.
async function changeLockerData(row){
    // Get references to DOM elements
    const closeButton = document.querySelector('.closePopupButton');
    const popupModal = document.getElementById('popupModal');
    // Show the popup by changing the css.
    popupModal.style.display = 'flex';
    // Close the modal when clicking outside the modal content.
    window.addEventListener('click', (event) => {
        if (event.target === popupModal) {
            popupModal.style.display = 'none';
        }
    });
    // Close the modal when the x button is clicked.
    closeButton.addEventListener('click', () => {
        popupModal.style.display = 'none';
    });
    // Set the values of the form fields to be the same as the dashboard.
    document.getElementById('lockerId').value = row.children[0].textContent;
    document.getElementById('dropdown').value = row.children[1].textContent;
    document.getElementById('lockerNumber').value = row.children[2].textContent;

    // If the locker is taken pre-set the calbe id.
    if (row.children[1] == "Taken"){
        // Check if there is actually a cable set for this locker.
        const apiUrl = `api/get.php?getCableFromLockerId?parameters:` + row.children[0].textContent;
        await fetch(apiUrl)
            .then((response) => response.json())
            .then(async (data) => {
                if (data.success == true){
                    document.getElementById('cableId').value = data.data['cable_id'];
                }
        });
    }
    // Add eventlistener that checks if a dropdown value changes and shows or hides the cable id field
    addDropdownListener();

    // Save the initual popup fields.
    const form = document.getElementById("popupForm");
    for (const field of form.elements) {
        if (field.name) {
            initualPopupValues[field.name] = field.value;
        }
    }
}

function addDropdownListener() {
    // Add eventlistener that checks if anyting changes in the dropdown
    const dropdown = document.getElementById('dropdown');
    dropdown.addEventListener('change', toggleCableInput);
    // Call the toggleCableInput function to set the class of the hiddenDiv correctly.
    toggleCableInput();
}

// Function to toggle visibility of the cableId field based on the selected dropdown value
function toggleCableInput() {
    const dropdown = document.getElementById('dropdown');
    const cableIdInput = document.getElementById('cableIdInput');
    if (dropdown.value == 'Taken') {
        cableIdInput.style.display = 'block';
    } else {
        cableIdInput.style.display = 'none';
    }
}

// Function that makes an API call to update database using form data after the from is submitted.
async function handlePopupForm(event){
    event.preventDefault();
    const form = document.getElementById('popupForm');

    const formData = new FormData(form);

    let adminId = formData.get('adminId');
    let adminPassword = formData.get('adminPassword');
    let lockerId = formData.get('lockerId');
    let status = formData.get('dropdown');
    let lockerNumber = formData.get('lockerNumber');
    let cableId = formData.get('cableId');

    let allFieldsFilled = true;

    // Loop through all form elements to check if all input fields are filled.
    for (let [key, value] of formData.entries()) {
        // Skip the cableId field because this field can be empty.
        if (key === "cableId") {
            continue;
        }
        const field = form.querySelector(`[name="${key}"]`);
        if (field.type === 'text' || field.type === 'password') {
            // Check if text-based fields are filled.
            if (!value.trim()) {
                allFieldsFilled = false;
            }
        }
    }
    // If not all fields are filled, ask the user to fill all fields and return.
    if (!allFieldsFilled) {
        alert("Please fill in all fields.");
        return;
    }

    if (lockerId.match(/^[0-9]+$/) == null) {
        alert("Locker ID not a valid number.");
        return;
    }
    if (lockerNumber.match(/^[0-9]+$/) == null) {
        alert("Locker Number not a valid number.");
        return;
    }

    // Check if the password and admin id are correct.
    const apiUrl = `api/get.php?checkAdminPriviledges?parameters:` + adminId + "," + adminPassword;
    await fetch(apiUrl)
        .then((response) => response.json())
        .then(async (data) => {
            if (data.success == false){
                alert("Admin ID or password not correct.");
                return;
            }
    });

    // Check if there is a given cable ID, but only when Taken is selected for the locker.
    if (status == "Taken") {
        if (cableId.match(/^[0-9]+$/) == null) {
            alert("Locker Number not a valid number.");
            return;
        }
        // Update the cable table in the database.
        const apiUrl2 = `api/update.php?setCableTable?parameters:` + cableId + "," + lockerId;
        await fetch(apiUrl2);
    }
    // When no cable is given for the locker check the cables in the database and if needed change the cable table.
    if (status == "Free") {
        // Update the cable table in the database.
        const apiUrl2 = `api/update.php?removeCablesFromLocker?parameters:` + lockerId;
        await fetch(apiUrl2);
    }

    // Update the locker table in the database.
    const apiUrl3 = `api/update.php?setLockerTable?parameters:` + lockerId + "," + status + "," + lockerNumber;
    await fetch(apiUrl3);

    // Find all fields that changed.
    const changedFields = [];
    for (const field of form.elements) {
        if (field.name && field.name !== "abc") { // Skip the "abc" field
            if (field.value !== initualPopupValues[field.name]) {
                changedFields.push(field.name);
            }
        }
    }
    // Changing the variable because the fields were an array but should be stored as a string in the database.
    let changedFieldsString = changedFields.join(", ");

    // Make a new admin transaction in the database.
    const apiUrl4 = `api/update.php?setAdminTransaction?parameters:` + changedFieldsString + "," + lockerId + "," + adminId;
    await fetch(apiUrl4);

    // Closing the popup and reloading the locker dashboard.
    const popupModal = document.getElementById('popupModal');
    popupModal.style.display = 'none';
    getLockers();
}

// Function that is called to simulate a button click. This is used to click all the open buttons.
async function simulateButtonClick(button) {
    return new Promise((resolve) => {
        const event = new Event('click');
        button.dispatchEvent(event);
        resolve();
    });
}

// Function that is called when all lockers have to be reset.
async function resetLockerRack(){
    // Get all the buttons from the HTML.
    const buttons = document.querySelectorAll(".lockerOpenButton");
    // For every button simulate a button click.
    for (const button of buttons) {
        await simulateButtonClick(button);
    }
}
