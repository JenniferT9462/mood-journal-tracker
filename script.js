console.log("Hello from script.js!");

// --- State Variables ---
let entries = JSON.parse(localStorage.getItem("entries")) || [];
let selectedMood = null;
let currentDate = new Date();

// --- DOM Element References ---
// All elements are defined here at the top.
const DOM = {
  moodOptions: document.getElementById("mood-options"),
  journalEntry: document.getElementById("journal-entry"),
  calendar: document.getElementById("calendar"),
  entryDateInput: document.getElementById("entry-date"),
  currentMonthYear: document.getElementById("current-month-year"),
  prevMonthBtn: document.getElementById("prev-month"),
  nextMonthBtn: document.getElementById("next-month"),
  saveEntryBtn: document.getElementById("save-entry"),
  averageMood: document.getElementById("average-mood"),
  daysTracking: document.getElementById("days-tracking"),
  currentStreak: document.getElementById("current-streak"),
  messageModal: document.getElementById("message-modal"),
  modalText: document.getElementById("modal-text"),
  modalCloseBtn: document.getElementById("modal-close"),
  menuBtn: document.getElementById("menu-btn"),
  sidebar: document.querySelector(".sidebar"),
};

// --- Constants ---
const MOOD_EMOJIS = {
  happy: "assets/happy.png",
  excited: "assets/excited.png",
  calm: "assets/calm.png",
  anxious: "assets/anxious.png",
  sad: "assets/sad.png",
  angry: "assets/angry.png",
};

const MOOD_VALUES = {
  happy: 5,
  excited: 5,
  calm: 4,
  anxious: 2,
  sad: 1,
  angry: 1,
};


// --- Helper Functions ---

/**
 * Shows a modal with a specified message.
 * @param {string} message - The message to display in the modal.
 */
function showModal(message) {
  DOM.modalText.textContent = message;
  DOM.messageModal.classList.remove("hidden");
}

/**
 * Clears the selected mood from the UI.
 */
function clearMoodSelection() {
  selectedMood = null;
  document.querySelectorAll(".mood-icon.selected").forEach(icon => {
    icon.classList.remove("selected");
  });
}

/**
 * Updates the calendar header to show the current month and year.
 */
function updateCalendarHeader() {
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();
  DOM.currentMonthYear.textContent = `${monthName} ${year}`;
}

/**
 * Saves entries to localStorage.
 */
// On your journal entry page (index.html)
function saveJournalEntry(entry) {
    // 1. Get existing data with the key "entries"
    const existingEntries = JSON.parse(localStorage.getItem('entries') || '[]');
    
    // 2. Add the new entry to the array
    existingEntries.push(entry);
    
    // 3. Save the updated array back to localStorage with the key "entries"
    localStorage.setItem('entries', JSON.stringify(existingEntries));
}
// --- Event Handlers ---

/**
 * Handles the click event for mood icons.
 * @param {MouseEvent} e - The click event object.
 */
function handleMoodSelection(e) {
  const icon = e.target.closest(".mood-icon");
  if (!icon) return;

  clearMoodSelection();
  selectedMood = icon.getAttribute("data-mood");
  icon.classList.add("selected");
}

/**
 * Handles the click event for saving a new journal entry.
 * @param {MouseEvent} e - The click event object.
 */
async function handleEntrySave(e) {
  e.preventDefault();

  const journalText = DOM.journalEntry.value;
  const selectedDate = DOM.entryDateInput.value;

  if (!selectedMood) {
    showModal("Please select a mood before saving.");
    return;
  }
  if (!journalText) {
    showModal("Please write a journal entry before saving.");
    return;
  }

  const newEntry = {
    date: selectedDate,
    mood: selectedMood,
    journalText
  };

  // Remove existing entry for the same date to prevent duplicates
  entries = entries.filter(entry => entry.date !== selectedDate);
  entries.push(newEntry);
  saveEntries();

  // Reset UI and state
  DOM.journalEntry.value = "";
  clearMoodSelection();
  updateUI();
  showModal("Entry Saved! 🎉");
}

/**
 * Handles the click event for calendar days.
 * @param {MouseEvent} e - The click event object.
 */
