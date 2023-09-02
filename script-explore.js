// Get references to DOM elements
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const clearButton = document.getElementById("clearButton");
const searchIcon = document.getElementById("searchIcon");
const table = document.getElementById("detailDataDisplay");
const pageEl = document.getElementById("pagination");
const nextPrevContainer = document.getElementById("nextPrevContainer");
const paginationInfo = document.getElementById("paginationInfo");
const sortArrowUp = document.querySelectorAll(".fa-sort-up");
const sortArrowDown = document.querySelectorAll(".fa-sort-down");
const arrowLeft = document.querySelector(".arrow-left");
const arrowRight = document.querySelector(".arrow-right");
const mainWrapper = document.querySelector(".main-wrapper");
const advanceSearch = document.getElementById("advanceSearch");
const filterBtn = document.getElementById("filter-btn"); // 'add filters' button in simple results display
const filterButton = document.getElementById("filterButton"); // 'apply' filter button in advanced results display
const nameFilter = document.getElementById("nameFilter");
const compositionFilter = document.getElementById("compositionFilter");
const massMinFilter = document.getElementById("massMinFilter");
const massMaxFilter = document.getElementById("massMaxFilter");
const yearMinFilter = document.getElementById("yearMinFilter");
const yearMaxFilter = document.getElementById("yearMaxFilter");
const noResultsMessage = document.querySelector(".no-results");

let meteorData = []; // Store fetched meteor data
let filteredResults = []; // Store filtered data
let filteredAdvanceResults = []; // Store filtered advance results
let currentImageIndex = 0; // Current image index
let currentPage = 1; // First page of detail display data
let rows = 100; // Number of rows per page
let searchText; // Store input search terms
let selectedYearRange; // Store year range data

// Function to fetch data from NASA API
function fetchData() {
  fetch("https://data.nasa.gov/resource/gh4g-9sfh.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response error");
      }
      return response.json();
    })
    .then((data) => {
      meteorData = data;
      populateDropdowns();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      const errorElement = document.getElementById("error-message");
      errorElement.textContent =
        "An error occurred while fetching data. Please try again later.";
    });
}

// Function to initialize the page
function initializePage() {
  fetchData();
  initializeMap();

  searchButton.addEventListener("click", handleSearchButtonClick);
  searchInput.addEventListener("keyup", getInputValue);
  filterButton.addEventListener("click", getAdvanceFilter);
  filterBtn.addEventListener("click", (e) => {
    e.preventDefault();
    resultSection.classList.add("hidden");
    advanceSearch.classList.remove("hidden");
  });
}

function handleSearchButtonClick(e) {
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
}

function getInputValue(e) {
  if (e.key === "Enter") {
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
  }
}

// Function to filter results
function getResults() {
  searchText = searchInput.value.toLowerCase().trim();
  const searchNumber = parseFloat(searchText);

  filteredResults = meteorData.filter((meteor) => {
    const name = meteor.name.toLowerCase();
    const mass = meteor.mass ? meteor.mass.toString() : "";
    const year = meteor.year ? meteor.year.toString() : "";
    const massMatches = mass === searchNumber;

    return (
      name.includes(searchText) ||
      mass.includes(searchText) ||
      year.includes(searchText) ||
      massMatches
    );
  });
}

