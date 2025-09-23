// --- State & DOM Element References ---
const DOM = {
  listsContainer: document.getElementById("listsContainer"),
  addListBtn: document.getElementById("addListBtn"),
  addListModal: document.getElementById("addListModal"),
  addListContent: document.getElementById("addListContent"),
  cancelBtn: document.getElementById("cancelBtn"),
  newListForm: document.getElementById("newListForm"),
  menuBtn: document.getElementById("menu-btn"),
  sidebar: document.querySelector(".sidebar"),
};

// --- Helper Functions ---

/**
 * Creates a single list item for a checklist.
 * @param {HTMLElement} listElement - The parent <ul> element.
 * @param {string} itemText - The text content of the list item.
 * @param {boolean} isCompleted - Whether the item is completed (for loading).
 */
function createChecklistItem(listElement, itemText, isCompleted = false) {
  const li = document.createElement("li");
  li.className =
    "p-3 bg-white/20 rounded-lg shadow-md hover:bg-white/30 transition cursor-pointer flex items-center gap-2";
  li.dataset.completed = isCompleted;

  const checkMark = document.createElement("span");
  checkMark.className = `w-5 h-5 rounded-full flex-shrink-0 border-2 transition-colors duration-300 ${
    isCompleted ? "bg-green-500 border-green-500" : "border-white"
  }`;
  li.appendChild(checkMark);

  const span = document.createElement("span");
  span.className = `flex-1 pr-3 ${
    isCompleted ? "line-through text-gray-400" : "text-white"
  }`;
  span.textContent = itemText;
  li.appendChild(span);

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "flex space-x-2 ml-auto gap-2";

  const editBtn = document.createElement("button");
  editBtn.className =
    "editBtn w-7 h-7 flex items-center justify-center rounded-full text-white bg-gradient-to-r from-blue-500 to-pink-500 hover:opacity-80";
  editBtn.innerHTML = "✏️";
  buttonContainer.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.className =
    "deleteBtn w-7 h-7 flex items-center justify-center rounded-full text-white bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-80";
  deleteBtn.innerHTML = "❌";
  buttonContainer.appendChild(deleteBtn);

  li.appendChild(buttonContainer);

  // Attach click handler to the entire li
  li.addEventListener("click", (e) => {
    // Avoid toggling when clicking a button
    if (e.target.closest("button")) return;

    const isNowCompleted = li.dataset.completed === "false";
    li.dataset.completed = isNowCompleted;
    span.classList.toggle("line-through", isNowCompleted);
    span.classList.toggle("text-gray-400", isNowCompleted);
    checkMark.classList.toggle("bg-green-500", isNowCompleted);
    checkMark.classList.toggle("border-green-500", isNowCompleted);
    checkMark.classList.toggle("border-white", !isNowCompleted);

    if (isNowCompleted) {
      listElement.appendChild(li); // Move to bottom
    } else {
      const firstCompleted = listElement.querySelector(
        '[data-completed="true"]'
      );
      if (firstCompleted) {
        listElement.insertBefore(li, firstCompleted);
      } else {
        listElement.prepend(li); // Move to top if no others are completed
      }
    }
    saveLists();
  });

  // Attach delete handler
  deleteBtn.addEventListener("click", () => {
    li.remove();
    saveLists();
  });

  // Attach edit handler
  editBtn.addEventListener("click", () => {
    const newText = prompt("Edit item:", span.textContent);
    if (newText !== null && newText.trim() !== "") {
      span.textContent = newText.trim();
      saveLists();
    }
  });

  listElement.appendChild(li);
}

// *** UPDATED createNote FUNCTION ***
function createNote(listElement, noteText = "") {
  listElement.innerHTML = `
    <div class="p-3 bg-white/20 rounded-lg shadow-md hover:bg-white/30 transition min-h-[150px] flex flex-col items-center justify-center relative">
        <p class="text-white text-base leading-relaxed whitespace-pre-wrap overflow-y-auto w-full h-full flex-1" style="word-break: break-word;">${noteText}</p>
        <button class="editNoteBtn absolute bottom-2 right-2 bg-yellow-400 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded-full text-sm">✏️</button>
    </div>
  `;

  const p = listElement.querySelector("p");
  const editNoteBtn = listElement.querySelector(".editNoteBtn");

  editNoteBtn.addEventListener("click", () => {
    const newText = prompt("Edit note:", p.textContent);
    if (newText !== null) {
      p.textContent = newText;
      saveLists();
    }
  });
}


// --- API Functions ---
async function saveLists() {
    const allLists = [];
    DOM.listsContainer.querySelectorAll('[data-custom="true"]').forEach((col) => {
        const name = col.querySelector("h2").textContent.trim();
        const type = col.dataset.type || "checklist";
        let items = [];

        if (type === "checklist") {
            items = Array.from(col.querySelectorAll("ul li"))
                .map((li) => {
                    const textElement = li.querySelector("span:not(.w-5)");
                    const text = textElement ? textElement.textContent.trim() : "";
                    return {
                        text,
                        completed: li.dataset.completed === "true",
                    };
                })
                .filter((item) => item.text !== "");
        } else if (type === "notes") {
            items = [col.querySelector("p")?.textContent || ""];
        }

        allLists.push({ name, type, items });
    });

    try {
        // --- CHANGE 1: REPLACE localStorage.setItem with fetch() POST ---
        await fetch("/api/lists", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(allLists),
        });
    } catch (e) {
        console.error("Error saving lists to server:", e);
    }
}

