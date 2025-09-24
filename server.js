import express from "express";
import fs from "fs";
import path from "path";

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
if (!fs.existsSync(TASKS_FILE)) fs.writeFileSync(TASKS_FILE, "[]");



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
        const filtered = data.filter(e => e.date !== req.body.date);
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
        const index = data.findIndex(e => e.date === req.params.date);
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
        data = data.filter(e => e.date !== req.params.date);
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
    const filtered = data.filter(h => h.name !== habit.name);
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
  data = data.filter(h => h.name !== req.params.name);
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

// GET all tasks
app.get("/api/tasks", (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(TASKS_FILE, "utf8"));
        res.json(data);
    } catch (err) {
        console.error("Error reading tasks file:", err);
        res.status(500).send("Error reading tasks file.");
    }
});

// Save all tasks (replaces existing tasks)
app.post("/api/tasks", (req, res) => {
    try {
        fs.writeFileSync(TASKS_FILE, JSON.stringify(req.body, null, 2));
        res.json({ success: true });
    } catch (err) {
        console.error("Error writing to tasks file:", err);
        res.status(500).send("Error writing to tasks file.");
    }
});



app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
