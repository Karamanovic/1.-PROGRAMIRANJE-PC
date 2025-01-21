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
  
  document.getElementById("scrollToStopwatch").addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("stopwatch").scrollIntoView({ behavior: "smooth" });
  });
  
  // Scroll to Stopwatch
document.getElementById("scrollToStopwatch").addEventListener("click", function (event) {
  event.preventDefault();
  document.getElementById("stopwatch").scrollIntoView({ behavior: "smooth" });
});

// Fetch completed days from local storage
function getCompletedDays() {
  return JSON.parse(localStorage.getItem("completedDays")) || [];
}

// Find the next uncompleted day
function getNextWorkoutDay() {
  const completedDays = getCompletedDays();
  return days.find((day) => !completedDays.includes(day.day));
}

// Display the current workout day
function displayCurrentWorkout() {
  const currentWorkout = getNextWorkoutDay();
  const workoutDetails = document.getElementById("workout-details");

  if (!currentWorkout) {
    workoutDetails.innerText = "Congratulations! You've completed all the workouts.";
    return;
  }

  if (currentWorkout.rest) {
    workoutDetails.innerHTML = `<strong>Day ${currentWorkout.day}:</strong> Rest day! Take a break and recover.`;
  } else {
    workoutDetails.innerHTML = `
      <strong>Day ${currentWorkout.day}:</strong> Push-ups to do:
      <ul>
        ${currentWorkout.sets
          .map(
            (set, index) => `
          <li class="toggle-set" onclick="toggleSetComplete(this)">
            Set ${index + 1}: ${set} push-ups
          </li>`
          )
          .join("")}
      </ul>
    `;
  }
}

// Toggle set as complete/incomplete
function toggleSetComplete(item) {
  item.classList.toggle("completed");
}

