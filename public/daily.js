
document.addEventListener("DOMContentLoaded", () => {
  const newItemInput = document.getElementById("newTaskInput");
  const addItemButton = document.getElementById("addTaskButton");
  const newCareInput = document.getElementById("newCareInput");
  const addCareButton = document.getElementById("addCareButton");
  const checklist = document.getElementById("checklist");
  const careChecklist = document.getElementById("careChecklist"); 

  // --- Default Tasks ---
  const defaultTasks = [
    "Sweep",
    "Dishes",
    "Organize",
    "Litter Box",
    "Wipe Counters",
    "Trash",
    "Make Bed"
  ];

  const defaultCare = [
    "Brush Hair",
    "Brush Teeth",
    "Wash Face",
    "Vitamins"
  ];

  // --- Local Storage Helpers ---
  function saveData() {
    const data = {
      tasks: getListData(checklist),
      care: getListData(careChecklist),
    };
    localStorage.setItem("checklists", JSON.stringify(data));
  }

  function loadData() {
    const stored = localStorage.getItem("checklists");
    return stored ? JSON.parse(stored) : null;
  }

  function getListData(listElement) {
    return Array.from(listElement.querySelectorAll("li")).map((li) => {
      const checkbox = li.querySelector("input[type=checkbox]");
      const text = li.querySelector("span").textContent;
      const isDefault = li.dataset.default === "true";
      return { text, completed: checkbox.checked, isDefault };
    });
  }

  // Function to add a new checklist item
  function addChecklistItem(text, completed = false, targetList = checklist, isDefault = false) {
    const listItem = document.createElement("li");
    listItem.dataset.default = isDefault;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed;

    const itemText = document.createElement("span");
    itemText.textContent = text;
    if (completed) {
      itemText.classList.add("completed");
    }

    checkbox.addEventListener("change", () => {
      itemText.classList.toggle("completed", checkbox.checked);
      saveData();
    });

    listItem.appendChild(checkbox);
    listItem.appendChild(itemText);

    // Only allow delete for user-added tasks
    if (!isDefault) {
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "❌";
      deleteBtn.classList.add("ml-2");
      deleteBtn.addEventListener("click", () => {
        listItem.remove();
        saveData();
      });
      listItem.appendChild(deleteBtn);
    }

    targetList.appendChild(listItem);
  }

  // --- Add task to main list ---
  addItemButton.addEventListener("click", () => {
    const itemText = newItemInput.value.trim();
    if (itemText !== "") {
      addChecklistItem(itemText, false, checklist, false);
      newItemInput.value = ""; 
      saveData();
    }
  });

  newItemInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      addItemButton.click();
    }
  });

  // --- Add task to care list ---
  addCareButton.addEventListener("click", () => {
    const itemText = newCareInput.value.trim();
    if (itemText !== "") {
      addChecklistItem(itemText, false, careChecklist, false);
      newCareInput.value = "";
      saveData();
    }
  });

  newCareInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      addCareButton.click();
    }
  });

  // --- Initialize ---
  const saved = loadData();
  if (saved) {
    saved.tasks.forEach((item) =>
      addChecklistItem(item.text, item.completed, checklist, item.isDefault === "true" || item.isDefault === true)
    );
    saved.care.forEach((item) =>
      addChecklistItem(item.text, item.completed, careChecklist, item.isDefault === "true" || item.isDefault === true)
    );
  } else {
    // First time → load defaults
    defaultTasks.forEach((task) => addChecklistItem(task, false, checklist, true));
    defaultCare.forEach((care) => addChecklistItem(care, false, careChecklist, true));
    saveData();
  }
});

