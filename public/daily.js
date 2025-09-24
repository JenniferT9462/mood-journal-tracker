document.addEventListener("DOMContentLoaded", () => {
    const newItemInput = document.getElementById("newTaskInput");
    const addItemButton = document.getElementById("addTaskButton");
    const newCareInput = document.getElementById("newCareInput");
    const addCareButton = document.getElementById("addCareButton");
    const checklist = document.getElementById("checklist");
    const careChecklist = document.getElementById("careChecklist");

    // --- API Functions ---
    async function saveData() {
        const tasks = getListData(checklist);
        const care = getListData(careChecklist);

        const dataToSend = [
            { name: "Daily Tasks", type: "checklist", items: tasks },
            { name: "Self Care", type: "checklist", items: care },
        ];

        try {
            await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSend),
            });
        } catch (error) {
            console.error("Error saving data:", error);
        }
    }

    async function loadData() {
        try {
            const response = await fetch("/api/tasks");
            if (!response.ok) throw new Error("Failed to load data");
            return await response.json();
        } catch (error) {
            console.error("Error loading data:", error);
            return null;
        }
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
    function addChecklistItem(
        text,
        completed = false,
        targetList = checklist,
        isDefault = false
    ) {
        const listItem = document.createElement("li");
        listItem.dataset.default = isDefault;
        listItem.classList.add("flex", "items-center", "gap-2", "p-1");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = completed;

        const itemText = document.createElement("span");
        itemText.textContent = text;
        if (completed) {
            itemText.classList.add("line-through", "text-gray-400");
        }

        listItem.appendChild(checkbox);
        listItem.appendChild(itemText);

        if (!isDefault) {
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "❌";
            deleteBtn.classList.add("ml-2");
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

    // --- Add task to self care list ---
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

    // --- Event Delegation for Deleting and Checking Items ---
    checklist.addEventListener("click", (event) => {
        const target = event.target;
        if (target.type === "checkbox") {
            const listItem = target.closest("li");
            const itemText = listItem.querySelector("span");
            itemText.classList.toggle("line-through", target.checked);
            itemText.classList.toggle("text-gray-400", target.checked);
            saveData();
        } else if (target.textContent === "❌") {
            target.closest("li").remove();
            saveData();
        }
    });

    careChecklist.addEventListener("click", (event) => {
        const target = event.target;
        if (target.type === "checkbox") {
            const listItem = target.closest("li");
            const itemText = listItem.querySelector("span");
            itemText.classList.toggle("line-through", target.checked);
            itemText.classList.toggle("text-gray-400", target.checked);
            saveData();
        } else if (target.textContent === "❌") {
            target.closest("li").remove();
            saveData();
        }
    });

    // --- Initialization ---
    async function init() {
        const savedData = await loadData();
        const defaultTasks = [
            "Sweep",
            "Dishes",
            "Organize",
            "Litter Box",
            "Wipe Counters",
            "Trash",
            "Make Bed",
        ];
        const defaultCare = ["Brush Hair", "Brush Teeth", "Wash Face", "Vitamins"];

        if (savedData && savedData.length > 0) {
            const tasksList = savedData.find((list) => list.name === "Daily Tasks");
            const careList = savedData.find((list) => list.name === "Self Care");

            if (tasksList) {
                tasksList.items.forEach((item) =>
                    addChecklistItem(item.text, item.completed, checklist, item.isDefault)
                );
            }
            if (careList) {
                careList.items.forEach((item) =>
                    addChecklistItem(
                        item.text,
                        item.completed,
                        careChecklist,
                        item.isDefault
                    )
                );
            }
        } else {
            // First time or no saved data, load defaults
            defaultTasks.forEach((task) =>
                addChecklistItem(task, false, checklist, true)
            );
            defaultCare.forEach((care) =>
                addChecklistItem(care, false, careChecklist, true)
            );
            saveData(); // Save defaults for the first time
        }
    }

    init();
});