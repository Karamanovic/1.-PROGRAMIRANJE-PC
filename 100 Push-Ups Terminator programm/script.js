const days = [
    { day: 1, sets: [34, 20, 18, 16, 12], rest: false },
    { day: 2, sets: [36, 22, 16, 16, 14], rest: false },
    { day: 3, sets: [38, 24, 18, 14, 12], rest: false },
    { day: 4, sets: [38, 22, 16, 20, 12], rest: false },
    { day: 5, sets: [40, 18, 24, 16, 16], rest: false },
    { day: 6, sets: [], rest: true },
    { day: 7, sets: [36, 26, 22, 22, 14], rest: false },
    { day: 8, sets: [38, 26, 22, 22, 14], rest: false },
    { day: 9, sets: [40, 26, 24, 18, 16], rest: false },
    { day: 10, sets: [40, 26, 24, 18, 16], rest: false },
    { day: 11, sets: [42, 24, 22, 22, 18], rest: false },
    { day: 12, sets: [], rest: true },
    { day: 13, sets: [46, 26, 24, 20, 18], rest: false },
    { day: 14, sets: [48, 26, 26, 20, 16], rest: false },
    { day: 15, sets: [50, 28, 24, 20, 18], rest: false },
    { day: 16, sets: [50, 26, 26, 22, 18], rest: false },
    { day: 17, sets: [52, 26, 26, 26, 22], rest: false },
    { day: 18, sets: [], rest: true },
    { day: 19, sets: [56, 28, 24, 22, 18], rest: false },
    { day: 20, sets: [58, 28, 24, 22, 18], rest: false },
    { day: 21, sets: [60, 26, 24, 24, 20], rest: false },
    { day: 22, sets: [62, 30, 24, 22, 18], rest: false },
    { day: 23, sets: [64, 30, 24, 20, 20], rest: false },
    { day: 24, sets: [], rest: true },
    { day: 25, sets: [68, 30, 24, 22, 20], rest: false },
    { day: 26, sets: [70, 32, 24, 22, 18], rest: false },
    { day: 27, sets: [74, 32, 28, 18, 18], rest: false },
    { day: 28, sets: [76, 32, 24, 20, 20], rest: false },
    { day: 29, sets: [78, 32, 26, 20, 18], rest: false },
    { day: 30, sets: [100], rest: false },
    // Repeat the pattern as needed up to your desired number of days
  ];
  
  // Load completed days from local storage
function loadCompletedDays() {
    const completedDays = JSON.parse(localStorage.getItem("completedDays")) || [];
    completedDays.forEach(day => markDayAsCompleted(day));
  }
  
  // Save completed day to local storage
  function saveCompletedDay(day) {
    const completedDays = JSON.parse(localStorage.getItem("completedDays")) || [];
    if (!completedDays.includes(day)) {
      completedDays.push(day);
      localStorage.setItem("completedDays", JSON.stringify(completedDays));
    }
  }
  
  // Remove completed day from local storage
  function removeCompletedDay(day) {
    let completedDays = JSON.parse(localStorage.getItem("completedDays")) || [];
    completedDays = completedDays.filter(d => d !== day);
    localStorage.setItem("completedDays", JSON.stringify(completedDays));
  }
  
  // Mark a day as completed (visually and in storage)
  function markDayAsCompleted(day) {
    const row = document.getElementById(`day-${day}`);
    if (row) {
      row.classList.add("completed");
    }
  }
  
  // Unmark a day as completed (visually and in storage)
  function unmarkDayAsCompleted(day) {
    const row = document.getElementById(`day-${day}`);
    if (row) {
      row.classList.remove("completed");
    }
  }
  
  // Complete a day's workout
  function completeDay(day) {
    markDayAsCompleted(day);
    saveCompletedDay(day);
  }
  
  // Undo completion of a day's workout
  function undoDay(day) {
    unmarkDayAsCompleted(day);
    removeCompletedDay(day);
  }
  
  // Create the tracker table
  function createTracker() {
    const trackerBody = document.getElementById("tracker-body");
    days.forEach((day) => {
      const row = document.createElement("tr");
      row.classList.add("day-row");
      row.id = `day-${day.day}`;
  
      // Day column
      const dayCell = document.createElement("td");
      dayCell.textContent = `Day ${day.day}`;
      row.appendChild(dayCell);
  
      // Sets or Rest Day column
      const setsCell = document.createElement("td");
      setsCell.textContent = day.rest ? "Rest Day" : day.sets.join(", ");
      row.appendChild(setsCell);
  
      // Actions column with Complete/Undo buttons
      const actionCell = document.createElement("td");
      const completeButton = document.createElement("button");
      completeButton.classList.add("complete-btn");
      completeButton.textContent = "Complete";
      completeButton.onclick = () => completeDay(day.day);
  
      const undoButton = document.createElement("button");
      undoButton.classList.add("undo-btn");
      undoButton.textContent = "Undo";
      undoButton.onclick = () => undoDay(day.day);
  
      actionCell.appendChild(completeButton);
      actionCell.appendChild(undoButton);
      row.appendChild(actionCell);
  
      trackerBody.appendChild(row);
    });
  }
  
  // Initialize the tracker and load completed days
  createTracker();
  loadCompletedDays();