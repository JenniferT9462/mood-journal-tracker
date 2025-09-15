console.log("Hello from dashboard.js");

// Mood entries
const entries = JSON.parse(localStorage.getItem("entries")) || [];

// Todos
const tasks = JSON.parse(localStorage.getItem("trelloTasks")) || [];

// Habits (depends on how you store, but same idea)
const habits = JSON.parse(localStorage.getItem("habitData")) || [];



