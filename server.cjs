// import express from "express";
const express = require("express");
// import fs from "fs";
const fs = require("fs");
// import path from "path";
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join("data", "entries.json");
const HABIT_FILE = path.join("data", "habitData.json");
const LIST_FILE = path.join("data", "lists.json");
const TASKS_FILE = path.join("data", "dailyTasks.json");

app.use(express.json());
app.use(express.static("public")); // serve your public folder

// Ensure data folder and file exist
if (!fs.existsSync("data")) fs.mkdirSync("data");
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");
if (!fs.existsSync(HABIT_FILE)) fs.writeFileSync(HABIT_FILE, "[]");
if (!fs.existsSync(LIST_FILE)) fs.writeFileSync(LIST_FILE, "[]");
if (!fs.existsSync(TASKS_FILE)) fs.writeFileSync(TASKS_FILE, "{}");

//====== Journal Entry ======

// GET all entries
app.get("/api/entries", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    res.json(data);
  } catch (err) {
    console.error("Error reading entries file:", err);
    res.status(500).send("Error reading entries file.");
  }
});

// Add a new entry
app.post("/api/entries", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    const filtered = data.filter((e) => e.date !== req.body.date);
    filtered.push(req.body);
    fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error("Error writing to entries file:", err);
    res.status(500).send("Error writing to entries file.");
  }
});

// Edit an entry (replace by date)
app.put("/api/entries/:date", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    const index = data.findIndex((e) => e.date === req.params.date);
    if (index >= 0) {
      data[index] = req.body;
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Entry not found" });
    }
  } catch (err) {
    console.error("Error writing to entries file:", err);
    res.status(500).send("Error writing to entries file.");
  }
});

// Delete an entry (by date)
app.delete("/api/entries/:date", (req, res) => {
  try {
    let data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    data = data.filter((e) => e.date !== req.params.date);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting entry:", err);
    res.status(500).send("Error deleting entry.");
  }
});

//====== Habit Trackers ======

// Get all habit calendars
app.get("/api/habits", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(HABIT_FILE, "utf8"));
    res.json(data);
  } catch (err) {
    console.error("Error reading habits file:", err);
    res.status(500).send("Error reading habits file.");
  }
});

// Add or update a habit calendar
app.post("/api/habits", (req, res) => {
  console.log("Incoming POST:", req.body);
  try {
    const data = JSON.parse(fs.readFileSync(HABIT_FILE, "utf8"));
    console.log("Current data:", data);

    const habit = req.body;
    const filtered = data.filter((h) => h.name !== habit.name);
    filtered.push(habit);

    fs.writeFileSync(HABIT_FILE, JSON.stringify(filtered, null, 2));
    console.log("Updated data written:", filtered);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error, invalid JSON");
  }
});

// Delete a habit
app.delete("/api/habits/:name", (req, res) => {
  let data = JSON.parse(fs.readFileSync(HABIT_FILE, "utf8"));
  data = data.filter((h) => h.name !== req.params.name);
  fs.writeFileSync(HABIT_FILE, JSON.stringify(data, null, 2));
  res.json({ success: true });
});

//====== Lists ======
//GET all lists
app.get("/api/lists", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(LIST_FILE, "utf8"));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error reading lists file.");
  }
});

