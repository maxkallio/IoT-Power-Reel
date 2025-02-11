// variable that keeps track of the current sort direction (ascending or descending).
let currentSortDirectionTransaction = "asc";

// Variables to use when adding and removing the searchbar eventlistener.
let searchListenerAdded = false; // Track if the listener has already been added
let searchBarEventListener; // Reference to the event listener function

// Call getTransactions when the page refreshes or the website is opened on the transactions page.
window.addEventListener("load", function () {
    const location = window.location.hash;
    if (location == "#transactions") {
        getTransactions();
    }
});

// Call the getTransactions function when the transactions page is loaded.
window.addEventListener("hashchange", function () {
    const location = window.location.hash;
    if (location == "#transactions") {
        getTransactions();
    }
});

const getTransactions = async () => {
    // Get the data from the API.
    fetch(`api/get.php?getTransactions`)
        .then((response) => response.json())
        .then(async (data) => {
            if (data.success == true){
                // Column names
                const columns = ["Transaction ID", "Check Out", "Check In", "Cable ID", "User ID", "User Name"];
                // Create a new table to display the data
                const newTable = document.createElement("table");
                newTable.id = "transaction_table";
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
                // Create a table body to add the transactions to.
                const newTableBody = document.createElement("tbody");
                newTable.appendChild(newTableBody);
                // Append the data gathered from the API.
                for (transaction of data.data) {
                    // Properties of the 'transaction' object
                    const transactionProperties = ['transaction_id', 'check_out', 'check_in', 'cable_id', 'user_id', 'user_name'];
                    // Create a new row
                    const newRow = document.createElement("tr");
                    // Loop through transaction properties to create td elements
                    for (const property of transactionProperties) {
                        const td = document.createElement("td");
                        // If the property is user_name do an API call to get the correct user.
                        if (property === 'user_name' ) {
                            // Call function to modify the user_id.
                            const userName = await modifyUserId(transaction['user_id']);
                            td.textContent = userName;
                        } else {
                            // Assign the corresponding transaction property
                            td.textContent = transaction[property];
                        }
                        newRow.appendChild(td);
                    }
                    // Append the new row to the table body
                    newTableBody.appendChild(newRow);
                }
                // Show the newly created table on the page.
                const target = document.getElementById("transaction_table_div");
                target.innerHTML = "";
                target.appendChild(newTable);
            } else {
                const target = document.getElementById("transaction_table_div");
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
                    const target = document.getElementById("transaction_table_div");
                    reject('Unknown User');
                }
        });
    });
}

// Found a similar function on W3schools that this function is based on: https://www.w3schools.com/howto/howto_js_sort_table.asp
// Function is used to sort the transaction table.
function sortTable(n){
    var table = document.getElementById("transaction_table");
    // Variable used to check if switch was made to let the while loop know if the loop has to continue.
    var switching = true;
    // Variable used to check if the sort order has to be reversed.
    var dir = "asc";
    // Variable used to check if the sort order has to be reversed
    var switchCount = 0;
    // Variable used to check if a switch has to be made.
    var shouldSwitch = false;
    // Set the currentSortDirectionTransaction variable that is used to give the table headers symbols in the updateSortIcons function.
    currentSortDirectionTransaction = "asc";
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
              currentSortDirectionTransaction = "desc";
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
    console.log(currentSortDirectionTransaction);

    // Change the icon based on the current sort direction
    if (currentSortDirectionTransaction === "asc") {
        icon.textContent = " ↑"; // Ascending
    } else {
        icon.textContent = " ↓"; // Descending
    }
}

// Function that runs after DOM is completed and changes the css to clearly display what transactions have cables that are not returned in a day.
// Also used to sort the table to show all transactions with no check in dates on top.
document.addEventListener("DOMContentLoaded", () => {
    // Also listenes for the right page to be loaded because this feature should only be called on the transactions page.
    window.addEventListener("hashchange", function (event) {
        const location = window.location.hash;
        if (location == "#transactions") {
            setCssOverdueTransactions();
        }
    });
    // Call getTransactions when the page refreshes or the website is opened on the transactions page.
    window.addEventListener("load", function () {
        const location = window.location.hash;
        if (location == "#transactions") {
            setCssOverdueTransactions();
        }
    });
});

// Function that gives overdue transactions a red background this is done by comparing the dates of the transactions with the current date.
function setCssOverdueTransactions(){
    setTimeout(() => {
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        const table = document.getElementById("transaction_table");
        // Loop through all rows in the tbody
        const rows = table.querySelectorAll("tbody tr");
        rows.forEach(row => {
            // Get all columns/cells of the current rows.
            const cells = row.querySelectorAll("td");
            // Get the check_out and check_in column by their indexes.
            const checkOutCell = cells[1];
            const checkInCell = cells[2];
            // Parse date parts from check_out and check_in cells
            const checkOutDate = checkOutCell?.textContent.split(' ')[0] || "";
            const checkInValue = checkInCell?.textContent || "";
            // Apply a CSS class if conditions are met
            if (checkOutDate !== today && checkOutDate !== "" && checkInValue === "") {
                // Add a CSS class for invalid rows
                row.classList.add("highlight-row");
            }
        });
    }, 1000);
}

// For now the table does not update after writing in the search bar.
// The console log on line 258 never shows which means that the eventlistener is not being added.
// The table updates every 10 seconds so the search will probalby be lost after updating.

// Function that adds the search bar event listener when on the transactions page.
function searchBarEventlinstener(){
    // Use a timeout to make sure the DOM is loaded before getting the searchbar and the transactions table.
    setTimeout(() => {
        // Check if there is already a eventlistener and if the searchbar and table are found.
        if (!searchListenerAdded) {
            searchBarEventListener = function () {
                // Variables to store the search bar and the table.
                const searchBar = document.getElementById("searchBar");
                const table = document.getElementById("transaction_table");
                // Get the search term from the search bar.
                // Make the text lower case because the search should not be case sensitive.
                const searchTerm = this.value.toLowerCase();
                // Get all the rows from the table.
                const rows =  table.querySelectorAll("tbody tr");
                // Loop through rows in the tbody exept for the header row.
                rows.forEach(row => {
                    // Get all columns/cells of the current rows.
                    const cells = row.querySelectorAll("td");
                    // Variable that checks if there is a match between the search and the columns.
                    let match = false;
                    // Loop through cells and check if any contains the search term.
                    for (let j = 0; j < cells.length; j++) {
                        // If the search field is empty allways show.
                        if (searchTerm == "") {
                            match = true;
                            break;
                        }
                        if (cells[j].textContent.toLowerCase().includes(searchTerm)) {
                            match = true;
                            // Break when a match is found because searching further is not nessecary.
                            break;
                        }
                    }
                    // Show or hide the row based on whether a match was found.
                    if (match){
                        row.classList.remove("hide-row");
                    } else {
                        row.classList.add("hide-row");
                    }
                });
            }
        }
        // Eventlistener that checks if the user types in the search bar.
        searchBar.addEventListener("input", searchBarEventListener);
        searchListenerAdded = true; // Mark the listener as added
    }, 2000);
}

// Function that removes the search bar eventlistener when not on the transactions page any more.
function removeSearchBarEventlinstener() {
    // Get the searchbar to romove the eventlistener from.
    const searchBar = document.getElementById("searchBar");
    // Check if there is a eventlistener and if it is stored. Also make sure the searchbar is found.
    if (searchListenerAdded && searchBar && searchBarEventListener) {
        // Remove the event listener
        searchBar.removeEventListener("input", searchBarEventListener);
        // The eventlistener is removed so set the variable to false.
        searchListenerAdded = false;
    }
}
