console.log("Hello from dashboard.js!");

document.addEventListener("DOMContentLoaded", () => {
  renderDashboard();
});

function renderTasksSnapshot() {
  const tasksList = document.getElementById("tasks-list");
  const careList = document.getElementById("care-list");

  tasksList.innerHTML = "";
  careList.innerHTML = "";

  const checklists = JSON.parse(
    localStorage.getItem("checklists") || '{"tasks":[],"care":[]}'
  );

  // Render tasks
  if (checklists.tasks.length === 0) {
    tasksList.innerHTML = '<li class="text-gray-400">No tasks yet.</li>';
  } else {
    checklists.tasks.slice(-3).forEach((task) => {
      const li = document.createElement("li");
      li.className = "flex items-center gap-2";
      li.innerHTML = `
        <input type="checkbox" disabled ${task.completed ? "checked" : ""} />
        <span class="${task.completed ? "line-through text-gray-400" : ""}">
          ${task.text}
        </span>
      `;
      tasksList.appendChild(li);
    });
  }

  // Render self care
  if (checklists.care.length === 0) {
    careList.innerHTML =
      '<li class="text-gray-400">No self care items yet.</li>';
  } else {
    checklists.care.slice(-3).forEach((item) => {
      const li = document.createElement("li");
      li.className = "flex items-center gap-2";
      li.innerHTML = `
        <input type="checkbox" disabled ${item.completed ? "checked" : ""} />
        <span class="${item.completed ? "line-through text-gray-400" : ""}">
          ${item.text}
        </span>
      `;
      careList.appendChild(li);
    });
  }
}

// Main function to load and display all data
function renderDashboard() {
  // renderTasksSnapshot();
  renderJournalSnapshot();
  renderHabitSnapshot();
  renderNotesSnapshot();
}
console.log("Entries:", localStorage.getItem("entries"));
// Render the journal entries
function renderJournalSnapshot() {
  const journalList = document.getElementById("journal-list");
  journalList.innerHTML = ""; // Clear previous content

  // The key 'entries' must match how you saved the data
  const entries = JSON.parse(localStorage.getItem("entries") || "[]");

  if (entries.length === 0) {
    journalList.innerHTML =
      '<li class="text-gray-400">No journal entries yet.</li>';
    return;
  }

  // Display only the latest entries
  const latestEntries = entries.slice(-3).reverse();
  latestEntries.forEach((entry) => {
    const li = document.createElement("li");
    li.className = "border-b border-gray-200 pb-2 last:border-b-0 last:pb-0";
    const date = entry.date || "No date";
    const content = entry.journalText || "No content";

    li.textContent = `${date}: ${content.substring(0, 50)}...`;
    journalList.appendChild(li);
    // li.textContent = `${entry.date}: ${entry.content.substring(0, 50)}...`;
    // journalList.appendChild(li);
  });
}
console.log("Habits:", localStorage.getItem("habitList"));
// Render the habit tracker
function renderHabitSnapshot() {
  const habitsList = document.getElementById("habits-list");
  habitsList.innerHTML = "";

  // The key 'habits' must match how you saved the data
  const habits = JSON.parse(localStorage.getItem("habitList") || "[]");

  if (habits.length === 0) {
    habitsList.innerHTML =
      '<li class="text-gray-400">No habits added yet.</li>';
    return;
  }

  habits.forEach((habit) => {
    const li = document.createElement("li");
    li.className = "border-b border-gray-200 pb-2 last:border-b-0 last:pb-0";
    
    li.innerHTML = `<span class="font-medium">✅ ${habit}</span>`;
    habitsList.appendChild(li);
  });
}
console.log("All Lists:", localStorage.getItem("allLists"));
// Render the notes/lists
function renderNotesSnapshot() {
  const notesList = document.getElementById("notes-list");
  notesList.innerHTML = "";

  // The key 'allLists' must match how you saved the data
  const notes = JSON.parse(localStorage.getItem("allLists") || "[]");

  if (notes.length === 0) {
    notesList.innerHTML =
      '<li class="text-gray-400">No notes or lists yet.</li>';
    return;
  }

  // Display a maximum of 3 notes
  const latestNotes = notes.slice(-3).reverse();
  latestNotes.forEach((note) => {
    const li = document.createElement("li");
    li.className = "border-b border-gray-200 pb-2 last:border-b-0 last:pb-0";
    const title = note.name || "Untitled";
    const itemsPreview = note.items && note.items.length > 0
      ? note.items.slice(0, 3).join(", ") // show up to 3 items
      : "No items";
    
    li.textContent = `${title}: ${itemsPreview}`;
    notesList.appendChild(li);
  });
}

// Function to handle quick-add buttons (e.g., redirect to relevant page)
function addNewEntry(type) {
  alert(`Redirecting to the "${type}" entry page.`);
  window.location.href = `/${type}.html`;
}
