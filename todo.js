const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const addShoppingBtn = document.getElementById("addShoppingBtn");
const todoList = document.getElementById("todoList");
const shoppingList = document.getElementById("shopping-list");
const shoppingInput = document.getElementById("shoppingInput");
const listsContainer = document.getElementById("listsContainer");

// New modal elements
const addListBtn = document.getElementById("addListBtn");
const addListModal = document.getElementById("addListModal");
const addListContent = document.getElementById("addListContent");
const cancelBtn = document.getElementById("cancelBtn");
const newListForm = document.getElementById("newListForm");

// Show the modal when "Add New List" button is clicked
addListBtn.addEventListener("click", () => {
  addListModal.classList.remove("hidden", "opacity-0");
  addListModal.classList.add("flex", "opacity-100");
  addListContent.classList.remove("scale-95", "opacity-0");
  addListContent.classList.add("scale-100", "opacity-100");
});

// Hide modal
function closeModal() {
  addListModal.classList.remove("flex", "opacity-100");
  addListModal.classList.add("hidden", "opacity-0");
  addListContent.classList.remove("scale-100", "opacity-100");
  addListContent.classList.add("scale-95", "opacity-0");
  newListForm.reset();
}
cancelBtn.addEventListener("click", closeModal);

// Click outside content closes modal
addListModal.addEventListener("click", (e) => {
  if (e.target === addListModal) closeModal();
});

newListForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const listName = document.getElementById("listName").value.trim();
  const listType = document.getElementById("listType").value;
  const firstItem = document.getElementById("firstItem").value.trim();

  if (!listName) return;

   const items = firstItem ? [firstItem] : [];

  // use the shared renderer which also handles attaching delete/clear handlers
  renderNewList(listName, listType, items, true);

  // reset + close modal
  newListForm.reset();
  closeModal();
});




function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => renderTask(task.text, task.status));
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll("ul.list-group").forEach((list) => {
    const status = list.id.replace("List", ""); // todo, progress, done
    list.querySelectorAll("li").forEach((li) => {
      tasks.push({ text: li.querySelector("span").textContent, status });
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(taskText, status = "todo") {
  const li = document.createElement("li");

  li.className =
    "p-3 bg-white/20 rounded-lg shadow-md hover:bg-white/30 transition cursor-pointer flex items-center";

  li.innerHTML = `
  <span class="text-white flex-1 pr-3">${taskText}</span>
  <div class="flex space-x-2 ml-auto gap-2">
    
    <button class="deleteBtn w-7 h-7 flex items-center justify-center rounded-circle text-white bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-80">✗</button>
  </div>
`;

  if (status === "todo") todoList.appendChild(li);

  // Delete
  li.querySelector(".deleteBtn").addEventListener("click", () => {
    li.remove();
    saveTasks();
  });

  saveTasks();
}

// Add new task
addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;
  renderTask(taskText, "todo");
  taskInput.value = "";
});

// Enter key support
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTaskBtn.click();
});

function loadItems() {
  const items = JSON.parse(localStorage.getItem("items")) || [];
  items.forEach((item) => renderItems(item.text, item.status));
}

function saveItems() {
  const items = [];
  shoppingList.querySelectorAll("li").forEach((li) => {
    items.push({
      text: li.querySelector("span").textContent,
      status: "shopping",
    });
  });
  localStorage.setItem("items", JSON.stringify(items));
}

function renderItems(itemText, status = "shopping") {
  const li = document.createElement("li");

  li.className =
    "p-3 bg-white/20 rounded-lg shadow-md hover:bg-white/30 transition cursor-pointer flex items-center";

  li.innerHTML = `
  <span class="text-white flex-1 pr-3">${itemText}</span>
  <div class="flex space-x-2 ml-auto gap-2">
    
    <button class="deleteItemsBtn w-7 h-7 flex items-center justify-center rounded-circle text-white bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-80">✗</button>
  </div>
`;

  if (status === "shopping") shoppingList.appendChild(li);
  // Delete
  li.querySelector(".deleteItemsBtn").addEventListener("click", () => {
    li.remove();
    saveItems();
  });

  saveItems();
}

// ======= CUSTOM LISTS: render / save / load =======
function renderNewList(listName, listType = "checklist", items = [], shouldSave = true) {
  const col = document.createElement("div");
  col.className = "col-md-4";
  // mark this column as a custom (persisted) list so we don't save static columns
  col.dataset.custom = "true";
  col.dataset.type = listType;

  col.innerHTML = `
    <div class="rounded-2xl bg-white/10 backdrop-blur-lg p-4 shadow-xl hover:shadow-2xl transition">
      <div class="card-header text-white text-center font-bold d-flex justify-content-between align-items-center">
        <h2 class="text-2xl font-semibold mb-4 text-blue-200">${listName}</h2>
        <button class="btn btn-sm btn-light text-primary clearBtn">Clear All</button>
      </div>
      <ul class="list-group list-group-flush min-h-[200px]"></ul>
    </div>
  `;

  const ul = col.querySelector("ul");

  // render any initial items and attach delete handlers that also save
  items.forEach((itemText) => {
    const li = document.createElement("li");
    li.className =
      "p-3 bg-white/20 rounded-lg shadow-md hover:bg-white/30 transition cursor-pointer flex items-center";
    li.innerHTML = `
      <span class="text-white flex-1 pr-3">${itemText}</span>
      <div class="flex space-x-2 ml-auto gap-2">
        <button class="deleteBtn w-7 h-7 flex items-center justify-center rounded-circle text-white bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-80">✗</button>
      </div>
    `;
    ul.appendChild(li);

    li.querySelector(".deleteBtn").addEventListener("click", () => {
      li.remove();
      saveLists();
    });
  });

  // Clear All button
  col.querySelector(".clearBtn").addEventListener("click", () => {
    ul.innerHTML = "";
    saveLists();
  });

  listsContainer.appendChild(col);

  if (shouldSave) saveLists();
}

function saveLists() {
  const lists = [];
  // only save lists we marked as custom
  listsContainer.querySelectorAll('[data-custom="true"]').forEach((col) => {
    const name = col.querySelector("h2").textContent.trim();
    const type = col.dataset.type || "checklist";
    const items = [];
    col.querySelectorAll("ul li span").forEach((span) => {
      items.push(span.textContent.trim());
    });
    lists.push({ name, type, items });
  });
  localStorage.setItem("customLists", JSON.stringify(lists));
}

function loadLists() {
  const lists = JSON.parse(localStorage.getItem("customLists")) || [];
  // render without saving again (shouldSave = false) to avoid immediate rewrite
  lists.forEach((list) => renderNewList(list.name, list.type, list.items, false));
}


// Add new task
addShoppingBtn.addEventListener("click", () => {
  const itemText = shoppingInput.value.trim();
  if (itemText === "") return;
  renderItems(itemText, "shopping");
  shoppingInput.value = "";
});

// Enter key support
shoppingInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addShoppingBtn.click();
});
window.onload = () => {
  loadTasks();
  loadItems();
  loadLists(); // <- load persisted custom lists
};