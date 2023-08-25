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

