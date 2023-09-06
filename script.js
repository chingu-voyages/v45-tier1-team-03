// DOM element references
const mainMenu = document.querySelector('.mainMenu');
const closeMenu = document.querySelector('.closeMenu');
const openMenu = document.querySelector('.openMenu');
const links = document.querySelectorAll(".links");
const panels = document.querySelectorAll(".panel");
const explore = document.getElementById("explore");
const exploreLink = document.getElementById("exploreLink");
const searchInput = document.getElementById("searchInput");
const searchWrapper = document.getElementById("searchWrapper");
// const searchButton = document.getElementById("searchButton");
const exploreBtn = document.getElementById("exploreBtn");
const clearButton = document.getElementById("clearButton");
const searchIcon = document.getElementById("searchIcon");
const resultsWrapper = document.getElementById("advanceSearch");
const table = document.getElementById("detailDataDisplay");
const pageEl = document.getElementById("pagination");
const nextPrevContainer = document.getElementById("nextPrevContainer");
const paginationInfo = document.getElementById("paginationInfo");
const sortArrow = document.querySelectorAll(".fa-sort");
const arrowLeft = document.querySelector(".arrow-left");
const arrowRight = document.querySelector(".arrow-right");
const mainWrapper = document.querySelector(".main-wrapper");
const mapBtn = document.getElementById("map-btn");
const filterButton = document.getElementById("filterButton");
const nameFilter = document.getElementById("nameFilter");
const compositionFilter = document.getElementById("compositionFilter");
const massMinFilter = document.getElementById("massMinFilter");
const massMaxFilter = document.getElementById("massMaxFilter");
const yearMinFilter = document.getElementById("yearMinFilter");
const yearMaxFilter = document.getElementById("yearMaxFilter");
const noResultsMessage = document.querySelector(".no-results");
const tableBtn = document.getElementById("switchButton");
const tableWrapper = document.getElementById("table");
const mapWrapper = document.getElementById("mapWrapper");
const saveButton = document.getElementById("saveButton");
const clearPrevBtn = document.getElementById("clearPrevBtn");
const resetButton = document.getElementById("resetButton");

// Nav
openMenu.addEventListener('click', show);
closeMenu.addEventListener('click', close);

function show() {
  mainMenu.style.display = 'flex';
  mainMenu.style.top = '0';
}
function close() {
  mainMenu.style.top = '-100%';
}

// Data
let meteorData = []; // Store fetched meteor data
let filteredResults = []; // Store filtered data
let filteredAdvanceResults = []; // Store filtered advance results
let currentImageIndex = 0; // Current image index
let currentPage = 1; // First page of detail display data
let rows = 20; // Number of rows per page
let searchText; // Store input search terms
let selectedYearRange; // Store year range data
let markerCluster; // Store marker cluster
let currentSortParameter = "name"; // Default sorting parameter
let isAscending = true; // Default sorting order

// Constants
const imagePaths = [
  "assets/landing_page1.jpg",
  "assets/landing_page2.jpg",
  "assets/landing_page3.jpg",
];

// Data fetching and initialization
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

// Functions related to UI initialization
function initializePage() {
  fetchData();
  handleLinks();
  initializeMap();

  exploreBtn.addEventListener("click", handleStart);
  exploreLink.addEventListener("click", displayResults);
  // searchButton.addEventListener("click", displayResults);
  tableBtn.addEventListener("click", switchToTable);
  mapBtn.addEventListener("click", switchToMap);
  searchInput.addEventListener("keyup", displayResults);
  arrowLeft.addEventListener("click", getPrevImg);
  arrowRight.addEventListener("click", getNextImg);
  filterButton.addEventListener("click", getAdvanceFilter);
  saveButton.addEventListener("click", saveFilter);
  clearPrevBtn.addEventListener("click", clearSavedSearches);
  resetButton.addEventListener("click", resetResults);
  clearButton.addEventListener("click", clearSearch);
}

function handleLinks() {
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      panels.forEach((element) => {
        element.classList.add("hidden");
      });
      document.getElementById(e.target.dataset.id).classList.remove("hidden");
    });
  });
}

