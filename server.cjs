const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

const PORT = 3000;

const DATA_FILE = path.join("data", "entries.json");
const HABIT_FILE = path.join("data", "habitData.json");
const LIST_FILE = path.join("data", "lists.json");
const TASKS_FILE = path.join("data", "dailyTasks.json");
const TIME_FILE = path.join("data", "timetracker.json");
const MINDFUL_FILE = path.join("data", "mindfulData.json");



const FILE_NAMES = {
    ENTRIES: DATA_FILE,
    HABITS: HABIT_FILE,
    LISTS: LIST_FILE,
    TASKS: TASKS_FILE,
    TIME_TRACKER: TIME_FILE,
    MINDFUL: MINDFUL_FILE,
};

function ensureDataFiles() {
    if (!fs.existsSync("data")) fs.mkdirSync("data");
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");
    if (!fs.existsSync(HABIT_FILE)) fs.writeFileSync(HABIT_FILE, "[]");
    if (!fs.existsSync(LIST_FILE)) fs.writeFileSync(LIST_FILE, "[]");
    if (!fs.existsSync(TASKS_FILE)) fs.writeFileSync(TASKS_FILE, "{}");
    if (!fs.existsSync(TIME_FILE)) fs.writeFileSync(TIME_FILE, "{}");
    if (!fs.existsSync(MINDFUL_FILE)) fs.writeFileSync(MINDFUL_FILE, '{"gratitudeHistory": [], "customAffirmations": []}');
}

// --- Middleware ---
app.use(express.json());
app.use(express.static("public"));

// --- API Routes ---

//====== Journal Entry ======

// GET all entries (CLEAN VERSION)
app.get("/api/entries", (req, res) => {
  const filePath = FILE_NAMES.ENTRIES;
  try {
    const dataContent = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(dataContent);
    res.json(data);
  } catch (err) {
    console.error(`Error loading/parsing data from: ${filePath}`, err);
    res.json([]);
  }
});

// Add a new entry (No change needed here)
app.post("/api/entries", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(FILE_NAMES.ENTRIES, "utf8"));
    const filtered = data.filter((e) => e.date !== req.body.date);
    filtered.push(req.body);
    fs.writeFileSync(FILE_NAMES.ENTRIES, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error("Error writing to entries file:", err);
    res.status(500).send("Error writing to entries file.");
  }
});

// Edit an entry (replace by date) (No change needed here)
app.put("/api/entries/:date", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(FILE_NAMES.ENTRIES, "utf8"));
    const index = data.findIndex((e) => e.date === req.params.date);
    if (index >= 0) {
      data[index] = req.body;
      fs.writeFileSync(FILE_NAMES.ENTRIES, JSON.stringify(data, null, 2));
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Entry not found" });
    }
  } catch (err) {
    console.error("Error writing to entries file:", err);
    res.status(500).send("Error writing to entries file.");
  }
});

// Delete an entry (by date) (No change needed here)
app.delete("/api/entries/:date", (req, res) => {
  try {
    let data = JSON.parse(fs.readFileSync(FILE_NAMES.ENTRIES, "utf8"));
    data = data.filter((e) => e.date !== req.params.date);
    fs.writeFileSync(FILE_NAMES.ENTRIES, JSON.stringify(data, null, 2));
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
    const data = JSON.parse(fs.readFileSync(FILE_NAMES.HABITS, "utf8"));
    res.json(data);
  } catch (err) {
    console.error("Error reading habits file:", err);
    res.json([]);
  }
});

// Add or update a habit calendar (No change needed here)
app.post("/api/habits", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(FILE_NAMES.HABITS, "utf8"));
    const habit = req.body;
    const filtered = data.filter((h) => h.name !== habit.name);
    filtered.push(habit);
    fs.writeFileSync(FILE_NAMES.HABITS, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error, invalid JSON");
  }
});

// Delete a habit (No change needed here)
app.delete("/api/habits/:name", (req, res) => {
  try {
    let data = JSON.parse(fs.readFileSync(FILE_NAMES.HABITS, "utf8"));
    data = data.filter((h) => h.name !== req.params.name);
    fs.writeFileSync(FILE_NAMES.HABITS, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting habit:", err);
    res.status(500).send("Error deleting habit.");
  }
});

//====== Lists ======
//GET all lists
app.get("/api/lists", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(FILE_NAMES.LISTS, "utf8"));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.json([]);
  }
});

