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
const entryDateInput = document.getElementById("entry-date");
const currentMonthYearEl = document.getElementById("current-month-year");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");

// Stats elements
const averageMoodEl = document.getElementById("average-mood");
const daysTrackingEl = document.getElementById("days-tracking");
const currentStreakEl = document.getElementById("current-streak");

// Modal elements
const messageModal = document.getElementById("message-modal");
const modalText = document.getElementById("modal-text");
const modalCloseBtn = document.getElementById("modal-close");

// Start selected mood at null
let selectedMood = null;
// To keep track of the month displayed on the calendar
let currentDate = new Date();

// Helper function to show modal messages
function showModal(message) {
  modalText.textContent = message;
  messageModal.classList.remove("hidden");
}
// Close modal on button click
modalCloseBtn.addEventListener("click", () => {
  messageModal.classList.add("hidden");
});

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
const saveEntryBtn = document.getElementById("save-entry");
saveEntryBtn.addEventListener("click", function (e) {
  console.log("Save Btn Clicked!");
  // Prevent any accidental form submission (if inside form)
  e.preventDefault();

  const journalText = journalEntry.value;
  const selectedDate = entryDateInput.value;

  // Debug info — check these in browser console
  console.log({ selectedMood, journalTextLength: journalText.length });

  // validations
  if (!selectedMood) {
    // alert("Please select a mood before saving.");
    showModal("Please select a mood before saving.");
    return;
  }

  if (!journalText) {
    // alert("Please write a journal entry before saving.");
    showModal("Please write a journal entry before saving.");
    return;
  }

  // Formatting the saved entry object data
  const entry = { date: selectedDate, mood: selectedMood, journalText };

  // Prevent duplicate entries by checking the date
  entries = entries.filter((e) => e.date !== selectedDate);
  entries.push(entry);

  // Save to local storage
  localStorage.setItem("entries", JSON.stringify(entries));

  // Clear journal text area
  journalEntry.value = "";
  selectedMood = null;
  document
    .querySelectorAll(".mood-icon")
    .forEach((icon) => icon.classList.remove("selected"));

  // Render Calendar
  renderCalendar();
  // alert("Entry Saved!");
  showModal("Entry Saved!");
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
  currentMonthYearEl.textContent = `${currentDate.toLocaleString("default", {
    month: "long",
  })} ${currentDate.getFullYear()}`;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  // Calendar grid
  const grid = document.createElement("div");
  grid.className = "calendar-grid";

  //Add weekdays
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  weekdays.forEach((day) => {
    const h = document.createElement("div");
    h.className = "calendar-header";
    h.textContent = day;
    grid.appendChild(h);
  });

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
    dayBox.setAttribute("data-date", dateStr);

    // Add day number
    const num = document.createElement("div");
    num.className = "day-number";
    num.textContent = day;
    dayBox.appendChild(num);

    if (entry && entry.mood && moodEmojis[entry.mood]) {
      const img = document.createElement("img");
      img.src = moodEmojis[entry.mood];
      img.alt = entry.mood;
      img.className = "calendar-mood-icon"; // small dedicated class
      dayBox.appendChild(img);
    }
    grid.appendChild(dayBox);
  }
  calendar.appendChild(grid);
}

// Function to populate the form from a clicked day
calendar.addEventListener("click", (e) => {
  const dayBox = e.target.closest(".calendar-day");
  if (dayBox && !dayBox.classList.contains("empty")) {
    const selectedDateStr = dayBox.getAttribute("data-date");
    entryDateInput.value = selectedDateStr;

    const entry = entries.find((e) => e.date === selectedDateStr);

    // Clear existing selection
    document
      .querySelectorAll(".mood-icon")
      .forEach((icon) => icon.classList.remove("selected"));

    if (entry) {
      journalEntry.value = entry.journalText;
      selectedMood = entry.mood;
      const moodIcon = document.querySelector(
        `.mood-icon[data-mood="${entry.mood}"]`
      );
      if (moodIcon) {
        moodIcon.classList.add("selected");
      }
    } else {
      // If no entry, clear the form
      journalEntry.value = "";
      selectedMood = null;
    }
  }
});

// Set up calendar navigation
prevMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

// Function to calculate and update stats
function updateStats() {
  if (entries.length === 0) {
    averageMoodEl.textContent = "--";
    daysTrackingEl.textContent = "0";
    currentStreakEl.textContent = "0";
    return;
  }

  const moodValues = {
    happy: 5,
    excited: 5,
    calm: 4,
    anxious: 2,
    sad: 1,
    angry: 1,
  };

  // Calculate average mood
  const totalMoodValue = entries.reduce(
    (sum, entry) => sum + moodValues[entry.mood],
    0
  );
  const averageMood = totalMoodValue / entries.length;
  averageMoodEl.textContent = averageMood.toFixed(1);

  // Calculate days tracking
  daysTrackingEl.textContent = entries.length;

}

// Initialize app
function initApp() {
  // Ensure the modal is hidden on page load
  messageModal.classList.add("hidden");

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const todayStr = `${year}-${month}-${day}`;
  entryDateInput.value = todayStr;
  renderCalendar();
  updateStats();
}

initApp();
