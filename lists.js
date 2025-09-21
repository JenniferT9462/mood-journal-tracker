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

function createListItem(listElement, itemText) {
  const li = document.createElement("li");
  li.className =
    "p-3 bg-white/20 rounded-lg shadow-md hover:bg-white/30 transition cursor-pointer flex items-center";

  li.innerHTML = `
    <span class="text-white flex-1 pr-3">${itemText}</span>
    <div class="flex space-x-2 ml-auto gap-2">
    <button class="editBtn w-7 h-7 flex items-center justify-center rounded-full text-white bg-gradient-to-r from-blue-500 to-pink-500 hover:opacity-80">✏️</button>
    <button class="deleteBtn w-7 h-7 flex items-center justify-center rounded-full text-white bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-80">❌</button>
    </div>
  `;

  // Attach delete handler
  li.querySelector(".deleteBtn").addEventListener("click", () => {
    li.remove();
    saveLists();
  });

  // Attach edit handler
  li.querySelector(".editBtn").addEventListener("click", () => {
    const span = li.querySelector("span");
    const newText = prompt("Edit item:", span.textContent);
    if (newText !== null && newText.trim() !== "") {
      span.textContent = newText.trim();
      saveLists();
    }
  });

  listElement.appendChild(li);
}

function saveLists() {
  const allLists = [];

  // Save only dynamic lists
  DOM.listsContainer.querySelectorAll('[data-custom="true"]').forEach((col) => {
    const name = col.querySelector("h2").textContent.trim();
    const type = col.dataset.type || "checklist";
    const items = Array.from(col.querySelectorAll("ul li span")).map((span) =>
      span.textContent.trim()
    );
    allLists.push({ name, type, items });
  });

  localStorage.setItem("allLists", JSON.stringify(allLists));
}

function loadLists() {
  const allLists = JSON.parse(localStorage.getItem("allLists")) || [];
  DOM.listsContainer.innerHTML = "";
  allLists.forEach((list) =>
    renderNewList(list.name, list.type, list.items, false)
  );
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
        <button class="bg-green-400 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-sm addItem">➕</button>
        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm deleteList">❌</button>
      </div>
      <ul class="list-none space-y-2 min-h-[200px]"></ul>
    </div>
  `;

  const ul = col.querySelector("ul");
  // Add existing items
  items.forEach((itemText) => createListItem(ul, itemText));

  // Attach add item handler
  col.querySelector(".addItem").addEventListener("click", () => {
    const newItem = prompt("Add new item:");
    if (newItem && newItem.trim() !== "") {
      createListItem(ul, newItem.trim());
      saveLists();
    }
  });

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
    const items = firstItem ? [firstItem] : [];
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
