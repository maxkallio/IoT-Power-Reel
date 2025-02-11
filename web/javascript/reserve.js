// Variable to save the cable id selected from a row when reserving using the reservation dashboard.
let cableId = "";
// Variable to save the locker id selected from a row when reserving using the reservation dashboard.
let lockerId = "";

// Call getReservableCables when the page refreshes or the website is opened on the reservation page.
window.addEventListener("load", function () {
    const location = window.location.hash;
    if (location == "#reserve") {
        getReservableCables();
    }
});

// Call the getReservableCables function when the reservation page is loaded.
window.addEventListener("hashchange", function (event) {
    const location = window.location.hash;
    if (location == "#reserve") {
        getReservableCables();
    }
});

const getReservableCables = async () => {
    // Get the data from the API.
    fetch(`api/get.php?getFreeCables`)
        .then((response) => response.json())
        .then(async (data) => {
            if (data.success == true){
                // Column names
                const columns = ["Locker Number", "Cable Number", "Status", ""];
                // Create a new table to display the data
                const newTable = document.createElement("table");
                newTable.id = "reserve_table";
                const newTableHead = document.createElement("thead");
                const headerRow = document.createElement("tr");
                // Loop through the columns to create headers
                columns.forEach((col, index) => {
                    const th = document.createElement("th");
                    th.textContent = col;
                    headerRow.appendChild(th);
                });
                // Append the header row to the table head
                newTableHead.appendChild(headerRow);
                newTable.appendChild(newTableHead);
                // Create a table body to add the cables to.
                const newTableBody = document.createElement("tbody");
                newTable.appendChild(newTableBody);
                // Append the data gathered from the API.
                for (cable of data.data) {
                    // Properties of the 'cable' object
                    const cableProperties = ['locker_id', 'cable_id', 'cable_status'];
                    // Create a new row
                    const newRow = document.createElement("tr");
                    // Loop through cable properties to create td elements
                    for (const property of cableProperties) {
                        const td = document.createElement("td");
                        // To get the correct locker number use the locker id to get the locker number.
                        if (property === 'locker_id' ) {
                            // Call function to get the locker number.
                            const lockerNumber = await modifylockerNumber(cable['locker_id']);
                            td.textContent = lockerNumber;
                        } else {
                            // Assign the corresponding cable property
                            td.textContent = cable[property];
                        }
                        newRow.appendChild(td);
                    }
                    const td = document.createElement("td");
                    // Create a button element.
                    let button = document.createElement("button");
                    // Properties of the button.
                    button.textContent = "Reserve";
                    button.className = "cableReserveButton";
                    button.id = cable['cable_id']; 
                    // Button click event.
                    button.addEventListener("click", function () {
                        reserveCable(newRow);
                    });
                    // Append the button to the table collumn and row.
                    td.appendChild(button);
                    newRow.appendChild(td);
                    // Append the new row to the table body.
                    newTableBody.appendChild(newRow);
                }
                // Show the newly created table on the page.
                const target = document.getElementById("reservation_table_div");
                target.innerHTML = "";
                target.appendChild(newTable);
            } else {
                const target = document.getElementById("reservation_table_div");
                target.innerHTML = "";
            }
        });
};

// Function that changes the locker_id value into the actual locker number.
async function modifylockerNumber(lockerId) {
    return new Promise((resolve, reject) => {
        // Get the data from the API.
        fetch(`api/get.php?getLockerNumberFromId?parameters:${lockerId}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.success == true){
                    resolve(data.data[0]['locker_number']);
                } else {
                    const target = document.getElementById("cable_table_div");
                    reject('Unknown Locker');
                }
        });
    });
}

// Function that is called from the reserve button and opens the reservation popup.
function reserveCable(row) {
    // Get references to DOM elements
    const closeButton = document.querySelector('.closePopupButton');
    const reservationModal = document.getElementById('reservationModal');
    // Show the popup by changing the css.
    reservationModal.style.display = 'flex';
    // Close the modal when clicking outside the modal content.
    window.addEventListener('click', (event) => {
        if (event.target === reservationModal) {
            reservationModal.style.display = 'none';
        }
    });
    // Close the modal when the x button is clicked.
    closeButton.addEventListener('click', () => {
        reservationModal.style.display = 'none';
    });
    // Save the selected cable id for the row.
    cableId = row.children[1].textContent;
    // Save the selected locker id for the row.
    lockerId = row.children[0].textContent;
}

// Function that reserves a cable for the user.
async function handleReserveFrom(event) {
    // Prevent default to be able to me my own form submission function.
    event.preventDefault();
    // Get the data from the form
    const form = document.getElementById('reservationForm');
    const formData = new FormData(form);
    let userName = formData.get('reservationName');
    let userId = "";
    // Check if user name exists
    await fetch(`api/get.php?checkUserName?parameters:${userName}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.success == false){
                alert("Name not correct.");
                return;  
            }
            if (data.success == true){
                userId = data.data[0]['user_id'];
            }
        });
    // Add a reservation to the reservation table in the database.
    const apiUrl = `api/update.php?setReservation?parameters:` + userId + "," + cableId + "," + lockerId;
    await fetch(apiUrl);
    // Closing the popup and reloading the locker dashboard.
    const reservationModal = document.getElementById('reservationModal');
    reservationModal.style.display = 'none';
    getReservableCables();
}