document.addEventListener("DOMContentLoaded", () => {
  const newItemInput = document.getElementById("newTaskInput");
  const addItemButton = document.getElementById("addTaskButton");
  const newCareInput = document.getElementById("newCareInput");
  const addCareButton = document.getElementById("addCareButton");
  const checklist = document.getElementById("checklist");
  const careChecklist = document.getElementById("careChecklist"); 

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

    // Event listener for checkbox change
    checkbox.addEventListener("change", () => {
      itemText.classList.toggle("completed", checkbox.checked);
      // In a real application, you'd save this state (e.g., to local storage)
    });

    listItem.appendChild(checkbox);
    listItem.appendChild(itemText);
    // checklist.appendChild(listItem);
    targetList.appendChild(listItem);
  }

  // Event listener for adding new items
  addItemButton.addEventListener("click", () => {
    const itemText = newItemInput.value.trim();
    if (itemText !== "") {
      addChecklistItem(itemText);
      newItemInput.value = ""; // Clear input field
    }
  });

  // Allow adding items by pressing Enter in the input field
  newItemInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      addItemButton.click();
    }
  });

  // Example initial items (can be loaded from storage in a real app)
  addChecklistItem("Buy groceries", false, checklist);
  addChecklistItem("Finish project report", true, checklist);
  addChecklistItem("Call a friend", false, checklist);

  // --- Care tasks ---
  addCareButton.addEventListener("click", () => {
    const itemText = newCareInput.value.trim();
    if (itemText !== "") {
      addChecklistItem(itemText, false, careChecklist);
      newCareInput.value = "";
    }
  });

  newCareInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      addCareButton.click();
    }
  });

   addChecklistItem("Brush Hair", false, careChecklist);
  addChecklistItem("Brush Teeth", true, careChecklist);
  addChecklistItem("Wash Face", false, careChecklist);
});
 