// Get references to the search input and search button
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const clearButton = document.getElementById("clearButton");
const searchIcon = document.getElementById("searchIcon");
const table = document.getElementById('detailDataDisplay');
const pageEl = document.getElementById('pagination');
const nextPrevContainer = document.getElementById('nextPrevContainer')

//First page of detail display data and number of rows per page
let currentPage = 1;
let rows = 100;

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

// Add event listener for search button click
searchInput.addEventListener("keyup", (e) => {
  e.preventDefault();

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

  //Display results if enter key is pressed
  if(e.key === 'Enter' && (filteredResults.length === 0 || searchText === "")){
    displayList(meteorData, table, rows, currentPage);
    setupPagination(meteorData, pageEl, rows);
  }else{
    displayList(filteredResults, table, rows, currentPage);
    setupPagination(filteredResults, pageEl, rows);
  }

  
});

//function to display first page items in a table
function displayList (items, wrapper, rowsPerPage, page){
  wrapper.innerHTML = "";
  page--;

  let start = rowsPerPage * page;
  let end = start + rowsPerPage;
  let paginatedItems = items.slice(start, end);

  // console.log(paginatedItems);

  for(let i = 0; i < paginatedItems.length; i++){
    let item = paginatedItems[i];
    let itemEl = document.createElement('tr');
    itemEl.innerHTML = `
    <td>${item.name || "-"}</td>
    <td>${item.mass || "-"}</td>
                        <td>${item.year ? item.year.substring(0,4) : "-"}</td>
                        <td>${item.recclass || "-"}</td>
                        <td>${item.reclong || "-"}</td>
                        <td>${item.reclat || "-"}</td>
                      `;
    wrapper.appendChild(itemEl);
  }
}

//function to create pages
function setupPagination(items, wrapper, rowsPerPage){
  wrapper.innerHTML = "";
  
  let pageCount = Math.ceil(items.length / rowsPerPage);
  for(let i = 1; i < pageCount + 1; i++){
    wrapper.appendChild(paginationBtn(i, items))
  }
}


//function to create page buttons
function paginationBtn(page, items){
  let btn = document.createElement('button');
  btn.innerText = page;

  if(currentPage == page){
    btn.classList.add('active');
  }

  btn.addEventListener('click', () => {
    currentPage = page;
    displayList(items, table, rows, currentPage);

    let currentBtn = document.querySelector('#pagination button.active');
    currentBtn.classList.remove('active');
    btn.classList.add('active');
  })

  return btn;
}