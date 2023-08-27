// Get references to the search input and search button
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const clearButton = document.getElementById("clearButton");
const searchIcon = document.getElementById("searchIcon");
const table = document.getElementById("detailDataDisplay");
const pageEl = document.getElementById("pagination");
const nextPrevContainer = document.getElementById("nextPrevContainer");
const sortArrowUp = document.querySelectorAll(".fa-sort-up");
const sortArrowDown = document.querySelectorAll(".fa-sort-down");
const arrowLeft = document.querySelector(".arrow-left");
const arrowRight = document.querySelector(".arrow-right");

// Array of image paths
const imagePaths = [
  "assets/landing_page1.jpg",
  "assets/landing_page2.jpg",
  "assets/landing_page3.jpg",
];

// Initialize the current image index
let currentImageIndex = 0;

// First page of detail display data and number of rows per page
let currentPage = 1;
let rows = 100;

// Arrays to store fetched meteor data
let meteorData = [];
let filteredResults = [];

let searchText; // Variable to store input search terms

// Fetch data and store it in the meteorData array
fetch("https://data.nasa.gov/resource/gh4g-9sfh.json")
  .then((response) => response.json())
  .then((data) => {
    meteorData = data; // Store fetched data in the array
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

clearButton.addEventListener("click", (e) => {
  e.preventDefault();
  searchInput.value = "";
  searchIcon.classList.remove("hidden");
});

// Function to filter results
function getResults() {
  // Store the search text from the input field and convert to lowercase
  searchText = searchInput.value.toLowerCase().trim();

  // Check if the input is empty
  if (searchText !== "") {
    searchIcon.classList.add("hidden");
  } else {
    searchIcon.classList.remove("hidden");
  }

  // Convert searchText to a number (mass must be a number for precise comparison)
  const searchNumber = parseFloat(searchText);

  // Filter meteor data based on search criteria
  filteredResults = meteorData.filter((meteor) => {
    const name = meteor.name.toLowerCase();
    const mass = meteor.mass ? meteor.mass.toString() : "";
    const year = meteor.year ? meteor.year.toString() : "";
    // const reclong = meteor.reclong ? meteor.reclong.toString() : "";
    // const reclat = meteor.reclat ? meteor.reclat.toString() : "";

    // Check if mass matches exactly (converted to float for precision)
    const massMatches = mass === searchNumber;

    // Compare search text with various criteria
    return (
      name.includes(searchText) ||
      mass.includes(searchText) ||
      year.includes(searchText) ||
      // reclong === searchText ||
      // reclat === searchText ||
      massMatches
    );
  });

  // If there are no filtered results or the input field is empty, show all results
  if (filteredResults.length === 0 || searchText === "") {
    console.log("No results found!", meteorData);
  } else {
    // Display the filtered results in the console
    console.log("Filtered Results:", filteredResults);
  }
}

// Add event listener to search button
searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  getResults();
  if (filteredResults.length === 0 || searchText === "") {
    displayList(meteorData, table, rows, currentPage);
    setupPagination(meteorData, pageEl, rows);
  } else {
    displayList(filteredResults, table, rows, currentPage);
    setupPagination(filteredResults, pageEl, rows);
  }
});

// Add event listener to input field
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    getResults();
    if (filteredResults.length === 0 || searchText === "") {
      displayList(meteorData, table, rows, currentPage);
      setupPagination(meteorData, pageEl, rows);
    } else {
      displayList(filteredResults, table, rows, currentPage);
      setupPagination(filteredResults, pageEl, rows);
    }
  }
});

// Sort table results in ascending order
Array.from(sortArrowUp).forEach((el, i) => {
  const parameters = ["name", "mass", "year", "recclass"];
  el.addEventListener("click", () => {
    const parameter = parameters[i];
    const sortedResults = filteredResults.slice().sort((a, b) => {
      const aValue = a[parameter] || "";
      const bValue = b[parameter] || "";
      return aValue.localeCompare(bValue, undefined, { numeric: true });
    });
    displayList(sortedResults, table, rows, currentPage);
  });
});

// Sort table results in descending order
Array.from(sortArrowDown).forEach((el, i) => {
  const parameters = ["name", "mass", "year", "recclass"];
  el.addEventListener("click", () => {
    const parameter = parameters[i];
    const sortedResults = filteredResults.slice().sort((a, b) => {
      const aValue = a[parameter] || "";
      const bValue = b[parameter] || "";
      return bValue.localeCompare(aValue, undefined, { numeric: true });
    });
    displayList(sortedResults, table, rows, currentPage);
  });
});

// Function to display first page items in a table
function displayList(items, wrapper, rowsPerPage, page) {
  document.querySelector("main").classList.add("hidden"); // hide main section
  resultSection.classList.remove("hidden"); // make table visible

  wrapper.innerHTML = "";
  page--;

  let start = rowsPerPage * page;
  let end = start + rowsPerPage;
  let paginatedItems = items.slice(start, end);

  // console.log(paginatedItems);

  for (let i = 0; i < paginatedItems.length; i++) {
    let item = paginatedItems[i];
    let itemEl = document.createElement("tr");
    itemEl.innerHTML = `
    <td>${item.name || "-"}</td>
    <td>${item.mass || "-"}</td>
    <td>${item.year ? item.year.substring(0, 4) : "-"}</td>
    <td>${item.recclass || "-"}</td>
    `;
    wrapper.appendChild(itemEl);
  }
}

// Function to create pages
function setupPagination(items, wrapper, rowsPerPage) {
  wrapper.innerHTML = "";

  let pageCount = Math.ceil(items.length / rowsPerPage);
  for (let i = 1; i < pageCount + 1; i++) {
    wrapper.appendChild(paginationBtn(i, items));
  }
}

// Function to create page buttons
function paginationBtn(page, items) {
  let btn = document.createElement("button");
  btn.innerText = page;

  if (currentPage == page) {
    btn.classList.add("active");
  }

  btn.addEventListener("click", () => {
    currentPage = page;
    displayList(items, table, rows, currentPage);

    let currentBtn = document.querySelector("#pagination button.active");
    currentBtn.classList.remove("active");
    btn.classList.add("active");
  });

  return btn;
}

// Change background image

function changeBackgroundImage() {
  const newBackgroundImage = `url('${imagePaths[currentImageIndex]}')`;
  document.body.style.transition = "background-image 0.5s ease";
  document.body.style.backgroundImage = newBackgroundImage;
  setTimeout(() => {
    document.body.style.transition = "none";
  }, 500);
}

// Add event listener for the arrow-left element to change the image
arrowLeft.addEventListener("click", (e) => {
  e.preventDefault();
  currentImageIndex =
    (currentImageIndex - 1 + imagePaths.length) % imagePaths.length;
  changeBackgroundImage();
});

// Add event listener for the arrow-right element to change the image
arrowRight.addEventListener("click", (e) => {
  e.preventDefault();
  currentImageIndex = (currentImageIndex + 1) % imagePaths.length;
  changeBackgroundImage();
});
