// --- State & DOM Element References ---
const DOM = {
  taskInput: document.getElementById("taskInput"),
  addTaskBtn: document.getElementById("addTaskBtn"),
  shoppingInput: document.getElementById("shoppingInput"),
  addShoppingBtn: document.getElementById("addShoppingBtn"),
  listsContainer: document.getElementById("listsContainer"),
  addListBtn: document.getElementById("addListBtn"),
  addListModal: document.getElementById("addListModal"),
  addListContent: document.getElementById("addListContent"),
  cancelBtn: document.getElementById("cancelBtn"),
  newListForm: document.getElementById("newListForm"),
  menuBtn: document.getElementById("menu-btn"),
  sidebar: document.querySelector(".sidebar"),
};

// --- Helper Functions for Lists ---

/**
 * Creates and appends a new list item to a specified list.
 * @param {HTMLUListElement} listElement - The <ul> element to append the item to.
 * @param {string} itemText - The text content of the list item.
 */
function createListItem(listElement, itemText) {
  const li = document.createElement("li");
  li.className = "p-3 bg-white/20 rounded-lg shadow-md hover:bg-white/30 transition cursor-pointer flex items-center";

  li.innerHTML = `
    <span class="text-white flex-1 pr-3">${itemText}</span>
    <div class="flex space-x-2 ml-auto gap-2">
      <button class="deleteBtn w-7 h-7 flex items-center justify-center rounded-full text-white bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-80">✗</button>
    </div>
  `;

  // Attach delete handler
  li.querySelector(".deleteBtn").addEventListener("click", () => {
    li.remove();
    saveLists();
  });

  listElement.appendChild(li);
}

/**
 * Saves all lists, including static and custom, to localStorage.
 */
function saveLists() {
  const allLists = [];

  // Save "To Do" list
  const todoItems = Array.from(document.querySelectorAll("#todoList li span")).map(span => span.textContent);
  allLists.push({ name: "To Do", type: "checklist", items: todoItems });

  // Save "Shopping" list
  const shoppingItems = Array.from(document.querySelectorAll("#shopping-list li span")).map(span => span.textContent);
  allLists.push({ name: "Shopping", type: "checklist", items: shoppingItems });

  // Save custom lists
  DOM.listsContainer.querySelectorAll('[data-custom="true"]').forEach(col => {
    const name = col.querySelector("h2").textContent.trim();
    const type = col.dataset.type || "checklist";
    const items = Array.from(col.querySelectorAll("ul li span")).map(span => span.textContent.trim());
    allLists.push({ name, type, items });
  });

  localStorage.setItem("allLists", JSON.stringify(allLists));
}

/**
 * Renders all lists from localStorage, with migration logic.
 */
function loadLists() {
  let allLists = JSON.parse(localStorage.getItem("allLists")) || [];

  // Migration logic for old lists
  if (allLists.length === 0) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const items = JSON.parse(localStorage.getItem("items")) || [];

    if (tasks.length > 0 || items.length > 0) {
      allLists = [
        { name: "To Do", type: "checklist", items: tasks.map(task => task.text) },
        { name: "Shopping", type: "checklist", items: items.map(item => item.text) }
      ];
      // Save the migrated data to the new key
      localStorage.setItem("allLists", JSON.stringify(allLists));
      // Optionally, clear the old keys to avoid future issues
      localStorage.removeItem("tasks");
      localStorage.removeItem("items");
    }
  }

  // Clear existing lists to prevent duplicates
  const todoList = document.getElementById("todoList");
  const shoppingList = document.getElementById("shopping-list");
  const listsContainer = document.getElementById("listsContainer");

  if (todoList) todoList.innerHTML = "";
  if (shoppingList) shoppingList.innerHTML = "";
  listsContainer.querySelectorAll('[data-custom="true"]').forEach(col => col.remove());

  allLists.forEach(list => {
    if (list.name === "To Do") {
      list.items.forEach(item => createListItem(document.getElementById("todoList"), item));
    } else if (list.name === "Shopping") {
      list.items.forEach(item => createListItem(document.getElementById("shopping-list"), item));
    } else {
      renderNewList(list.name, list.type, list.items, false);
    }
  });
}

/**
 * Renders a new custom list column.
 * @param {string} listName - The name of the new list.
 * @param {string} listType - The type of list (e.g., 'checklist').
 * @param {string[]} items - An array of initial items for the list.
 * @param {boolean} shouldSave - Whether to save to localStorage after rendering.
 */
