const TIME_TRACKER_API = "/api/timetracker";

// Initial Time Tracker Data Structure
let timeTrackerData = {
  currentEntries: [],
  archivedMonths: [],
  lastMonthChecked: new Date().getMonth().toString(),
};

// --- State Management
let entries = [];
let archive = [];
let currentMonth = new Date().getMonth();

const FIXED_PAY_RATE = 18;

// DOM Elements
let elements;

// --- Utility Functions ---

const getLocalISODate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const createSummaryFromEntries = (entriesArr) => {
  const totalEntries = entriesArr.length;
  const totalMinutes = entriesArr.reduce(
    (sum, e) => sum + (typeof e.minutes === "number" ? e.minutes : 0),
    0
  );
  const totalPay = entriesArr.reduce(
    (sum, e) => sum + (parseFloat(e.total) || 0),
    0
  );
  const byType = entriesArr.reduce((acc, e) => {
    const type = e.workType || "Other";
    if (!acc[type]) acc[type] = { minutes: 0, total: 0 };
    if (typeof e.minutes === "number") acc[type].minutes += e.minutes;
    acc[type].total += parseFloat(e.total) || 0;
    return acc;
  }, {});
  return {
    totalEntries,
    totalMinutes,
    totalPay: totalPay.toFixed(2),
    byType,
  };
};

// --- Form Reset ---

// --- Render Functions ---

const renderSummary = () => {
  const summary = createSummaryFromEntries(entries);
  elements.totalMinutes.textContent = `Total Time: ${
    summary.totalMinutes
  } minutes (${(summary.totalMinutes / 60).toFixed(2)} hours)`;
  elements.totalPay.textContent = `Total Earned: $${summary.totalPay}`;

  let byTypeHtml =
    '<h3 class="font-medium mt-2">By Work Type:</h3><ul class="list-disc pl-6">';
  Object.entries(summary.byType).forEach(([type, stats]) => {
    byTypeHtml += `<li>${type}: ${stats.minutes} mins ($${stats.total.toFixed(
      2
    )})</li>`;
  });
  byTypeHtml += "</ul>";
  elements.summaryByType.innerHTML = byTypeHtml;
};

const renderEntries = () => {
  if (entries.length === 0) {
    elements.entriesList.innerHTML =
      '<p class="text-gray-400">No entries yet.</p>';
    return;
  }

  elements.entriesList.innerHTML = entries
    .map((entry) => {
      const timeDisplay = entry.isFlatRate
        ? `Flat Rate: $${entry.flatRate.toFixed(2)}`
        : `Time: ${entry.minutes} mins, Pay Rate: $${entry.payRate}/hr`;

      return `
            <li class="card bg-gray-700/50 shadow p-4 rounded-lg">
                <div class="flex justify-between items-center">
                    <p class="font-bold">${entry.date}</p>
                    <p class="text-sm italic">${entry.workType}</p>
                </div>
                <p>${timeDisplay}</p>
                <p class="text-lg font-semibold text-green-300">Pay: $${entry.total}</p>
                <div class="mt-2 text-right">
                    <button data-id="${entry.id}" class="edit-btn bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-full text-sm mr-2">Edit</button>
                    <button data-id="${entry.id}" class="delete-btn bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-full text-sm">Delete</button>
                </div>
            </li>
        `;
    })
    .join("");

  // Re-attach listeners for dynamically created buttons
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", (e) =>
      deleteEntry(parseInt(e.target.dataset.id))
    );
  });
};

const renderArchive = () => {
  if (archive.length === 0) {
    elements.archiveContainer.innerHTML =
      '<p class="text-gray-400">No archived months yet.</p>';
    return;
  }

  elements.archiveContainer.innerHTML = archive
    .map((monthData) => {
      const summary = monthData.summary;
      const monthName = new Date(
        monthData.year,
        monthData.month
      ).toLocaleString("en-us", { month: "long" });

      let byTypeHtml =
        '<div class="mt-2 text-sm"><p class="font-medium">By Work Type:</p><ul class="list-disc pl-4">';
      Object.entries(summary.byType).forEach(([type, stats]) => {
        byTypeHtml += `<li>${type}: ${
          stats.minutes
        } mins ($${stats.total.toFixed(2)})</li>`;
      });
      byTypeHtml += "</ul></div>";

      return `
            <div class="bg-gray-700/50 p-4 rounded-lg shadow">
                <h3 class="font-bold text-xl">${monthName} ${monthData.year}</h3>
                <p>Total Time: ${summary.totalMinutes} mins</p>
                <p class="text-green-300 font-bold">Total Earned: $${summary.totalPay}</p>
                ${byTypeHtml}
            </div>
        `;
    })
    .join("");
};

