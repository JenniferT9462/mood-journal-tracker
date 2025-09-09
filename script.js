console.log("Hello from script.js!");

// Store entries in localStorage
let entries = JSON.parse(localStorage.getItem("entries")) || [];

// Get DOM elements
const moodOptions = document.getElementById("mood-options");
const journalEntry = document.getElementById("journal-entry");
const calendar = document.getElementById("calendar");
const daysTracked = document.getElementById("days-tracked");
const streak = document.getElementById("streak");
const avgMood = document.getElementById("avg-mood");

// Start selected mood at null
let selectedMood = null;

// Save icon btns
const moodInputs = document.querySelectorAll(".mood-icon");

moodOptions.addEventListener("click", (e) => {
  console.log("Mood Icon Clicked!");
  const icon = e.target.closest(".mood-icon");
  if (!icon) return;

  selectedMood = icon.getAttribute("data-mood");

  document
    .querySelectorAll(".mood-icon")
    .forEach((i) => i.classList.remove("selected"));
  icon.classList.add("selected");

  console.log("Mood selected ->", selectedMood);
});

// Event handler for the save entry button
const saveEntry = document.getElementById("save-entry");
saveEntry.addEventListener("click", function (e) {
  console.log("Save Btn Clicked!");
  // Prevent any accidental form submission (if inside form)
  if (e && e.preventDefault) e.preventDefault();

  const journalText = journalEntry.value;

  // Debug info — check these in browser console
  console.log({ selectedMood, journalTextLength: journalText.length });

  // validations
  if (!selectedMood) {
    alert("Please select a mood before saving.");
    return;
  }

  if (!journalText) {
    alert("Please write a journal entry before saving.");
    return;
  }

  const today = new Date().toISOString().split("T")[0]; //YYYY-MM-DD
  // Formatting the saved entry object data
  const entry = { date: today, mood: selectedMood, journalText };

  // Prevent duplicate entries by checking the date
  entries = entries.filter((e) => e.date !== today);
  entries.push(entry);

  // Save to local storage
  localStorage.setItem("entries", JSON.stringify(entries));

  // Update Stats

  // Clear journal text area
  journalEntry.value = "";
  selectedMood = null;
  document
    .querySelectorAll(".mood-icon")
    .forEach((icon) => icon.classList.remove("selected"));

  // Render Calendar
  renderCalendar();
  alert("Entry Saved!");
});

// Render the calendar for the current month
const moodEmojis = {
  happy: "assets/happy.png",
  excited: "assets/excited.png",
  calm: "assets/calm.png",
  anxious: "assets/anxious.png",
  sad: "assets/sad.png",
  angry: "assets/angry.png",
};

function renderCalendar() {
  calendar.innerHTML = "";

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();


   // Calendar grid
  const grid = document.createElement("div");
  grid.className = "calendar-grid";
  //Add weekdays
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const headerRow = document.createElement("div");
  headerRow.className = "d-flex flex-wrap";
  weekdays.forEach(day => {
    const h = document.createElement("div");
    h.className = "calendar-header";
    h.textContent = day;
    headerRow.appendChild(h);
  })
  calendar.appendChild(headerRow);

  

   // Empty slots before the 1st of the month
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "calendar-day empty";
    grid.appendChild(empty);
  }


  //Fill in days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    const entry = entries.find((e) => e.date === dateStr);

    const dayBox = document.createElement("div");
    dayBox.className = "calendar-day";
    

    if (entry) {
        const img = document.createElement("img");
        img.src = moodEmojis[entry.mood];
        img.alt = "Mood";
        img.style.width = "32px";
        img.style.height = "32px";
        dayBox.appendChild(img);
    } else {
      dayBox.textContent = day;
    }
    grid.appendChild(dayBox);
  }
  calendar.appendChild(grid);
}
renderCalendar();