function renderNewList(listName, listType = "checklist", items = [], shouldSave = true) {
  const col = document.createElement("div");
  col.className = "w-full sm:w-[calc(50%-1.5rem)] md:w-[calc(33.333%-1.5rem)]";
  col.dataset.custom = "true";
  col.dataset.type = listType;

  col.innerHTML = `
    <div class="rounded-2xl bg-white/10 backdrop-blur-lg p-4 shadow-xl hover:shadow-2xl transition">
      <div class="flex justify-between items-center text-white text-center font-bold mb-4">
        <h2 class="text-2xl font-semibold text-blue-200">${listName}</h2>
        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm clearBtn">Clear All</button>
      </div>
      <ul class="list-none space-y-2 min-h-[200px]"></ul>
    </div>
  `;

  const ul = col.querySelector("ul");
  items.forEach(itemText => createListItem(ul, itemText));

  // Clear All button
  col.querySelector(".clearBtn").addEventListener("click", () => {
    ul.innerHTML = "";
    saveLists();
  });

  DOM.listsContainer.appendChild(col);

  if (shouldSave) saveLists();
}

/**
 * Handles the logic for adding a new item to a list.
 * @param {HTMLInputElement} inputElement - The input field for the item.
 * @param {HTMLUListElement} listElement - The list to add the item to.
 */
function handleAddItem(inputElement, listElement) {
  const itemText = inputElement.value.trim();
  if (itemText) {
    createListItem(listElement, itemText);
    saveLists();
    inputElement.value = "";
  }
}

// --- Event Listeners ---
function attachEventListeners() {
  // Mobile sidebar menu
  if (DOM.menuBtn && DOM.sidebar) {
    DOM.menuBtn.addEventListener("click", () => {
      DOM.sidebar.classList.toggle("-translate-x-full");
      
    });
  }

  // "Add Task" button & input handler
  DOM.addTaskBtn.addEventListener("click", () => handleAddItem(DOM.taskInput, document.getElementById("todoList")));
  DOM.taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") DOM.addTaskBtn.click();
  });

  // "Add Shopping Item" button & input handler
  DOM.addShoppingBtn.addEventListener("click", () => handleAddItem(DOM.shoppingInput, document.getElementById("shopping-list")));
  DOM.shoppingInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") DOM.addShoppingBtn.click();
  });

  // Modal handlers
  DOM.addListBtn.addEventListener("click", () => {
    DOM.addListModal.classList.remove("hidden", "opacity-0");
    DOM.addListModal.classList.add("flex", "opacity-100");
    DOM.addListContent.classList.remove("scale-95", "opacity-0");
    DOM.addListContent.classList.add("scale-100", "opacity-100");
  });

  DOM.cancelBtn.addEventListener("click", () => {
    DOM.addListModal.classList.remove("flex", "opacity-100");
    DOM.addListModal.classList.add("hidden", "opacity-0");
    DOM.addListContent.classList.remove("scale-100", "opacity-100");
    DOM.addListContent.classList.add("scale-95", "opacity-0");
    DOM.newListForm.reset();
  });

  DOM.addListModal.addEventListener("click", (e) => {
    if (e.target === DOM.addListModal) {
      DOM.addListModal.classList.remove("flex", "opacity-100");
      DOM.addListModal.classList.add("hidden", "opacity-0");
      DOM.addListContent.classList.remove("scale-100", "opacity-100");
      DOM.addListContent.classList.add("scale-95", "opacity-0");
      DOM.newListForm.reset();
    }
  });

  DOM.newListForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const listName = document.getElementById("listName").value.trim();
    const listType = document.getElementById("listType").value;
    const firstItem = document.getElementById("firstItem").value.trim();
    const items = firstItem ? [firstItem] : [];
    if (listName) {
      renderNewList(listName, listType, items, true);
      DOM.newListForm.reset();
      DOM.addListModal.classList.remove("flex", "opacity-100");
      DOM.addListModal.classList.add("hidden", "opacity-0");
      DOM.addListContent.classList.remove("scale-100", "opacity-100");
      DOM.addListContent.classList.add("scale-95", "opacity-0");
    }
  });
}

// --- Initialization ---
function init() {
  // // Correctly placed and working menu button listener
  // if (DOM.menuBtn && DOM.sidebar) {
  //   DOM.menuBtn.addEventListener("click", () => {
  //     DOM.sidebar.classList.toggle("-translate-x-full");
  //   });
  // }
  attachEventListeners();
  loadLists();
}

window.onload = init;