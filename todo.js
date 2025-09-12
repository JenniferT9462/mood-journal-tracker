const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const todoList = document.getElementById("todoList");
const progressList = document.getElementById("progressList");
const doneList = document.getElementById("doneList");

// Load tasks from localStorage
window.onload = loadTasks;

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("trelloTasks")) || [];
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
  localStorage.setItem("trelloTasks", JSON.stringify(tasks));
}

function renderTask(taskText, status = "todo") {
  const li = document.createElement("li");

  li.className =
    "p-3 bg-white/20 rounded-lg shadow-md hover:bg-white/30 transition cursor-pointer flex items-center";

  li.innerHTML = `
  <span class="text-white flex-1 pr-3">${taskText}</span>
  <div class="flex space-x-2 ml-auto gap-2">
    ${
      status !== "todo"
        ? `<button class="moveLeft w-7 h-7 flex items-center justify-center rounded-circle text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-80">&lt;</button>`
        : ""
    }
    ${
      status !== "done"
        ? `<button class="moveRight w-7 h-7 flex items-center justify-center rounded-circle text-white bg-gradient-to-r from-purple-500 to-teal-500 hover:opacity-80">&gt;</button>`
        : ""
    }
    <button class="deleteBtn w-7 h-7 flex items-center justify-center rounded-circle text-white bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-80">✗</button>
  </div>
`;

  if (status === "todo") todoList.appendChild(li);
  if (status === "progress") progressList.appendChild(li);
  if (status === "done") doneList.appendChild(li);

  // Move left
  const moveLeftBtn = li.querySelector(".moveLeft");
  if (moveLeftBtn) {
    moveLeftBtn.addEventListener("click", () => {
      li.remove();
      if (status === "progress") renderTask(taskText, "todo");
      if (status === "done") renderTask(taskText, "progress");
      saveTasks();
    });
  }

  // Move right
  const moveRightBtn = li.querySelector(".moveRight");
  if (moveRightBtn) {
    moveRightBtn.addEventListener("click", () => {
      li.remove();
      if (status === "todo") renderTask(taskText, "progress");
      if (status === "progress") renderTask(taskText, "done");
      saveTasks();
    });
  }

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
