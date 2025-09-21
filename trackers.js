console.log("Hello from trackers.js!");

// DOM elements
const calendarsWrapper = document.getElementById("calendars-wrapper");
const addCalendarBtn = document.getElementById("add-calendar-btn");
const saveHabitBtn = document.getElementById("save-habit-btn");
const cancelHabitBtn = document.getElementById("cancel-habit-btn");
const habitNameInput = document.getElementById("habit-name");
const dialog = document.getElementById("dialog");
const menuBtn = document.getElementById("menu-btn");
const sidebar = document.querySelector(".sidebar");



// Show modal
addCalendarBtn.addEventListener("click", () => dialog.showModal());
cancelHabitBtn.addEventListener("click", () => dialog.close());

// Habit list in localStorage
let habitList = JSON.parse(localStorage.getItem("habitList")) || [
  "No Alcohol",
  "Vitamins",
  "Yoga",
];

// Function to create a calendar element
function createCalendarElement(habitName) {
  const calendarId = habitName.toLowerCase().replace(/\s+/g, "-");
  const container = document.createElement("div");
  container.classList.add(
    "calendar-container",
    "shadow-md",
    "p-4",
    "bg-white",
    "rounded-lg"
  );
  container.id = `calendar-${calendarId}`;
  container.innerHTML = `
    <h2 class="text-center text-primary text-xl font-semibold mb-2">${habitName}</h2>
    <div class="calendar-header flex justify-between items-center mb-2">
      <h2 class="currentMonthYear text-lg font-medium"></h2>
      <div>
        <button class="prevMonth px-2 py-1 rounded hover:bg-gray-300">⬅️</button>
        <button class="nextMonth px-2 py-1 rounded hover:bg-gray-300">➡️</button>
      </div>
    </div>
    <div class="calendar-weekdays grid grid-cols-7 text-center font-semibold mb-1">
      <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
    </div>
    <div class="calendar-grid grid grid-cols-7 gap-1"></div>
  `;
  calendarsWrapper.appendChild(container);
  initializeCalendar(container);
}

// Function to initialize a calendar
function initializeCalendar(container) {
  const storageKey = `habit_${container.id}`;
  const prevMonthBtn = container.querySelector(".prevMonth");
  const nextMonthBtn = container.querySelector(".nextMonth");
  const calendarGrid = container.querySelector(".calendar-grid");
  const currentMonthYear = container.querySelector(".currentMonthYear");

  let currentDate = new Date();
  let savedDays = JSON.parse(localStorage.getItem(storageKey)) || [];

  function renderCalendar() {
    calendarGrid.innerHTML = "";
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    currentMonthYear.textContent = new Date(year, month).toLocaleString(
      "default",
      { month: "long", year: "numeric" }
    );

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const lastDayPrevMonth = new Date(year, month, 0).getDate();

    // Previous month padding
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const dayDiv = document.createElement("div");
      dayDiv.textContent = lastDayPrevMonth - i;
      dayDiv.classList.add("other-month", "text-gray-400");
      calendarGrid.appendChild(dayDiv);
    }

    // Current month
    for (let i = 1; i <= lastDayOfMonth; i++) {
      const dayDiv = document.createElement("div");
      dayDiv.textContent = i;
      dayDiv.classList.add(
        "current-month",
        "p-1",
        "text-center",
        "cursor-pointer"
      );

      const dateKey = `${year}-${month + 1}-${i}`;
      if (savedDays.includes(dateKey)) dayDiv.classList.add("active");

      dayDiv.addEventListener("click", () => {
        dayDiv.classList.toggle("active");
        if (dayDiv.classList.contains("active")) savedDays.push(dateKey);
        else savedDays = savedDays.filter((day) => day !== dateKey);
        localStorage.setItem(storageKey, JSON.stringify(savedDays));
      });

      calendarGrid.appendChild(dayDiv);
    }

    // Next month padding
    const totalCells = calendarGrid.children.length;
    const remainingCells = 42 - totalCells;
    for (let i = 1; i <= remainingCells; i++) {
      const dayDiv = document.createElement("div");
      dayDiv.textContent = i;
      dayDiv.classList.add("other-month", "text-gray-400");
      calendarGrid.appendChild(dayDiv);
    }
  }

  prevMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  nextMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  renderCalendar();
}

// Render all calendars on page load
habitList.forEach(createCalendarElement);

// Save new habit calendar
saveHabitBtn.addEventListener("click", () => {
  const habitName = habitNameInput.value.trim();
  if (!habitName) return alert("Please enter a habit name");

  habitList.push(habitName);
  localStorage.setItem("habitList", JSON.stringify(habitList));

  createCalendarElement(habitName);
  habitNameInput.value = "";
  dialog.close();
});
// // Correctly placed and working menu button listener
if (menuBtn && sidebar) {
  menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("-translate-x-full");
  });
}