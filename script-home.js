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

// Array of image paths
const imagePaths = [
  "assets/landing_page1.jpg",
  "assets/landing_page2.jpg",
  "assets/landing_page3.jpg",
];

// Function to initialize the page
function initializePage() {
  arrowLeft.addEventListener("click", getPrevImg);
  arrowRight.addEventListener("click", getNextImg);
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

// Initialize the page when the DOM is loaded
document.addEventListener("DOMContentLoaded", initializePage);