// Save all lists (replace all lists with the new data)
app.post("/api/lists", (req, res) => {
  try {
    fs.writeFileSync(LIST_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error writing to lists file.");
  }
});

//====== Daily Tasks Routes ======

// Helper function to get today's date in YYYY-MM-DD format
function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

// Helper function to create the default task structure
function getDefaultTasks() {
  const defaultTasks = [
    { text: "Sweep", completed: false, isDefault: true },
    { text: "Dishes", completed: false, isDefault: true },
    { text: "Organize", completed: false, isDefault: true },
    { text: "Litter Box", completed: false, isDefault: true },
    { text: "Wipe Counters", completed: false, isDefault: true },
    { text: "Trash", completed: false, isDefault: true },
    { text: "Make Bed", completed: false, isDefault: true },
  ];
  const defaultCare = [
    { text: "Brush Hair", completed: false, isDefault: true },
    { text: "Brush Teeth", completed: false, isDefault: true },
    { text: "Wash Face", completed: false, isDefault: true },
    { text: "Vitamins", completed: false, isDefault: true },
    { text: "Yoga", completed: false, isDefault: true },
    { text: "Meds", completed: false, isDefault: true },
  ];

  return [
    { name: "Daily Tasks", type: "checklist", items: defaultTasks },
    { name: "Self Care", type: "checklist", items: defaultCare },
  ];
}

// GET all tasks
app.get("/api/tasks", (req, res) => {
  try {
    const fileContent = fs.readFileSync(TASKS_FILE, "utf8");
    let savedData;
    try {
        savedData = JSON.parse(fileContent);
    } catch (e) {
      savedData = {}; // Set to empty object if file content is invalid JSON
    }

    const today = getTodayDate();
    let tasksToReturn = [];
   
    // Check if the saved date is NOT today
    if (!savedData.lastResetDate || savedData.lastResetDate !== today) {
      console.log("New day detected or no date stamp. Resetting tasks...");
    
      // 1. Store user-added tasks, separated by their original list name
     const userAddedTasksByList = {
        "Daily Tasks": [],
        "Self Care": []
      };
      if (savedData.tasks) {
        savedData.tasks.forEach(list => {
            // Find all non-default items in this specific list
          const nonDefaultItems = list.items.filter(item => !item.isDefault);

            // Map them, ensuring 'completed' status is reset
          const resetItems = nonDefaultItems.map(item => ({ 
              ...item, 
              completed: false 
          }));

          // Store them under their correct list name (which must be "Daily Tasks" or "Self Care")
          if (userAddedTasksByList[list.name]) {
            userAddedTasksByList[list.name].push(...resetItems);
          }
        });
      }

         // 2. Create a fresh list of defaults + user-added tasks (all set to incomplete)
        let defaults = getDefaultTasks();

        // 3. Add the user-added tasks back to their correct default list
        defaults.forEach(list => {
             // Get the user-added tasks for this list
            const tasksToAppend = userAddedTasksByList[list.name];

            if (tasksToAppend && tasksToAppend.length > 0) {
                // Append the non-default, reset items to the end of the list
                list.items.push(...tasksToAppend);
        }
        })
        
       // 4. Prepare the new data structure for saving
        tasksToReturn = defaults;
        const newSaveData = {
            lastResetDate: today,
            tasks: tasksToReturn
        };

        // 5. Save the new, reset list
        fs.writeFileSync(TASKS_FILE, JSON.stringify(newSaveData, null, 2));


    } else {
        // It IS today, return the existing saved tasks
        tasksToReturn = savedData.tasks;
    }
    res.json(tasksToReturn);

  } catch (err) {
        // If the file is empty or corrupted, return defaults and save them
        console.error("Error reading tasks file, loading defaults:", err);
        const defaults = getDefaultTasks();
        const initialData = { lastResetDate: getTodayDate(), tasks: defaults };
        fs.writeFileSync(TASKS_FILE, JSON.stringify(initialData, null, 2));
        res.json(defaults);
    }
});

// Save all tasks (replaces existing tasks)
// NOTE: We need to wrap the incoming data in the same structure as above
app.post("/api/tasks", (req, res) => {
    try {
        const dataToSave = {
            lastResetDate: getTodayDate(), // Update the timestamp on every save
            tasks: req.body // req.body is the array of lists from the frontend
        };

        fs.writeFileSync(TASKS_FILE, JSON.stringify(dataToSave, null, 2));
        res.json({ success: true });
    } catch (err) {
        console.error("Error writing to tasks file:", err);
        res.status(500).send("Error writing to tasks file.");
    }
});

// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
// export the app:
module.exports = app;
