console.log("Hello from dashboard.js!");

document.addEventListener("DOMContentLoaded", () => {
  renderDashboard();
});

// Main function to load and display all data
function renderDashboard() {
  renderJournalSnapshot();
  renderHabitSnapshot();
  renderNotesSnapshot();
}

// Render the journal entries
function renderJournalSnapshot() {
  const journalList = document.getElementById("journal-list");
  journalList.innerHTML = ""; // Clear previous content

  // The key 'entries' must match how you saved the data
  const entries = JSON.parse(localStorage.getItem("entries") || "[]");

  if (entries.length === 0) {
    journalList.innerHTML = '<li class="text-gray-400">No journal entries yet.</li>';
    return;
  }

  // Display only the latest entries
  const latestEntries = entries.slice(-3).reverse();
  latestEntries.forEach((entry) => {
    const li = document.createElement("li");
    li.className = "border-b border-gray-200 pb-2 last:border-b-0 last:pb-0";
    li.textContent = `${entry.date}: ${entry.content.substring(0, 50)}...`;
    journalList.appendChild(li);
  });
}

// Render the habit tracker
function renderHabitSnapshot() {
  const habitsList = document.getElementById("habits-list");
  habitsList.innerHTML = "";

  // The key 'habits' must match how you saved the data
  const habits = JSON.parse(localStorage.getItem("habits") || "[]");

  if (habits.length === 0) {
    habitsList.innerHTML = '<li class="text-gray-400">No habits added yet.</li>';
    return;
  }

  habits.forEach((habit) => {
    const li = document.createElement("li");
    li.className = "border-b border-gray-200 pb-2 last:border-b-0 last:pb-0";
    const status = habit.completed ? "✅" : "❌";
    li.innerHTML = `<span class="font-medium">${status}</span> ${habit.name}`;
    habitsList.appendChild(li);
  });
}

// Render the notes/lists
function renderNotesSnapshot() {
  const notesList = document.getElementById("notes-list");
  notesList.innerHTML = "";

  // The key 'allLists' must match how you saved the data
  const notes = JSON.parse(localStorage.getItem("allLists") || "[]");

  if (notes.length === 0) {
    notesList.innerHTML = '<li class="text-gray-400">No notes or lists yet.</li>';
    return;
  }

  // Display a maximum of 3 notes
  const latestNotes = notes.slice(-3).reverse();
  latestNotes.forEach((note) => {
    const li = document.createElement("li");
    li.className = "border-b border-gray-200 pb-2 last:border-b-0 last:pb-0";
    li.textContent = `${note.title}`;
    notesList.appendChild(li);
  });
}

// Function to handle quick-add buttons (e.g., redirect to relevant page)
function addNewEntry(type) {
  alert(`Redirecting to the "${type}" entry page.`);
  window.location.href = `/${type}.html`;
}