console.log("Hello from gratAff.js!");

//DOM Elements
const DOM = {
  sidebar: document.querySelector(".sidebar"),
  menuBtn: document.getElementById("menu-btn"),
  affirmationText: document.getElementById("affirmation-text"),
  affirmationBtn: document.getElementById("affirmation-shuffle-btn"),
  gratitudeInput: document.getElementById("gratitude-input"),
  saveGratitudeBtn: document.getElementById("save-gratitude-btn"),
  gratitudeHistory: document.getElementById("gratitude-history"),
};


const DEFAULT_AFFIRMATIONS = [];

// Mobile sidebar menu
if (DOM.menuBtn && DOM.sidebar) {
  DOM.menuBtn.addEventListener("click", () => {
    DOM.sidebar.classList.toggle("-translate-x-full");
  });
}