async function loadLists() {
    let allLists = [];
    try {
        // --- CHANGE 2: REPLACE localStorage.getItem with fetch() GET ---
        const response = await fetch("/api/lists");
        if (!response.ok) {
            throw new Error("Failed to load lists");
        }
        allLists = await response.json();
    } catch (e) {
        console.error("Error loading lists from server:", e);
        allLists = [];
    }

    DOM.listsContainer.innerHTML = "";
    allLists.forEach((list) => {
        renderNewList(list.name, list.type, list.items, false);
    });
}

function renderNewList(
  listName,
  listType = "checklist",
  items = [],
  shouldSave = true
) {
  const col = document.createElement("div");
  col.className = "w-full sm:w-[calc(50%-1.5rem)] md:w-[calc(33.333%-1.5rem)]";
  col.dataset.custom = "true";
  col.dataset.type = listType;

  col.innerHTML = `
    <div class="rounded-2xl bg-white/10 backdrop-blur-lg p-4 shadow-xl hover:shadow-2xl transition">
      <div class="flex justify-between items-center text-white text-center font-bold mb-4">
        <h2 class="text-2xl font-semibold text-blue-200">${listName}</h2>
        <button class="bg-yellow-400 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm editListName">✏️</button>
        <button class="bg-green-400 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-sm addItem" style="${
          listType === "notes" ? "display:none" : ""
        } ">➕</button>
        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm deleteList">❌</button>
      </div>
      <ul class="list-none space-y-2 min-h-[200px]"></ul>
    </div>
  `;

  const ul = col.querySelector("ul");

  if (listType === "checklist") {
    const convertedItems = items.map((item) => {
      if (typeof item === "string") {
        return {
          text: item,
          completed: false,
        };
      }
      return item;
    });

    convertedItems
      .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1))
      .forEach((item) => {
        if (item.text.trim() !== "") {
          createChecklistItem(ul, item.text, item.completed);
        }
      });

    col.querySelector(".addItem").addEventListener("click", () => {
      const newItem = prompt("Add new item:");
      if (newItem && newItem.trim() !== "") {
        createChecklistItem(ul, newItem.trim());
        saveLists();
      }
    });
  } else if (listType === "notes") {
    createNote(ul, items[0] || "");
  }

  // Attach delete list handler
  col.querySelector(".deleteList").addEventListener("click", () => {
    col.remove();
    saveLists();
  });

  // Edit list name handler
  col.querySelector(".editListName").addEventListener("click", () => {
    const header = col.querySelector("h2");
    const newName = prompt("Rename list:", header.textContent);
    if (newName && newName.trim() !== "") {
      header.textContent = newName.trim();
      saveLists();
    }
  });

  DOM.listsContainer.appendChild(col);
  if (shouldSave) saveLists();
}

// --- Event Listeners ---
function attachEventListeners() {
  // Mobile sidebar menu
  if (DOM.menuBtn && DOM.sidebar) {
    DOM.menuBtn.addEventListener("click", () => {
      DOM.sidebar.classList.toggle("-translate-x-full");
    });
  }

  // Open Modal
  DOM.addListBtn.addEventListener("click", () => {
    DOM.addListModal.classList.remove("hidden", "opacity-0");
    DOM.addListModal.classList.add("flex", "opacity-100");
    DOM.addListContent.classList.remove("scale-95", "opacity-0");
    DOM.addListContent.classList.add("scale-100", "opacity-100");
  });

  // Close modal
  DOM.cancelBtn.addEventListener("click", closeModal);
  DOM.addListModal.addEventListener("click", (e) => {
    if (e.target === DOM.addListModal) closeModal();
  });

  // Create new list
  DOM.newListForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const listName = document.getElementById("listName").value.trim();
    const listType = document.getElementById("listType").value;
    const firstItem = document.getElementById("firstItem").value.trim();

    // For a new note, we just want the text, not a structured object.
    const items = firstItem
      ? listType === "checklist"
        ? [{ text: firstItem, completed: false }]
        : [firstItem]
      : [];

    if (listName) {
      renderNewList(listName, listType, items, true);
      DOM.newListForm.reset();
      closeModal();
    }
  });
}

function closeModal() {
  DOM.addListModal.classList.remove("flex", "opacity-100");
  DOM.addListModal.classList.add("hidden", "opacity-0");
  DOM.addListContent.classList.remove("scale-100", "opacity-100");
  DOM.addListContent.classList.add("scale-95", "opacity-0");
  DOM.newListForm.reset();
}

// --- Initialization ---
function init() {
  attachEventListeners();
  loadLists();
}

window.onload = init;