// Initialize Tracker and Current Workout Display
document.addEventListener("DOMContentLoaded", () => {
  displayCurrentWorkout();
  createTracker();
  loadCompletedDays();
});
  
  // Stopwatch Variables
  let [seconds, minutes, hours] = [0, 0, 0];
  let displayTime = document.getElementById("displayTime");
  let timer = null;
  
  // Tracker Functions
  function loadCompletedDays() {
    const completedDays = JSON.parse(localStorage.getItem("completedDays")) || [];
    completedDays.forEach(day => markDayAsCompleted(day));
  }
  
  function saveCompletedDay(day) {
    const completedDays = JSON.parse(localStorage.getItem("completedDays")) || [];
    if (!completedDays.includes(day)) {
      completedDays.push(day);
      localStorage.setItem("completedDays", JSON.stringify(completedDays));
    }
  }
  
  function removeCompletedDay(day) {
    let completedDays = JSON.parse(localStorage.getItem("completedDays")) || [];
    completedDays = completedDays.filter(d => d !== day);
    localStorage.setItem("completedDays", JSON.stringify(completedDays));
  }
  
  function markDayAsCompleted(day) {
    const row = document.getElementById(`day-${day}`);
    if (row) {
      row.classList.add("completed");
    }
  }
  
  function unmarkDayAsCompleted(day) {
    const row = document.getElementById(`day-${day}`);
    if (row) {
      row.classList.remove("completed");
    }
  }
  
  function completeDay(day) {
    markDayAsCompleted(day);
    saveCompletedDay(day);
  }
  
  function undoDay(day) {
    unmarkDayAsCompleted(day);
    removeCompletedDay(day);
  }
  
  function createTracker() {
    const trackerBody = document.getElementById("tracker-body");
    days.forEach((day) => {
      const row = document.createElement("tr");
      row.classList.add("day-row");
      row.id = `day-${day.day}`;
  
      const dayCell = document.createElement("td");
      dayCell.textContent = `Day ${day.day}`;
      row.appendChild(dayCell);
  
      const setsCell = document.createElement("td");
      setsCell.textContent = day.rest ? "Rest Day" : day.sets.join(", ");
      row.appendChild(setsCell);
  
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
  
  // Stopwatch Functions
  function stopwatch() {
    seconds++;
    if (seconds === 60) {
      seconds = 0;
      minutes++;
      if (minutes === 60) {
        minutes = 0;
        hours++;
      }
    }
    const h = hours < 10 ? "0" + hours : hours;
    const m = minutes < 10 ? "0" + minutes : minutes;
    const s = seconds < 10 ? "0" + seconds : seconds;
    displayTime.innerHTML = `${h}:${m}:${s}`;
  }
  
  function watchStart() {
    if (timer !== null) {
      clearInterval(timer);
    }
    timer = setInterval(stopwatch, 1000);
  }
  
  function watchStop() {
    clearInterval(timer);
  }
  
  function watchReset() {
    clearInterval(timer);
    [seconds, minutes, hours] = [0, 0, 0];
    displayTime.innerHTML = "00:00:00";
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
    
    
  function toggleLanguage() {
    const currentLanguage = document.documentElement.lang || "en"; // Ensure this is not declared again
    const newLanguage = currentLanguage === "en" ? "sr" : "en";
  
    // Update the page content with translations
    document.documentElement.lang = newLanguage;
    updateTranslations(newLanguage);
  }

 // Global language variable
let currentLanguage = "en";

// Translation object
const translations = {
  en: {
    welcome: "Welcome to your workout tracker!",
    note: "Note: After completing a set, press complete in the table.",
    restDay: "Rest Day",
    complete: "Complete",
    undo: "Undo",
    pushUps: "push-ups to do",
    set: "Set",
    congratulations: "Congratulations! You've completed all the workouts.",
    restMessage: "Rest day! Take a break and recover.",
    title: "100 Push-Ups Challenge Tracker",
    mark: "Complete each day's push-up sets, rest every 6th day. Click 'Complete' to mark a day, and 'Undo' to reset.",
    restNote: "REST 60 SECONDS BETWEEN EACH SET (LONGER IF REQUIRED)",
    scrollNote: "Scroll down or click here to go to Stopwatch and Current Workout Day.",
    currentWorkout: "Current Workout Day",
    day: "Day",
    pushUpsToDo: "Push-ups to do",
    pushUps: "push-ups",
    sets: "Sets",  
    actions: "Actions", 
    welcomeMessage: "100 Push-Ups Challenge Tracker",  // Add translation
    markText: "Complete each day's push-up sets, rest every 6th day. Click 'Complete' to mark a day, and 'Undo' to reset.",  // Add translation
    restNoteText: "REST 60 SECONDS BETWEEN EACH SET (LONGER IF REQUIRED)",  // Add translation
    scrollNoteText: "Scroll down or click here to go to Stopwatch and Current Workout Day.",  // Add translation
    scrollText: "Scroll down or ",
    linkText: "click here",
    scrollEnd: " to go to Stopwatch and Current Workout Day.",
    stopwatchText: "Stopwatch",
    motivated: "Feeling unmotivated? Try using some of the following",
    
  },
  sr: {
    welcome: "Dobrodošli u vaš pratilac vežbanja!",
    note: "Napomena: Nakon što završite set, pritisnite 'Završeno' da biste ga označili kao završen.",
    restDay: "Dan odmora",
    complete: "Završeno",
    undo: "Poništi",
    pushUps: "sklekova za uraditi",
    set: "Serija",
    congratulations: "Čestitamo! Završili ste sve treninge.",
    restMessage: "Dan odmora! Odmorite se i oporavite.",
    title: "100 Push-Ups Challenge Tracker",
    mark: "Završite setove sklekova svakog dana, odmorite svaki 6. dan. Pritisnite 'Završi' da označite dan kao završen i 'Poništi' da resetujete.",
    restNote: "ODMARATE 60 SEKUNDI IZMEĐU SVAKOG SETA (DUŽE AKO JE POTREBNO)",
    scrollNote: "Pomaknite se dole ili kliknite ovde da idete na štopericu i trenutni dan treninga.",
    currentWorkout: "Trenutni dan treninga",
    day: "Dan",
    pushUpsToDo: "Sklekovi za uraditi",
    pushUps: "Sklekovi",
    sets: "Setovi",  
    actions: "Akcije",
    welcomeMessage: "100 Sklekova Izazov",  // Add translation
    markText: "Završite setove sklekova svakog dana, odmorite svaki 6. dan. Pritisnite 'Završi' da označite dan kao završen i 'Poništi' da resetujete.",  // Add translation
    restNoteText: "ODMORITE 60 SEKUNDI IZMEĐU SVAKOG SETA (DUŽE AKO JE POTREBNO)",  // Add translation
    scrollNoteText: "Pomaknite se dole ili kliknite ovde da idete na štopericu i trenutni dan treninga.",  // Add translation  
    scrollText: "Skrolaj dole ili ",
    linkText: "kliknite ovde",
    scrollEnd: " da idete na štopericu i trenutni dan treninga.",
    stopwatchText: "Štoperica",
    motivated: "Nemate motivaciju? Probajte sledeću plej listu!",
   
    },
};

// Toggle language function
function toggleLanguage() {
  currentLanguage = currentLanguage === "en" ? "sr" : "en";
  document.documentElement.lang = currentLanguage;
  updateTranslations();
}

function updateTranslations() {
   // Update the header texts
  document.getElementById("welcome-message").textContent =
  translations[currentLanguage].welcomeMessage;

document.getElementById("mark").textContent =
  translations[currentLanguage].markText;

document.getElementById("rest-note").textContent =
  translations[currentLanguage].restNoteText;

document.getElementById("scrollText").textContent =
  translations[currentLanguage].scrollText;

  document.getElementById("scrollToStopwatch").textContent = 
  translations[currentLanguage].linkText;

  document.getElementById("scrollEnd").textContent = 
  translations[currentLanguage].scrollEnd;  

  document.getElementById("currentWorkout").textContent = 
  translations[currentLanguage].currentWorkout; 

  document.getElementById("stopwatchText").textContent = 
  translations[currentLanguage].stopwatchText;  

  
  
  // Update table headers 
   document.getElementById("day-header").textContent = translations[currentLanguage].day;
   document.getElementById("sets-header").textContent = translations[currentLanguage].sets;
   document.getElementById("actions-header").textContent = translations[currentLanguage].actions;
  
  document.getElementById("note-text").textContent =
    translations[currentLanguage].note;

  updateTracker(); // Ensure the tracker is updated with the current language
}

let completedDays = JSON.parse(localStorage.getItem("completedDays")) || [];

// Update the tracker table
function updateTracker() {
  const trackerBody = document.getElementById("tracker-body");
  trackerBody.innerHTML = ""; // Clear existing content
  
  days.forEach((day) => {
    const row = document.createElement("tr");
    row.classList.add("day-row");
    row.id = `day-${day.day}`;
    
      // Mark the row as completed if the day is in the completedDays list
      if (completedDays.includes(day.day)) {
        row.classList.add("completed");
    }

    const dayCell = document.createElement("td");
    dayCell.textContent = `${translations[currentLanguage].day} ${day.day}`;  // Use translated Day
    row.appendChild(dayCell);

    const setsCell = document.createElement("td");
    setsCell.textContent = day.rest
      ? translations[currentLanguage].restDay
      : day.sets.join(", ");
    row.appendChild(setsCell);

    const actionCell = document.createElement("td");
    const completeButton = document.createElement("button");
    completeButton.classList.add("complete-btn");
    completeButton.textContent = translations[currentLanguage].complete;
    completeButton.onclick = () => completeDay(day.day);

    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-btn");
    undoButton.textContent = translations[currentLanguage].undo;
    undoButton.onclick = () => undoDay(day.day);

    actionCell.appendChild(completeButton);
    actionCell.appendChild(undoButton);
    row.appendChild(actionCell);

    trackerBody.appendChild(row);
  });
}

function completeDay(day) {
  // Add the day to completedDays array and save it in localStorage
  if (!completedDays.includes(day)) {
      completedDays.push(day);
      localStorage.setItem("completedDays", JSON.stringify(completedDays));
  }
  updateTracker(); // Re-render the tracker
}

function undoDay(day) {
  // Remove the day from completedDays array and save it in localStorage
  completedDays = completedDays.filter(d => d !== day);
  localStorage.setItem("completedDays", JSON.stringify(completedDays));
  updateTracker(); // Re-render the tracker
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  updateTranslations(); // Set the initial language
  createTracker(); // Create the tracker table
  loadCompletedDays(); // Load completed workout days

  const toggleButton = document.getElementById("language-toggle-btn");
  toggleButton.addEventListener("click", toggleLanguage);
});
// Second Table for Current Workout Day
function updateCurrentWorkout() {
  const currentWorkoutTable = document.getElementById("current-workout-table");

  // Clear previous content
  currentWorkoutTable.innerHTML = "";

  // Add the content for Current Workout Day (example with day 2)
  const row = document.createElement("tr");

  const dayCell = document.createElement("td");
  dayCell.textContent = `${translations[currentLanguage].day} 2`;  // Example: Day 2
  row.appendChild(dayCell);

  const pushUpsToDoCell = document.createElement("td");
  pushUpsToDoCell.textContent = `${translations[currentLanguage].pushUpsToDo}: 10`;  // Example: Push-ups to do: 10
  row.appendChild(pushUpsToDoCell);

  const pushUpsCell = document.createElement("td");
  pushUpsCell.textContent = `${translations[currentLanguage].pushUps}: 50`;  // Example: Push-ups: 50
  row.appendChild(pushUpsCell);

  currentWorkoutTable.appendChild(row);
}