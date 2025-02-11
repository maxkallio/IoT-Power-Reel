// Variable that stores the interval that is currently active. 
// This variable is needed when stopping a interval when navigating away from a page.
let intervalId = null; 

// When the IoT Power website is first opened the user will be directed to the home page.
window.onload = function () {
    if (!window.location.hash) {
        // When there is no hash in the URL redirect to #home.
        window.location.hash = "#home";
    } else {
        // Call your function to initialize the page.
        locationHandler();
    }
};

// create document click that watches the nav links only
document.addEventListener("click", (e) => {
    const { target } = e;
    if (!target.matches("nav a")) {
        return;
    }
    // Prefent default so that full page reloads are avoided.
    e.preventDefault();
    // Get the hash part from the link.
    const hash = target.getAttribute("href").substring(1);
    document.location.hash = hash;
});

// Event listener that looks for url changes
window.addEventListener('popstate', function (event) {
	locationHandler();
});

const routes = {
    "": {
        template: "/html/home.html",
        title: "Home",
        description: "This is the home page",
    },
    "/": {
        template: "/html/home.html",
        title: "Home",
        description: "This is the home page",
    },
    "#home": {
        template: "/html/home.html",
        title: "Home",
        description: "This is the home page",
    },
    "#cables": {
        template: "/html/cables.html",
        title: "Cable dashboard",
        description: "This is the cable dashboard page",
    },
    "#transactions": {
        template: "/html/transactions.html",
        title: "Transaction Dashboard",
        description: "This is the transaction dashboard page",
    },
    "#lockers": {
        template: "/html/lockers.html",
        title: "Locker Dashboard",
        description: "This is the locker dashboard page",
    },
    "#reserve": {
        template: "/html/reserve.html",
        title: "Reservation page",
        description: "This is the reservation page",
    },
};

// Function to add the correct page to the DOM by using the URL.
const locationHandler = async () => {
    // Remove the search bar event listener in case the page navigates away from the transaction page.
    removeSearchBarEventlinstener();
    // get the url path
    const location = window.location.hash;
    // Stop interval if existing. This is done so that no unnecessary interval is running.
    if (intervalId !== null) {
        clearInterval(intervalId);
    }
    // Start a new interval when navigating to a dashboard.
    if (location == '#cables'){
        // Interval that refreshes the page every 10 seconds to make sure the cables dashboard is always updated.
        intervalId = setInterval(async () => {
            await setDropdownOptions();
            setCssOverdueCables();
        }, 10000);
    }
    if (location == '#transactions'){
        // Interval that refreshes the page every 10 seconds to make sure the transactions dashboard is always updated.
        intervalId = setInterval(async () => {
            await getTransactions();
            setCssOverdueTransactions();
        }, 10000);
    }
    if (location == '#lockers'){
        // Interval that refreshes the page every 10 seconds to make sure the transactions dashboard is always updated.
        intervalId = setInterval(async () => {
            getLockers();
        }, 10000);
    }
    if (location == '#reserve'){
        // Interval that refreshes the page every 10 seconds to make sure the transactions dashboard is always updated.
        intervalId = setInterval(async () => {
            getReservableCables();
        }, 10000);
    }
    // if the path length is 0, set it to primary page route
    if (location.length == 0) {
        location = "/";
    }
    // get the route object from the urlRoutes object
    const route = routes[location];
    // get the html from the template
    const html = await fetch(route.template).then((response) => response.text());
    // set the content of the content div to the html
    document.getElementById("content").innerHTML = html;
    // set the title of the document to the title of the route
    document.title = route.title;
    // set the description of the document to the description of the route
    document
        .querySelector('meta[name="description"]');
    if (location == '#transactions'){
        // Add the search bar event listener.
        searchBarEventlinstener();
    }
};
