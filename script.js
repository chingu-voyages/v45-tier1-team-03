// Get references to the search input and search button
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const clearButton = document.getElementById("clearButton");
const searchIcon = document.getElementById("searchIcon");
const resultSection = document.getElementById("resultSection");
const sortArrowUp = document.querySelectorAll(".fa-sort-up")
const sortArrowDown = document.querySelectorAll(".fa-sort-down");

// Array to store fetched meteor data
let meteorData = [];

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

// Function to filter and display results
function getResults() {
  // Get the search text from the input field and convert to lowercase
  const searchText = searchInput.value.toLowerCase();

  // Check if the input is empty
  if (searchText !== "") {
    searchIcon.classList.add("hidden");
  } else {
    searchIcon.classList.remove("hidden");
  }

  // Convert searchText to a number (mass must be a number for precise comparison)
  const searchNumber = parseFloat(searchText);

  // Filter meteor data based on search criteria
  const filteredResults = meteorData.filter((meteor) => {
    const name = meteor.name.toLowerCase();
    const mass = meteor.mass ? meteor.mass.toString() : "";
    const year = meteor.year ? meteor.year.toString() : "";
    const reclong = meteor.reclong ? meteor.reclong.toString() : "";
    const reclat = meteor.reclat ? meteor.reclat.toString() : "";

    // Check if mass matches exactly (converted to float for precision)
    const massMatches = mass === searchNumber;

    // Compare search text with various criteria
    return (
      name.includes(searchText) ||
      mass.includes(searchText) ||
      year.includes(searchText) ||
      reclong === searchText ||
      reclat === searchText ||
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

  // Display and sort results
  buildTable(filteredResults);
  sortTable(filteredResults);
}

// Add event listener to search button
searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  getResults();
})

// Add event listener to input field
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    getResults();
  }
})

//function for appending filtered results in an HTML table
function buildTable(data){
  document.querySelector("main").classList.add("hidden") // hide main section
  resultSection.classList.remove("hidden") // make table visible
  const table = document.getElementById('detailDataDisplay');
  table.innerHTML = "";

  for(let i=0; i<data.length; i++){
    let row = `<tr>
                  <td>${data[i].name || "-"}</td>
                  <td>${data[i].mass || "-"}</td>
                  <td>${data[i].year ? data[i].year.toString().substring(0,4) : "-"}</td>
                  <td>${data[i].recclass || "-"}</td>
                  <td>${data[i].reclong || "-"}</td>
                  <td>${data[i].reclat || "-"}</td>
              </tr>`
              table.innerHTML += row;
  }
}

// Function to sort table results
function sortTable(data) {
  const parameters = ["name", "mass", "year", "recclass", "reclong", "reclat"];

  Array.from(sortArrowUp).forEach((el, i) => {
    el.addEventListener("click", () => {
      const parameter = parameters[i];
      const sortedResults = data.slice().sort((a, b) => {
        const aValue = a[parameter] || "";
        const bValue = b[parameter] || "";
        return aValue.localeCompare(bValue, undefined, {numeric: true});
      })
      buildTable(sortedResults);
    })
  })

  Array.from(sortArrowDown).forEach((el, i) => {
    el.addEventListener("click", () => {
      const parameter = parameters[i];
      const sortedResults = data.slice().sort((a, b) => {
        const aValue = a[parameter] || "";
        const bValue = b[parameter] || "";
        return bValue.localeCompare(aValue, undefined, {numeric: true});
      })
      buildTable(sortedResults);
    })
  })
}