// Function to display first page items in a table
function displayList(items, wrapper, rowsPerPage, page, pageInfowrapper) {
  sortData();
  resultSection.classList.remove("hidden"); // make table visible

  wrapper.innerHTML = "";
  page--;

  let start = rowsPerPage * page;
  let end = start + rowsPerPage;
  let paginatedItems = items.slice(start, end);

  pageInfowrapper.innerText = `Showing meteorite landings ${start + 1} of ${
    end > items.length ? items.length : end
  } out of ${items.length}`;

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

function sortData() {
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
function nextPrevButtons(wrapper, items) {
  let prevBtn = document.createElement("button");
  let nextBtn = document.createElement("button");
  prevBtn.innerHTML = `<i class="fa fa-angle-left"></i><span>Prev</span>`;
  nextBtn.innerHTML = `<span>Next</span><i class="fa fa-angle-right"></i>`;
  wrapper.innerHTML = "";
  wrapper.appendChild(prevBtn);
  wrapper.appendChild(nextBtn);

  prevBtn.addEventListener("click", () => {
    currentPage--;
    displayList(items, table, rows, currentPage, paginationInfo);
    setupPagination(items, pageEl, rows);
    if (currentPage < 1) {
      currentPage = pageEl.childNodes.length;
      displayList(items, table, rows, currentPage, paginationInfo);
      setupPagination(items, pageEl, rows);
    }
  });

  nextBtn.addEventListener("click", () => {
    currentPage++;
    displayList(items, table, rows, currentPage, paginationInfo);
    setupPagination(items, pageEl, rows);
    if (currentPage > pageEl.childNodes.length) {
      currentPage = 1;
      displayList(items, table, rows, currentPage, paginationInfo);
      setupPagination(items, pageEl, rows);
    }
  });
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

function populateDropdowns() {
  const uniqueCompositions = Array.from(
    new Set(meteorData.map((meteor) => meteor.recclass || ""))
  );
  // Sort alphabetically
  uniqueCompositions.sort((a, b) => a.localeCompare(b));

  uniqueCompositions.forEach((composition) => {
    const option = document.createElement("option");
    option.value = composition.toLowerCase();
    option.textContent = composition;
    compositionFilter.appendChild(option);
  });
  // Populate mass dropdowns
  const uniqueMassValues = Array.from(
    new Set(meteorData.map((meteor) => parseFloat(meteor.mass) || ""))
  );
  // Sort the mass in ascending order
  const sortedMassValues = uniqueMassValues
    .filter((value) => typeof value === "number")
    .sort((a, b) => a - b);

  sortedMassValues.forEach((massValue) => {
    const optionMin = document.createElement("option");
    const optionMax = document.createElement("option");
    optionMin.value = massValue;
    optionMin.textContent = `${massValue}`;
    optionMax.value = massValue;
    optionMax.textContent = `${massValue}`;
    massMinFilter.appendChild(optionMin);
    massMaxFilter.appendChild(optionMax);
  });
  // Populate year dropdowns
  const uniqueYearValues = Array.from(
    new Set(meteorData.map((meteor) => parseInt(meteor.year) || ""))
  );
  // Sort the year in ascending order
  const sortedYearValues = uniqueYearValues
    .filter((value) => typeof value === "number")
    .sort((a, b) => a - b);

  sortedYearValues.forEach((yearValue) => {
    const optionMin = document.createElement("option");
    const optionMax = document.createElement("option");
    optionMin.value = yearValue;
    optionMin.textContent = `${yearValue}`;
    optionMax.value = yearValue;
    optionMax.textContent = `${yearValue}`;
    yearMinFilter.appendChild(optionMin);
    yearMaxFilter.appendChild(optionMax);
  });
}

// Initialize the map
function initializeMap() {
  map = L.map("map").setView([51.505, -0.09], 13);

  const cartodbAttribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>';

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
    attribution: cartodbAttribution,
  }).addTo(map);

  window.addEventListener("resize", function () {
    map.invalidateSize();
  });
}

// Add markers to the map
function addMarkersToMap(filteredData) {
  // Clear existing markers or layers
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  const markers = [];

  // Add new markers based on filtered data
  filteredData.forEach((meteor) => {
    const lat = parseFloat(meteor.reclat);
    const lon = parseFloat(meteor.reclong);

    if (!isNaN(lat) && !isNaN(lon)) {
      let marker = L.marker([lat, lon], {
        color: "#f16122",
        // fillColor: "transparent",
        // fillOpacity: 0.5,
        // radius: 500,
      })
        .addTo(map)
        .bindPopup(
          `Name: ${meteor.name},
                    Mass: ${meteor.mass},
                    Year: ${meteor.year},
                    Composition: ${meteor.recclass}`
        );
      markers.push(marker);
    }
  });

  // Marker clustering
  const markerCluster = L.markerClusterGroup();
  markerCluster.addLayers(markers);
  map.addLayer(markerCluster);
}

function getAdvanceFilter(e) {
  e.preventDefault();

  const compositionTerm = compositionFilter.value.toLowerCase().trim();
  const massMin = parseFloat(massMinFilter.value);
  const massMax = parseFloat(massMaxFilter.value);
  const yearMin = parseInt(yearMinFilter.value);
  const yearMax = parseInt(yearMaxFilter.value);

  filteredAdvanceResults = meteorData.filter((meteor) => {
    const composition = (meteor.recclass || "").toLowerCase();
    const mass = parseFloat(meteor.mass);
    const year = parseInt(meteor.year);

    const massInRange =
      (isNaN(massMin) || mass >= massMin) &&
      (isNaN(massMax) || mass <= massMax);
    const yearInRange =
      (isNaN(yearMin) || year >= yearMin) &&
      (isNaN(yearMax) || year <= yearMax);

    const compositionValue = compositionFilter.value;
    const selectedComposition = (meteor.recclass || "").toLowerCase();

    if (
      compositionValue === "" ||
      selectedComposition.includes(compositionValue)
    ) {
      return (
        composition.includes(compositionTerm) && massInRange && yearInRange
      );
    }
  });

  checkResults(filteredAdvanceResults);
  addMarkersToMap(filteredAdvanceResults);
}

function checkResults() {
  if (filteredAdvanceResults.length === 0) {
    noResultsMessage.classList.remove("hidden");
    noResultsMessage.classList.add("no-results");
    updateChart([]);
  } else {
    noResultsMessage.classList.add("hidden");
    noResultsMessage.classList.remove("no-results");
    updateChart(filteredAdvanceResults, selectedYearRange);
  }
}
// Initialize the year histogram
const yearHistogram = new Chart(document.getElementById("yearHistogram"), {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        label: "Number of Strikes by Year",
        data: [],
        backgroundColor: "rgb(225, 85, 33, 0.2)",
        borderColor: "rgb(225, 85, 33, 1)",
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

function updateChart(filteredResults) {
  const average = document.getElementById("averageStrikes");
  const total = document.getElementById("totalStrikes");

  const years = filteredResults.map((item) =>
    item.year ? item.year.substring(0, 4) : "Unknown"
  );
  const yearCounts = {};
  years.forEach((year) => (yearCounts[year] = (yearCounts[year] || 0) + 1));

  // Update the year histogram data
  yearHistogram.data.labels = Object.keys(yearCounts);
  yearHistogram.data.datasets[0].data = Object.values(yearCounts);

  yearHistogram.update();

  // Calculate and log the average strikes
  const averageStrikes = calculateAverageStrikes(yearCounts);
  console.log("Average Strikes per Year:", averageStrikes);
  average.innerHTML = `${averageStrikes}`;
  // Calculate and log the total strikes
  const totalStrikes = calculateTotalStrikes(yearCounts);
  console.log("Total Strikes:", totalStrikes);
  total.innerHTML = `${totalStrikes}`;
}

// Calculate the average number of strikes
function calculateAverageStrikes(yearCounts) {
  const totalYears = Object.keys(yearCounts).length;
  const totalStrikes = Object.values(yearCounts).reduce(
    (total, count) => total + count,
    0
  );

  if (totalYears === 0) {
    return 0;
  }

  const averageStrikes = Math.round(totalStrikes / totalYears);
  return averageStrikes;
}

// Calculate the total number of strikes
function calculateTotalStrikes(yearCounts) {
  const totalStrikes = Object.values(yearCounts).reduce(
    (total, count) => total + count,
    0
  );
  return totalStrikes;
}

// Initialize the page when the DOM is loaded
document.addEventListener("DOMContentLoaded", initializePage);