function handleStart(e) {
  e.preventDefault();
  explore.classList.remove("hidden");
  mainWrapper.classList.add("hidden");
  resultsWrapper.classList.add("hidden");
}

function getSearch() {
  explore.classList.remove("hidden");
  resultsWrapper.classList.remove("hidden");
  searchWrapper.style.transform = "translateY(-70px)";
  // searchButton.style.transform = "translateX(-600px)";
}

function clearSearch() {
  searchInput.value = "";
}

function switchToTable(e) {
  e.preventDefault();
  tableWrapper.classList.remove("hidden");
  mapWrapper.classList.add("hidden");
}

function switchToMap(e) {
  e.preventDefault();
  mapWrapper.classList.remove("hidden");
  tableWrapper.classList.add("hidden");
}

function getInputValue(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    displayResults();
  }
}

function displayResults() {
  getSearch();
  getResults();

  if (filteredResults.length === 0 || searchText === "") {
    currentPage = 1;
    displayList(meteorData, table, rows, currentPage, paginationInfo);
    setupPagination(meteorData, pageEl, rows);
    nextPrevButtons(nextPrevContainer, meteorData);
    addMarkersToMap(meteorData);
    updateChart(meteorData);
    listSavedFilters();
  } else {
    currentPage = 1;
    displayList(filteredResults, table, rows, currentPage, paginationInfo);
    setupPagination(filteredResults, pageEl, rows);
    nextPrevButtons(nextPrevContainer, filteredResults);
    updateChart(filteredResults);
    addMarkersToMap(filteredResults);
    listSavedFilters();
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

// Adding event listeners to all sort icons
Array.from(sortArrow).forEach((el, i) => {
  el.addEventListener("click", () => {
    const parameters = ["name", "mass", "year", "recclass"];
    const clickedParameter = parameters[i];

    if (clickedParameter === currentSortParameter) {
      isAscending = !isAscending; // Toggle sorting order
    } else {
      currentSortParameter = clickedParameter;
      isAscending = true; // Reset sorting order
    }
    if (searchText) {
      sortData(filteredResults);
    } else {
      sortData(meteorData)
    }
  });
});

// Function to sort results in ascending/descending order
function sortData(data) {
  data = data.sort((a, b) => {
    const aValue = a[currentSortParameter] || "";
    const bValue = b[currentSortParameter] || "";
    return isAscending
      ? aValue.localeCompare(bValue, undefined, { numeric: true })
      : bValue.localeCompare(aValue, undefined, { numeric: true });
  });
  displayList(data, table, rows, currentPage, paginationInfo);
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

// Change background image
function changeBackgroundImage() {
  const newBackgroundImage = `url('${imagePaths[currentImageIndex]}')`;
  document.body.style.transition =
    "background-image 0.5s ease, opacity 0.5s ease";
  document.body.style.backgroundImage = newBackgroundImage;
  document.body.style.opacity = 0.8;
  setTimeout(() => {
    document.body.style.transition = "none";
    document.body.style.opacity = 1;
  }, 500);
}

function getNextImg(e) {
  e.preventDefault();
  currentImageIndex = (currentImageIndex + 1) % imagePaths.length;
  changeBackgroundImage();
}

function getPrevImg(e) {
  e.preventDefault();
  currentImageIndex =
    (currentImageIndex - 1 + imagePaths.length) % imagePaths.length;
  changeBackgroundImage();
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
  map = L.map("map").setView([0, 0], 2);

  const cartodbAttribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>';

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
    noWrap: true,
    bounds: [
      [-90, -180],
      [90, 180],
    ],
    attribution: cartodbAttribution,
  }).addTo(map);

  // window.dispatchEvent(new Event('resize'), function () {
  //   map.invalidateSize();
  // });
}

// Add markers to the map
function addMarkersToMap(filteredData) {
  try {
    map.eachLayer((layer) => {
      if (layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    if (markerCluster) {
      map.removeLayer(markerCluster);
    }

    const markers = [];

    filteredData.forEach((meteor) => {
      const lat = parseFloat(meteor.reclat);
      const lon = parseFloat(meteor.reclong);

      if (!isNaN(lat) && !isNaN(lon)) {
        let marker = L.circle([lat, lon], {
          color: "#f16122",
        })
          .addTo(map)
          .bindPopup(
            `Name: ${meteor.name},
                    Mass: ${meteor.mass},
                    Year: ${meteor.year},
                    Composition: ${meteor.recclass}
        `
          );
        markers.push(marker);
      }
    });

    markerCluster = L.markerClusterGroup();
    markerCluster.addLayers(markers);
    map.addLayer(markerCluster);
  } catch (error) {
    console.error("Error adding markers to map:", error);
  }
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
  displayList(filteredAdvanceResults, table, rows, currentPage, paginationInfo);
}

function checkResults(data) {
  filteredAdvanceResults = data;
  if (filteredAdvanceResults.length === 0) {
    noResultsMessage.classList.remove("hidden");
    noResultsMessage.classList.add("no-results");
    updateChart([]);
  } else {
    noResultsMessage.classList.add("hidden");
    noResultsMessage.classList.remove("no-results");
    updateChart(filteredAdvanceResults, selectedYearRange);
    addMarkersToMap(filteredAdvanceResults);
    displayList(
      filteredAdvanceResults,
      table,
      rows,
      currentPage,
      paginationInfo
    );
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

function updateChart(results) {
  const average = document.getElementById("averageStrikes");
  const total = document.getElementById("totalStrikes");

  const years = results.map((item) =>
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

// Function to save filters to local sotrage
function saveFilter() {
  const dummyEvent = {
    preventDefault: () => {} // define a preventDefault function to avoid errors
  };
  getAdvanceFilter(dummyEvent);

  const newFilterItem = JSON.stringify(filteredAdvanceResults);
  const timestamp = new Date().toJSON().slice(0, 19).replace("T", " / ");
  const filterID = "filterID: " + timestamp
  localStorage.setItem(filterID, newFilterItem);
  listSavedFilters();
}

// Function to display local storage list of filters
function listSavedFilters() {
  const savedFiltersList = document.getElementById("savedFiltersList");
  savedFiltersList.innerHTML = "";

  for (let i = 0; i < localStorage.length; i++) {
    const timestamp = localStorage.key(i)
    if (timestamp.length === 31 && timestamp.indexOf(" / ") === 20 && timestamp.split(":").length === 4) {
      const filterDataJSON = localStorage.getItem(timestamp);
      const filterData = JSON.parse(filterDataJSON);

      const listItem = document.createElement("li");
      savedFiltersList.appendChild(listItem);
      const listItemText = document.createElement("span");
      listItem.appendChild(listItemText);
      const deleteBtn = document.createElement("i");
      deleteBtn.classList.add("fa-solid");
      deleteBtn.classList.add("fa-trash-can");
      listItemText.textContent = `${timestamp.slice(10)}`;
      listItem.appendChild(deleteBtn);

      deleteBtn.addEventListener("click", () => {
        localStorage.removeItem(timestamp);
        listSavedFilters();
      })

      listItemText.addEventListener('click', () => {
        checkResults(filterData);
        addMarkersToMap(filterData);
      })
    }
  }
}

// Function to clear all saved filters
function clearSavedSearches() {
  const keysToRemove = Object.keys(localStorage).filter(item => item.startsWith("filterID: ") && item.split(":").length === 4 && item.indexOf(" / ") === 20);
  keysToRemove.forEach(key => localStorage.removeItem(key));
  listSavedFilters();
}

function resetResults() {
  searchInput.value = "";
  compositionFilter.value = "";
  massMinFilter.value = "";
  massMaxFilter.value = "";
  yearMinFilter.value = "";
  yearMaxFilter.value = "";
  filteredResults = [];
  filteredAdvanceResults = [];
  displayResults();
}

// Initialize the page when the DOM is loaded
document.addEventListener("DOMContentLoaded", initializePage);
