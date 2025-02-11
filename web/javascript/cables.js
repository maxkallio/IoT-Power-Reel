// Variable that stores the value selected in the dropdown.
var dropdownValue = "All";
// variable that keeps track of the current sort direction (ascending or descending).
let currentSortDirectionCables = "asc";

// Call setDropdownOptions when the page refreshes or the website is opened on the cables page.
window.addEventListener("load", function () {
    const location = window.location.hash;
    if (location == "#cables") {
        setDropdownOptions();
    }
});

// Call the setDropdownOptions function when the cables page is loaded.
window.addEventListener("hashchange", function (event) {
    const location = window.location.hash;
    if (location == "#cables") {
        setDropdownOptions();
    }
});

// Function to set options for the dropdown.
async function setDropdownOptions() {
    let options = [];
    // Get the data from the API.
    fetch("api/get.php?getCables")
    .then((response) => response.json())
    .then((data) => {
        // Add a dropdown option that shows all statuses.
        options.push("All")
        // Append the data gathered from the API.
        for (cable of data.data) {
            options.push(cable.cable_status);
        }
    });
    
    // Set timeout so that the dropdown is created because the getElementById functions fails if there is not timeout 
    let uniqueOptions = [];
    setTimeout(() => {
        // Only get unique options
        uniqueOptions = [...new Set(options)];
        // Get the dropdown from the HTML to add the options.
        const selectElement = document.getElementById("dropdown");
        if (selectElement) {
            // Add new options
            uniqueOptions.forEach(option => {
                const newOption = document.createElement("option");
                newOption.value = option;
                newOption.text = option;
                selectElement.appendChild(newOption);
            });
        } else {
            console.error("Select element not found");
        }
        getCables();
    }, 500);
}

// Function that is triggered on selection change in the dropdown.
function onSelectChange() {
    const dropdown = document.getElementById("dropdown");
    dropdownValue = dropdown.value;
    getCables();
}

const getCables = async () => {
    // Get the data from the API.
    fetch(`api/get.php?getCables`)
        .then((response) => response.json())
        .then(async (data) => {
            if (data.success == true){
                // Column names
                const columns = ["Cable ID", "Status", "Locker ID", "User ID", "User Name"];
                // Create a new table to display the data
                const newTable = document.createElement("table");
                newTable.id = "cable_table";
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
                // Create a table body to add the cables to.
                const newTableBody = document.createElement("tbody");
                newTable.appendChild(newTableBody);
                // Append the data gathered from the API.
                for (cable of data.data) {
                    // Only use the cables where the status is the same as the selected status in the dropdown.
                    if (cable.cable_status == dropdownValue || dropdownValue == "All"){
                        // Properties of the 'cable' object
                        const cableProperties = ['cable_id', 'cable_status', 'locker_id', 'user_id', 'user_name'];
                        // Create a new row
                        const newRow = document.createElement("tr");
                        // Loop through cable properties to create td elements
                        for (const property of cableProperties) {
                            const td = document.createElement("td");
                            // If the property is user_id do an API call to get the correct user.
                            if (property === 'user_name' ) {
                                // Check is there is a user.
                                if (cable['user_id'] == null){
                                    td.textContent = "-";
                                }
                                else {
                                    // Call function to modify user_id.
                                    const userName = await modifyUserId(cable['user_id']);
                                    td.textContent = userName;
                                }
                            } else {
                                // If the porperty is user_id check if the id is not null
                                if (property === 'user_id' && cable[property] == null){
                                    td.textContent = "-";
                                }
                                else {
                                    // Assign the corresponding cable property
                                    td.textContent = cable[property];
                                }
                            }
                            newRow.appendChild(td);
                        }
                        // Append the new row to the table body
                        newTableBody.appendChild(newRow);
                    }
                }
                // Show the newly created table on the page.
                const target = document.getElementById("cable_table_div");
                target.innerHTML = "";
                target.appendChild(newTable);
            } else {
                const target = document.getElementById("cable_table_div");
                target.innerHTML = "";
            }
        });
};

// Function that changes the user_id value into the actual name of the user.
async function modifyUserId(userId) {
    return new Promise((resolve, reject) => {
        // Get the data from the API.
        fetch(`api/get.php?getUser?parameters:${userId}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.success == true){
                    const user = data.data.find(user => String(user.user_id) === String(userId));
                    resolve(user.user_name);
                } else {
                    const target = document.getElementById("cable_table_div");
                    reject('Unknown User');
                }
        });
    });
}

// Found a similar function on W3schools that this function is based on: https://www.w3schools.com/howto/howto_js_sort_table.asp
// Function is used to sort the cable table.
function sortTable(n){
    var table = document.getElementById("cable_table");
    // Variable used to check if switch was made to let the while loop know if the loop has to continue.
    var switching = true;
    // Variable used to check if the sort order has to be reversed.
    var dir = "asc";
    // Variable used to check if the sort order has to be reversed
    var switchCount = 0;
    // Variable used to check if a switch has to be made.
    var shouldSwitch = false;
    // Set the currentSortDirectionCables variable that is used to give the table headers symbols in the updateSortIcons function.
    currentSortDirectionCables = "asc";
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
              currentSortDirectionCables = "desc";
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
    if (currentSortDirectionCables === "asc") {
        icon.textContent = " ↑"; // Ascending
    } else {
        icon.textContent = " ↓"; // Descending
    }
}

// Calls setCssOverdueCables function that runs after DOM is completed and changes the css to clearly display what cables are not returned in a day.
// Also listenes for the right page to be loaded because this feature is only relevant for the cables page.
document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener("hashchange", function (event) {
        const location = window.location.hash;
        if (location == "#cables") {
            setCssOverdueCables();
        }
    });
    // Call setCssOverdueCables when the page refreshes or the website is opened on the cables page.
    window.addEventListener("load", function () {
        const location = window.location.hash;
        if (location == "#cables") {
            setCssOverdueCables();
        }
    });
});

// Function that gives overdue cables a red background this is done by getting all overdue transactions.
function setCssOverdueCables(){
    setTimeout(() => {
        // Get the cables transactons that are overdue.
        fetch(`api/get.php?getOverdueTransactions`)
        .then((response) => response.json())
        .then(async (data) => {
            const table = document.getElementById("cable_table");
            // Loop through all rows in the tbody
            const rows = table.querySelectorAll("tbody tr");
            rows.forEach(row => {
                const cells = row.querySelectorAll("td");
                // Get the Cable ID column by its index.
                const cableCell = cells[0];
                // Get the value of the column.
                const cableID = cableCell?.textContent;
                // Loop through all the overdue transactions retrieved from the API call.
                for (transaction of data.data) {
                    // Apply a CSS class if conditions are met
                    if (transaction.cable_id == cableID){
                        // Add a CSS class for invalid rows
                        row.classList.add("highlight-row");
                    }
                }
            });
        });
    }, 1000);
}
