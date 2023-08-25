// function search() {
//     alert("This search is limited for Meteorite strikes")
// }
// function advancedSearch() {
//     +prompt(
//     `1. Name

//     2. Year of strike
    
//     3. Meteorite composition (recclass)
    
//     4. Mass range (e.g. low to high, inclusive) 
    
//     5. location`
//     )
// }
// while (true) {
//     const pop = +prompt(`Welcome to Meteor Shower page!

// You can search in meteorite strikes area by two types of search button: 

// 1. Search       2. Advanced Search
// `);
//     switch (pop) {
//         case 1:
//             search();
//             break;
//         case 2:
//             advancedSearch();
//             break;
//         case 3:
//             alert('Invalid option, please choose a valid option')
//             break;
//         default:
//             alert("Invalid choice. Please choose a valid option.");
//     }
//     if (option === 3){
//         break;
//     }
// }

// const popUp = alert(`
// Welcome to Meteor Shower page!

// You can search what you have in your mind in meteorite strikes area by 2 type Search button: Search, Advanced Search.

// With Advanced Search you can Search by these data:

// Name

// Year of strike

// Meteorite composition (recclass)

// Mass range (e.g. low to high, inclusive) )

// location`
// )

const modalContainer = document.getElementById("modalContainer");
const closeButton = document.querySelector(".close");

// Show the modal when the page loads
window.onload = () => {
    modalContainer.style.display = "flex";
};

// Close the modal when the close button is clicked
closeButton.addEventListener("click", () => {
    modalContainer.style.display = "none";
});

