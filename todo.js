const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const addShoppingBtn = document.getElementById("addShoppingBtn");
const todoList = document.getElementById("todoList");
const shoppingList = document.getElementById("shopping-list");
const shoppingInput = document.getElementById("shoppingInput");

// Load tasks from localStorage
window.onload = () => {
  loadTasks();
  loadItems();
};

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

// function saveItems() {
//   const items = [];
//   document.querySelectorAll("ul.list-group").forEach((list) => {
//     const status = list.id.replace("List", ""); // todo, progress, done
//     list.querySelectorAll("li").forEach((li) => {
//       items.push({ text: li.querySelector("span").textContent, status });
//     });
//   });
//   localStorage.setItem("items", JSON.stringify(items));
// }
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
