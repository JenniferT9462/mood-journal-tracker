console.log("Hello from script.js!");

// Get DOM elements
const moodOptions = document.getElementById("mood-options");
const journalEntry = document.getElementById("journal-entry");
const calendar = document.getElementById("calendar");
const daysTracked = document.getElementById("days-tracked");
const streak= document.getElementById("streak");
const avgMood = document.getElementById("avg-mood");

// Start selected mood at null
let selectedMood = null;

// Save icon btns
const moodInputs = document.querySelectorAll(".mood-icon");
moodInputs.forEach(mood => {
    mood.addEventListener("click", () => {
        console.log("Mood Icon Clicked!");
    })
})

// Event handler for the save entry button
const saveEntry = document.getElementById("save-entry");
saveEntry.addEventListener("click", function() {
    console.log("Save Btn Clicked!");
})
