// Mood images (reuse from your journal.js)
const MOOD_EMOJIS = {
  happy: "assets/happy.png",
  excited: "assets/excited.png",
  calm: "assets/calm.png",
  anxious: "assets/anxious.png",
  sad: "assets/sad.png",
  angry: "assets/angry.png",
};

const container = document.getElementById("entries-container");

// Load entries
const entries = JSON.parse(localStorage.getItem("entries")) || [];

function renderEntries() {
  container.innerHTML = "";

  if (entries.length === 0) {
    container.innerHTML = `<p class="text-center text-lg text-gray-200">No journal entries yet. ✨</p>`;
    return;
  }

  entries.forEach((entry, index) => {
    const card = document.createElement("div");
    card.className =
      "bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-purple-200 hover:scale-[1.02] transition-transform";

    card.innerHTML = `
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-purple-700">${entry.date}</h2>
        <img src="${MOOD_EMOJIS[entry.mood]}" alt="${entry.mood}" class="w-12 h-12"/>
      </div>
      <p class="text-gray-800 bg-white/60 p-4 rounded-lg shadow-inner">${entry.journalText}</p>
      <div class="flex justify-end gap-3 mt-4">
        <button class="edit-btn text-blue-500 hover:text-blue-700">✏️ Edit</button>
        <button class="delete-btn text-red-500 hover:text-red-700">🗑️ Delete</button>
      </div>
    `;
    // Attach button logic
    card.querySelector(".edit-btn").addEventListener("click", () => editEntry(index));
    card.querySelector(".delete-btn").addEventListener("click", () => deleteEntry(index));



    container.appendChild(card);
  });
}

function editEntry(index) {
    const entry = entries[index];

    //Prompt for new values (keep old if user cancels/empties)
    const newDate = prompt("Edit date: ", entry.date) || entry.date;
    const newMood = prompt("Edit Mood (happy, excited, calm, anxious, sad, angry):",
    entry.mood) || entry.mood;
    const newText = prompt("Edit your entry: ", entry.journalText) || entry.journalText;
    const moodKey = newMood.toLowerCase();
    if (!MOOD_EMOJIS[moodKey]) {
        alert("Invalid mood. Keeping the previous one.")
    }

    entries[index] = {
        date: newDate,
        mood: MOOD_EMOJIS[moodKey] ? moodKey : entry.mood,
        journalText: newText,
    };

    
    saveEntries();
}

function deleteEntry(index) {
    if(confirm("Are you sure you want to delete this entry?")) {
        entries.splice(index, 1);
        saveEntries();
    }
}

function saveEntries() {
    localStorage.setItem("entries", JSON.stringify(entries));
    renderEntries();
}

renderEntries();

// Sidebar toggle for mobile
const menuBtn = document.getElementById("menu-btn");
const sidebar = document.querySelector(".sidebar");
if (menuBtn && sidebar) {
  menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("-translate-x-full");
  });
}
