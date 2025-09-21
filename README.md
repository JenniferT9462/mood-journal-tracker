# mood-journal-tracker

Perfect! Here’s a **tomorrow plan checklist** to keep your momentum going and make your planner app dashboard even more polished:

---

### **Planner App – Tomorrow Dev Plan**

#### **1️⃣ Dashboard Improvements**

* ✅ Ensure all snapshots render safely (journal entries, habits, notes, tasks).
* Add **nested items for notes/lists** (show each item under the list name in a `<ul>`).
* Add **habit completion status**: change your `habitList` from an array of strings → array of objects:

```js
[{ name: "No Alcohol", completed: true }, ...]
```

* Render habits with ✅ or ❌ based on `completed`.

---

#### **2️⃣ Quick Actions / Add Buttons**

* Make sure “Add Journal”, “Add Habit”, “Add Note” buttons redirect correctly.
* Optionally, open a modal to add a new entry directly from the dashboard.

---

#### **3️⃣ Styling & Layout**

* Match dashboard theme to other pages: colors, shadows, rounded corners.
* Consider **cards for each snapshot** with subtle hover effects.
* Use **Tailwind grid/flex** for responsive layout.

---

#### **4️⃣ Data Handling**

* Review localStorage keys:

  * `entries` → journal entries `{ date, mood, journalText }`
  * `habitList` → habits `{ name, completed }`
  * `allLists` → notes/lists `{ name, type, items }`
  * `checklists` → daily tasks & self-care `{ tasks, care }`
* Ensure adding/updating entries also updates dashboard automatically.

---

#### **5️⃣ Optional Enhancements**

* Add **“Mark as Done” checkboxes** on dashboard for habits and tasks.
* Show **total count** or **streaks** for habits and tasks.
* Implement **expand/collapse** for notes/lists to preview all items.
* Add **date sorting** for journal entries (latest first).

---

#### **6️⃣ Testing**

* Test with empty state (no entries) → dashboard shouldn’t crash.
* Test with multiple entries → check truncation, layout, and overflow.
* Test adding new data → confirm live update on dashboard.

---

-----------------------------------------------------------
| Hello, Nicolas! 👋                                      |
| Here's a quick look at your day.                       |
-----------------------------------------------------------

[ Quick Actions ]
-----------------------------------------
| ✍️ Add Journal | 🏃 Add Habit | 📝 Add Note |
-----------------------------------------

[ Your Data – Snapshot Cards ]
-----------------------------------------------------------
| Journal Entries       | Habit Tracker       | Notes & Lists  |
|----------------------|-------------------|----------------|
| 09/20: Did yoga...   | ✅ No Alcohol      | Shopping:       |
| 09/19: Meditation... | ❌ Vitamins        | - Conditioner  |
| 09/18: Feeling good  | ✅ Yoga            | TODO:          |
|                      | ✅ Meds            | - Laundry      |
-----------------------------------------------------------

[ Daily Tasks / Self Care ]
-----------------------------------------
| Daily Tasks:         | Self Care:        |
| - Take meds ✅        | - Meditation ❌    |
| - Walk dog ❌         | - Journal ✅      |
| - Water plants ✅     | - Yoga ❌         |
-----------------------------------------

Optional Enhancements:
- Cards have subtle shadow + rounded corners
- Truncate long journal entries with "..."
- Nested items for lists/notes
- Clickable habits/tasks to mark complete