function handleCalendarClick(e) {
  const dayBox = e.target.closest(".calendar-day");
  if (!dayBox || dayBox.classList.contains("empty")) return;

  const dateStr = dayBox.getAttribute("data-date");
  DOM.entryDateInput.value = dateStr;

  const entry = entries.find(e => e.date === dateStr);
  clearMoodSelection();

  if (entry) {
    DOM.journalEntry.value = entry.journalText;
    selectedMood = entry.mood;
    const moodIcon = document.querySelector(`.mood-icon[data-mood="${entry.mood}"]`);
    if (moodIcon) {
      moodIcon.classList.add("selected");
    }
  } else {
    DOM.journalEntry.value = "";
  }
}

/**
 * Handles calendar navigation (previous and next month).
 * @param {number} monthChange - The number of months to change (e.g., -1 for previous).
 */
function handleMonthChange(monthChange) {
  currentDate.setMonth(currentDate.getMonth() + monthChange);
  updateUI();
}

// --- Main Render Functions ---

/**
 * Renders the calendar grid for the current month.
 */
function renderCalendar() {
  DOM.calendar.innerHTML = "";
  updateCalendarHeader();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const grid = document.createElement("div");
  grid.className = "calendar-grid";

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  weekdays.forEach(day => {
    const header = document.createElement("div");
    header.className = "calendar-header";
    header.textContent = day;
    grid.appendChild(header);
  });

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "calendar-day empty";
    grid.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayBox = document.createElement("div");
    dayBox.className = "calendar-day";
    dayBox.setAttribute("data-date", dateStr);

    const num = document.createElement("div");
    num.className = "day-number";
    num.textContent = day;
    dayBox.appendChild(num);

    const entry = entries.find(e => e.date === dateStr);
    if (entry && MOOD_EMOJIS[entry.mood]) {
      const img = document.createElement("img");
      img.src = MOOD_EMOJIS[entry.mood];
      img.alt = entry.mood;
      img.className = "calendar-mood-icon";
      dayBox.appendChild(img);
    }
    grid.appendChild(dayBox);
  }

  DOM.calendar.appendChild(grid);
}

/**
 * Calculates and updates the average mood and days tracked stats.
 */
function updateStats() {
  if (entries.length === 0) {
    DOM.averageMood.textContent = "--";
    DOM.daysTracking.textContent = "0";
    DOM.currentStreak.textContent = "0";
    return;
  }

  // Calculate average mood
  const totalMoodValue = entries.reduce(
    (sum, entry) => sum + (MOOD_VALUES[entry.mood] || 0),
    0
  );
  const averageMood = totalMoodValue / entries.length;
  DOM.averageMood.textContent = averageMood.toFixed(1);

  // Calculate days tracked
  DOM.daysTracking.textContent = entries.length;

  // Calculate streak (simplified for now)
  const sortedDates = entries.map(e => e.date).sort();
  let currentStreak = 0;
  if (sortedDates.length > 0) {
    let streakCount = 1;
    for (let i = sortedDates.length - 2; i >= 0; i--) {
      const dayBefore = new Date(sortedDates[i]);
      const currentDay = new Date(sortedDates[i + 1]);
      const timeDifference = currentDay.getTime() - dayBefore.getTime();
      const dayDifference = timeDifference / (1000 * 3600 * 24);

      if (Math.abs(dayDifference) === 1) {
        streakCount++;
      } else {
        break;
      }
    }
    currentStreak = streakCount;
  }
  DOM.currentStreak.textContent = currentStreak;
}

/**
 * Updates all relevant UI components: calendar and stats.
 */
function updateUI() {
  renderCalendar();
  updateStats();
}

/**
 * Initializes the application by setting up event listeners and initial UI state.
 */
function initApp() {
  // Attach event listeners
  DOM.moodOptions.addEventListener("click", handleMoodSelection);
  DOM.saveEntryBtn.addEventListener("click", handleEntrySave);
  DOM.calendar.addEventListener("click", handleCalendarClick);
  DOM.prevMonthBtn.addEventListener("click", () => handleMonthChange(-1));
  DOM.nextMonthBtn.addEventListener("click", () => handleMonthChange(1));
  DOM.modalCloseBtn.addEventListener("click", () => DOM.messageModal.classList.add("hidden"));

  // Correctly placed and working menu button listener
  if (DOM.menuBtn && DOM.sidebar) {
    DOM.menuBtn.addEventListener("click", () => {
      DOM.sidebar.classList.toggle("-translate-x-full");
    });
  }

  // Set today's date on the input field
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  DOM.entryDateInput.value = todayStr;

  // Initial render
  updateUI();
}

// Start the app!
initApp();