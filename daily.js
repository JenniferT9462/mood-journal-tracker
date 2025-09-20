document.addEventListener("DOMContentLoaded", () => {
  const newItemInput = document.getElementById("newTaskInput");
  const addItemButton = document.getElementById("addTaskButton");
  const newCareInput = document.getElementById("newCareInput");
  const addCareButton = document.getElementById("addCareButton");
  const checklist = document.getElementById("checklist");
  const careChecklist = document.getElementById("careChecklist"); 

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
    return stored ? JSON.parse(stored) : { tasks: [], care: [] };
  }

  function getListData(listElement) {
    return Array.from(listElement.querySelectorAll("li")).map((li) => {
      const checkbox = li.querySelector("input[type=checkbox]");
      const text = li.querySelector("span").textContent;
      return { text, completed: checkbox.checked };
    });
  }

  // Function to add a new checklist item
  function addChecklistItem(text, completed = false, targetList = checklist) {
    const listItem = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed;

    const itemText = document.createElement("span");
    itemText.textContent = text;
    if (completed) {
      itemText.classList.add("completed");
    }

       // Update localStorage when checkbox changes
    checkbox.addEventListener("change", () => {
      itemText.classList.toggle("completed", checkbox.checked);
      saveData();
    });
  

    listItem.appendChild(checkbox);
    listItem.appendChild(itemText);
    targetList.appendChild(listItem);
  }

  // --- Add task to main list ---
  addItemButton.addEventListener("click", () => {
    const itemText = newItemInput.value.trim();
    if (itemText !== "") {
      addChecklistItem(itemText, false, checklist);
      newItemInput.value = ""; // Clear input field
      saveData();
    }
  });

  // Allow adding items by pressing Enter in the input field
  newItemInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      addItemButton.click();
    }
  });



  // --- Add task to care list ---
  addCareButton.addEventListener("click", () => {
    const itemText = newCareInput.value.trim();
    if (itemText !== "") {
      addChecklistItem(itemText, false, careChecklist);
      newCareInput.value = "";
      saveData();
    }
  });

  newCareInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      addCareButton.click();
    }
  });



  // --- Initialize from localStorage ---
  const saved = loadData();
  saved.tasks.forEach((item) =>
    addChecklistItem(item.text, item.completed, checklist)
  );
  saved.care.forEach((item) =>
    addChecklistItem(item.text, item.completed, careChecklist)
  );
});
 