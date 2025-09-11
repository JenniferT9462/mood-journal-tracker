console.log("Hello from trackers.js!");

// Select all calendars
const calendars = document.querySelectorAll(".calendar-container");

calendars.forEach(container => {
    // Get DOM Elements
    const prevMonthBtn = container.querySelector(".prevMonth");
    const nextMonthBtn = container.querySelector(".nextMonth");
    const calendarGrid = container.querySelector(".calendar-grid");
    const currentMonthYear = container.querySelector(".currentMonthYear");

    let currentDate = new Date();

    function renderCalendar() {
        calendarGrid.innerHTML = "";
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

          // Set header text
        currentMonthYear.textContent = new Date(year, month).toLocaleString(
            "default",
            { month: "long", year: "numeric" }
        );

        // Get first day of the month and last day of the month
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
        // Get last day of previous month for padding
        const lastDayOfPrevMonth = new Date(year, month, 0).getDate();

        // Add padding for previous month's days
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            const dayDiv = document.createElement("div");
            dayDiv.textContent = lastDayOfPrevMonth - i;
            dayDiv.classList.add("other-month");
            calendarGrid.appendChild(dayDiv);
        }

        // Add current month's days
        for (let i = 1; i <= lastDayOfMonth; i++) {
            const dayDiv = document.createElement("div");
            dayDiv.textContent = i;
            dayDiv.classList.add("current-month");

            // Add event listener here
            dayDiv.addEventListener("click", () => {
                dayDiv.classList.toggle("active"); // highlight/unhighlight
            });
            // You can add more classes or event listeners here for specific dates
            calendarGrid.appendChild(dayDiv);
        }

        // Add padding for next month's days to fill the grid
        const totalCells = calendarGrid.children.length;
        const remainingCells = 42 - totalCells; // Max 6 rows * 7 days = 42 cells
        for (let i = 1; i <= remainingCells; i++) {
            const dayDiv = document.createElement("div");
            dayDiv.textContent = i;
            dayDiv.classList.add("other-month");
            calendarGrid.appendChild(dayDiv);
        }
    }

    console.log(prevMonthBtn, nextMonthBtn);

    // Event listeners for navigation buttons
    prevMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // Initial render
    renderCalendar();

})








  

  

  
  