// Save all lists (replace all lists with the new data) (No change needed here)
app.post("/api/lists", (req, res) => {
  try {
    fs.writeFileSync(FILE_NAMES.LISTS, JSON.stringify(req.body, null, 2));
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
    const fileContent = fs.readFileSync(FILE_NAMES.TASKS, "utf8");
    let savedData;
    try {
      savedData = JSON.parse(fileContent);
    } catch (e) {
      savedData = {};
    }

    const today = getTodayDate();
    let tasksToReturn = [];

    if (!savedData.lastResetDate || savedData.lastResetDate !== today) {
      console.log("New day detected or no date stamp. Resetting tasks...");

      const userAddedTasksByList = {
        "Daily Tasks": [],
        "Self Care": [],
      };
      if (savedData.tasks) {
        savedData.tasks.forEach((list) => {
          const nonDefaultItems = list.items.filter((item) => !item.isDefault);
          const resetItems = nonDefaultItems.map((item) => ({
            ...item,
            completed: false,
          }));
          if (userAddedTasksByList[list.name]) {
            userAddedTasksByList[list.name].push(...resetItems);
          }
        });
      }
      let defaults = getDefaultTasks();

      defaults.forEach((list) => {
        const tasksToAppend = userAddedTasksByList[list.name];
        if (tasksToAppend && tasksToAppend.length > 0) {
          list.items.push(...tasksToAppend);
        }
      });

      tasksToReturn = defaults;
      const newSaveData = {
        lastResetDate: today,
        tasks: tasksToReturn,
      };

      // 5. Save the new, reset list
      fs.writeFileSync(FILE_NAMES.TASKS, JSON.stringify(newSaveData, null, 2));
    } else {
      tasksToReturn = savedData.tasks;
    }
    res.json(tasksToReturn);
  } catch (err) {
    console.error("Error reading tasks file, loading defaults:", err);
    const defaults = getDefaultTasks();
    const initialData = { lastResetDate: getTodayDate(), tasks: defaults };
    fs.writeFileSync(FILE_NAMES.TASKS, JSON.stringify(initialData, null, 2));
    res.json(defaults);
  }
});

// Save all tasks (replaces existing tasks) (No change needed here)
app.post("/api/tasks", (req, res) => {
  try {
    const dataToSave = {
      lastResetDate: getTodayDate(), // Update the timestamp on every save
      tasks: req.body, // req.body is the array of lists from the frontend
    };

    fs.writeFileSync(FILE_NAMES.TASKS, JSON.stringify(dataToSave, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error("Error writing to tasks file:", err);
    res.status(500).send("Error writing to tasks file.");
  }
});

//====== Time Tracker Routes ======

// GET all time tracker data (No change needed here as the catch block is already safe)
app.get("/api/timetracker", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(FILE_NAMES.TIME_TRACKER, "utf8"));
    res.json(data);
  } catch (err) {
    console.error("Error reading time tracker file:", err);
    // Return a default structure on read error
    const defaultData = {
      currentEntries: [],
      archivedMonths: [],
      lastMonthChecked: new Date().getMonth().toString(),
      archiveYear: new Date().getFullYear(),
    };
    res.json(defaultData);
  }
});

// Save all time tracker data (replaces existing content) (No change needed here)
app.post("/api/timetracker", (req, res) => {
  try {
    // The request body should contain the full timeTrackerData object
    fs.writeFileSync(
      FILE_NAMES.TIME_TRACKER,
      JSON.stringify(req.body, null, 2)
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Error writing to time tracker file:", err);
    res.status(500).send("Error writing to time tracker file.");
  }
});

// --- Server Start ---

module.exports.start = (callback) => {
  console.log("--- SERVER INITIALIZATION ---");

  // NOTE: This calls the ensureDataFiles function defined earlier in the file
  ensureDataFiles();
  console.log("All data files ensured. Starting server...");

  // 4. Start the Express server
  // FIX: Uses the constant PORT and binds explicitly to localhost
  return app.listen(PORT, "127.0.0.1", callback);
}; // <--- The function definition ends here with the closing brace.

// 💡 NEW CODE BLOCK: Checks if the file is being run directly.
// This block must be OUTSIDE of the 'module.exports.start' function.
if (require.main === module) {
    // If run directly, execute the start function.
    module.exports.start(() => {
        console.log(`Server is now listening at http://localhost:${PORT}`);
    });
}