const updateUI = async () => {
  renderSummary();
  renderEntries();
  renderArchive();

  timeTrackerData.currentEntries = entries;
  timeTrackerData.archivedMonths = archive;
  timeTrackerData.lastMonthChecked = currentMonth.toString();
  timeTrackerData.archiveYear =
    timeTrackerData.archiveYear || new Date().getFullYear();

  try {
    const response = await fetch(TIME_TRACKER_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(timeTrackerData),
    });

    if (!response.ok) {
      throw new Error(`Save failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error saving time tracker data:", error);
  }
};

// --- Core Logic Functions ---

const checkAndArchiveMonth = () => {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  if (currentMonth !== thisMonth || timeTrackerData.archiveYear !== thisYear) {
    if (entries.length > 0) {
      const summary = createSummaryFromEntries(entries);

      const newArchiveEntry = {
        month: currentMonth,
        year: timeTrackerData.archiveYear,
        summary,
      };

      archive = [...archive, newArchiveEntry];
      entries = [];

      currentMonth = thisMonth;
      timeTrackerData.archiveYear = thisYear;
    }

    currentMonth = thisMonth;
    timeTrackerData.archiveYear = thisYear;
  }
};

const loadData = async () => {
  try {
    const response = await fetch(TIME_TRACKER_API);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const fileData = await response.json();
    timeTrackerData = fileData;

    entries = timeTrackerData.currentEntries || [];
    archive = timeTrackerData.archivedMonths || [];

    const storedMonth = timeTrackerData.lastMonthChecked;
    currentMonth =
      storedMonth !== null ? parseInt(storedMonth, 10) : new Date().getMonth();
    timeTrackerData.archiveYear =
      fileData.archiveYear || new Date().getFullYear();
  } catch (e) {
    console.error(
      "Failed to load time tracker data via API. Using defaults.",
      e
    );
    timeTrackerData = {
      currentEntries: [],
      archivedMonths: [],
      lastMonthChecked: new Date().getMonth().toString(),
      archiveYear: new Date().getFullYear(),
    };
    entries = timeTrackerData.currentEntries;
    archive = timeTrackerData.archivedMonths;
    currentMonth = parseInt(timeTrackerData.lastMonthChecked, 10);

    await updateUI();
  }

  checkAndArchiveMonth();

  renderSummary();
  renderEntries();
  renderArchive();
};

const addEntry = async () => {
  checkAndArchiveMonth();

  const date = elements.entryDate.value || getLocalISODate();
  const workType = elements.workType.value;
  const minutes = elements.minutesWorked.value;
  const serviceName = elements.flatServiceName.value;
  const flatRate = elements.flatRate.value;

  let newEntry;

  if (serviceName && flatRate) {
    newEntry = {
      id: Date.now(),
      date: date,
      workType: serviceName,
      isFlatRate: true,
      flatRate: parseFloat(flatRate),
      total: parseFloat(flatRate).toFixed(2),
    };
  } else if (workType && minutes) {
    const time = parseFloat(minutes);
    if (isNaN(time)) {
      alert("Please enter a valid number for minutes.");
      return;
    }
    const total = ((time / 60) * FIXED_PAY_RATE).toFixed(2);

    newEntry = {
      id: Date.now(),
      date: date,
      workType: workType,
      minutes: time,
      payRate: FIXED_PAY_RATE,
      total: total,
    };
  } else {
    alert(
      "Please complete the necessary fields for a time or flat-rate entry."
    );
    return;
  }

  entries = [newEntry, ...entries];
  await updateUI();

  elements.entryDate.value = getLocalISODate(); // Resets date to today
  elements.workType.value = "";
  elements.minutesWorked.value = "";
  elements.flatServiceName.value = "";
  elements.flatRate.value = "";
};

const deleteEntry = async (id) => {
  entries = entries.filter((entry) => entry.id !== id);
  await updateUI();
};

// --- Input Toggling Logic ---

// --- Initialization ---

document.addEventListener("DOMContentLoaded", () => {
  elements = {
    entryDate: document.getElementById("entryDate"),
    workType: document.getElementById("workType"),
    minutesWorked: document.getElementById("minutesWorked"),
    flatServiceName: document.getElementById("flatServiceName"),
    flatRate: document.getElementById("flatRate"),
    addEntryBtn: document.getElementById("addEntryBtn"),
    totalMinutes: document.getElementById("totalMinutes"),
    totalPay: document.getElementById("totalPay"),
    summaryByType: document.getElementById("summaryByType"),
    entriesList: document.getElementById("entriesList"),
    archiveContainer: document.getElementById("archiveContainer"),
  };

  (async () => {
    await loadData();

    elements.addEntryBtn.addEventListener("click", addEntry);

    window.focus();
  })();
});
