import updateChart from "./chart.js";
import getChart from "./chart.js";

// Get references to the search input and search button
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const clearButton = document.getElementById("clearButton");
const searchIcon = document.getElementById("searchIcon");
const table = document.getElementById("detailDataDisplay");
const pageEl = document.getElementById("pagination");
const nextPrevContainer = document.getElementById("nextPrevContainer");
const paginationInfo = document.getElementById("paginationInfo")
const sortArrowUp = document.querySelectorAll(".fa-sort-up");
const sortArrowDown = document.querySelectorAll(".fa-sort-down");
const arrowLeft = document.querySelector(".arrow-left");
const arrowRight = document.querySelector(".arrow-right");
const mainWrapper = document.querySelector(".main-wrapper");
const advanceSearch = document.getElementById("advanceSearch");
const filterBtn = document.getElementById("filter-btn");
const filterButton = document.getElementById("filterButton");
const nameFilter = document.getElementById("nameFilter");
// const idFilter = document.getElementById("idFilter");
const recclassFilter = document.getElementById("recclassFilter");
const massMinFilter = document.getElementById("massMinFilter");
const massMaxFilter = document.getElementById("massMaxFilter");
const yearMinFilter  = document.getElementById("yearMinFilter");
const yearMaxFilter  = document.getElementById("yearMaxFilter");
const noResultsMessage = document.querySelector(".no-results");

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
let selectedYearRange;

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
});

// Function to filter results
function getResults() {
  // Store the search text from the input field and convert to lowercase
  searchText = searchInput.value.toLowerCase().trim();
  
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
    currentPage = 1;
    displayList(meteorData, table, rows, currentPage, paginationInfo);
    setupPagination(meteorData, pageEl, rows);
    nextPrevButtons(nextPrevContainer, meteorData);
  } else {
    currentPage = 1;
    displayList(filteredResults, table, rows, currentPage, paginationInfo);
    setupPagination(filteredResults, pageEl, rows);
    nextPrevButtons(nextPrevContainer, filteredResults);
  }
});

// Add event listener to input field
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    getResults();
    if (filteredResults.length === 0 || searchText === "") {
      currentPage = 1;
      displayList(meteorData, table, rows, currentPage, paginationInfo);
      setupPagination(meteorData, pageEl, rows);
      nextPrevButtons(nextPrevContainer, meteorData)
    } else {
      currentPage = 1;
      displayList(filteredResults, table, rows, currentPage, paginationInfo);
      setupPagination(filteredResults, pageEl, rows);
      nextPrevButtons(nextPrevContainer, filteredResults)
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
    displayList(sortedResults, table, rows, currentPage, paginationInfo);
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
    displayList(sortedResults, table, rows, currentPage, paginationInfo);
  });
});

// Function to display first page items in a table
function displayList(items, wrapper, rowsPerPage, page, pageInfowrapper) {
  mainWrapper.classList.add("hidden"); // hide main section
  resultSection.classList.remove("hidden"); // make table visible
  
  wrapper.innerHTML = "";
  page--;
  
  let start = rowsPerPage * page;
  let end = start + rowsPerPage;
  let paginatedItems = items.slice(start, end);

  pageInfowrapper.innerText = `Showing meteorite landings ${start+1} of ${end > items.length ? items.length : end} out of ${items.length}`;
  
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



//Function to create Next and Prev Buttons
function nextPrevButtons(wrapper, items){
  let prevBtn = document.createElement('button');
  let nextBtn = document.createElement('button');
  prevBtn.innerHTML = `<i class="fa fa-angle-left"></i><span>Prev</span>`;
  nextBtn.innerHTML = `<span>Next</span><i class="fa fa-angle-right"></i>`;
  wrapper.innerHTML = "";
  wrapper.appendChild(prevBtn);
  wrapper.appendChild(nextBtn);

  prevBtn.addEventListener('click', () => {
    currentPage--;
    displayList(items, table, rows, currentPage, paginationInfo);
    setupPagination(items, pageEl, rows);
    if(currentPage < 1){
      currentPage = pageEl.childNodes.length;
      displayList(items, table, rows, currentPage, paginationInfo);
      setupPagination(items, pageEl, rows);
    }
  })

  nextBtn.addEventListener('click', () => {
    currentPage++;
    displayList(items, table, rows, currentPage, paginationInfo);
    setupPagination(items, pageEl, rows);
    if(currentPage > pageEl.childNodes.length){
      currentPage = 1;
      displayList(items, table, rows, currentPage, paginationInfo);
      setupPagination(items, pageEl, rows);
    }
  })
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
  document.body.style.transition = "background-image 0.5s ease, opacity 0.5s ease";
  document.body.style.backgroundImage = newBackgroundImage;
  document.body.style.opacity = 0.8;
  setTimeout(() => {
    document.body.style.transition = "none";
    document.body.style.opacity = 1;
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

filterBtn.addEventListener("click", (e) => {
  e.preventDefault();
  resultSection.classList.add("hidden");
  advanceSearch.classList.remove("hidden");
})

// Search based on advance filter
filterButton.addEventListener("click", (e) => {
  e.preventDefault();
  
  const nameTerm = nameFilter.value.toLowerCase().trim();
  const recclassTerm = recclassFilter.value.toLowerCase().trim();
  const massMin = parseFloat(massMinFilter.value);
  const massMax = parseFloat(massMaxFilter.value);
  const yearMin = parseInt(yearMinFilter.value);
  const yearMax = parseInt(yearMaxFilter.value);

  const filteredResults = meteorData.filter(meteor => {
    const name = (meteor.name || "").toLowerCase(); 
    const recclass = (meteor.recclass || "").toLowerCase();
    const mass = parseFloat(meteor.mass);
    const year = parseInt(meteor.year);

    // Check if mass and year are within the specified ranges
    const massInRange = (isNaN(massMin) || mass >= massMin) && (isNaN(massMax) || mass <= massMax);
    const yearInRange = (isNaN(yearMin) || year >= yearMin) && (isNaN(yearMax) || year <= yearMax);

    selectedYearRange = `${yearMin} - ${yearMax}`;

    return (
      name.includes(nameTerm) && 
      recclass.includes(recclassTerm) &&
      massInRange && yearInRange
    );
  });

  if (filteredResults.length === 0) {
    noResultsMessage.classList.remove("hidden");
    noResultsMessage.classList.add("no-results");
    updateChart([]);
  } else {
    noResultsMessage.classList.add("hidden");
    noResultsMessage.classList.remove("no-results");
    updateChart(filteredResults, selectedYearRange);
  }
 
  console.log("Advance Results:", filteredResults);
});

