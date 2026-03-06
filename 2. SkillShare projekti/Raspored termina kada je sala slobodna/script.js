
const USERS = [
    { id: 1, name: 'Marko Petrović', color: '#3B82F6' },
    { id: 2, name: 'Ana Jovanović', color: '#10B981' },
    { id: 3, name: 'Stefan Nikolić', color: '#F59E0B' },
    { id: 4, name: 'Milica Stanković', color: '#EF4444' },
    { id: 5, name: 'Nikola Miletić', color: '#8B5CF6' }
];

const DAYS = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja'];
const START_TIME = 6;
const END_TIME = 22;

let activeUserId = 1;
let reservations = {};
let filteredUserId = null;
let currentWeekStart = getCurrentWeekStart();
let history = [];
let isDragging = false;
let dragStartSlot = null;
let selectedSlots = [];

// Utility Functions
function getCurrentWeekStart() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    monday.setDate(today.getDate() + daysToMonday);
    return monday;
}

function generateTimeSlots() {
    const slots = [];
    for (let hour = START_TIME; hour < END_TIME; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
}

function getWeekDates(weekStart) {
    return DAYS.map((dayName, index) => {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + index);
        return {
            name: dayName,
            date: date,
            formatted: `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`
        };
    });
}

function createSlotKey(dayIndex, time) {
    return `${dayIndex}-${time}`;
}

function isToday(date) {
    return new Date().toDateString() === date.toDateString();
}

function getOccupancyStats(dayIndex) {
    const timeSlots = generateTimeSlots();
    const dayReservations = Object.keys(reservations).filter(key => 
        key.startsWith(`${dayIndex}-`) && 
        (!filteredUserId || reservations[key] === filteredUserId)
    );
    return {
        total: timeSlots.length,
        occupied: dayReservations.length,
        percentage: Math.round((dayReservations.length / timeSlots.length) * 100)
    };
}

// Storage Functions
function loadReservations() {
    const saved = localStorage.getItem('weeklyReservations');
    if (saved) {
        try {
            reservations = JSON.parse(saved);
        } catch (error) {
            console.error('Error loading reservations:', error);
            reservations = {};
        }
    }
}

function saveReservations() {
    localStorage.setItem('weeklyReservations', JSON.stringify(reservations));
}

// Toast Functions
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

// Reservation Functions
function toggleReservation(dayIndex, time, isShiftClick = false) {
    const slotKey = createSlotKey(dayIndex, time);
    
    // Save to history
    history.push(JSON.parse(JSON.stringify(reservations)));
    if (history.length > 10) history.shift();
    
    if (isShiftClick && selectedSlots.length > 0) {
        // Range selection
        const timeSlots = generateTimeSlots();
        const currentSlotIndex = timeSlots.indexOf(time);
        const lastSelectedSlot = selectedSlots[selectedSlots.length - 1];
        const lastSlotIndex = timeSlots.indexOf(lastSelectedSlot.split('-')[1]);
        
        const startIndex = Math.min(currentSlotIndex, lastSlotIndex);
        const endIndex = Math.max(currentSlotIndex, lastSlotIndex);
        
        for (let i = startIndex; i <= endIndex; i++) {
            const rangeSlotKey = createSlotKey(dayIndex, timeSlots[i]);
            if (!reservations[rangeSlotKey]) {
                reservations[rangeSlotKey] = activeUserId;
            }
        }
    } else {
        // Normal toggle
        if (reservations[slotKey]) {
            delete reservations[slotKey];
        } else {
            reservations[slotKey] = activeUserId;
        }
    }
    
    saveReservations();
    renderCalendar();
}

// Event Handlers
function handleSlotMouseDown(dayIndex, time, event) {
    event.preventDefault();
    
    if (event.shiftKey) {
        toggleReservation(dayIndex, time, true);
    } else {
        dragStartSlot = { dayIndex, time };
        isDragging = true;
        selectedSlots = [];
    }
}

function handleSlotMouseEnter(dayIndex, time) {
    if (isDragging && dragStartSlot && dragStartSlot.dayIndex === dayIndex) {
        const timeSlots = generateTimeSlots();
        const startIndex = timeSlots.indexOf(dragStartSlot.time);
        const currentIndex = timeSlots.indexOf(time);
        
        const minIndex = Math.min(startIndex, currentIndex);
        const maxIndex = Math.max(startIndex, currentIndex);
        
        selectedSlots = [];
        for (let i = minIndex; i <= maxIndex; i++) {
            selectedSlots.push(createSlotKey(dayIndex, timeSlots[i]));
        }
        renderCalendar();
    }
}

function handleSlotMouseUp() {
    if (isDragging) {
        if (selectedSlots.length > 0) {
            history.push(JSON.parse(JSON.stringify(reservations)));
            if (history.length > 10) history.shift();
            
            selectedSlots.forEach(slotKey => {
                if (!reservations[slotKey]) {
                    reservations[slotKey] = activeUserId;
                }
            });
            
            saveReservations();
        } else if (dragStartSlot) {
            toggleReservation(dragStartSlot.dayIndex, dragStartSlot.time);
        }
        
        isDragging = false;
        dragStartSlot = null;
        selectedSlots = [];
        renderCalendar();
    }
}

// Rendering Functions
function renderUserSelects() {
    const userSelect = document.getElementById('userSelect');
    const filterSelect = document.getElementById('filterSelect');
    
    userSelect.innerHTML = '';
    USERS.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        userSelect.appendChild(option);
    });
    userSelect.value = activeUserId;
    
    // Repopulate filter options (keep existing \"Svi korisnici\")
    const currentOptions = Array.from(filterSelect.options).slice(1);
    currentOptions.forEach(option => option.remove());
    
    USERS.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        filterSelect.appendChild(option);
    });
}

function renderActiveUser() {
    const activeUser = USERS.find(u => u.id === activeUserId);
    document.getElementById('activeUserColor').style.backgroundColor = activeUser.color;
    document.getElementById('activeUserName').textContent = activeUser.name;
}

function renderWeekRange() {
    const weekDates = getWeekDates(currentWeekStart);
    document.getElementById('weekRange').textContent = 
        `Upravljanje rezervacijama prostorija • ${weekDates[0].formatted} - ${weekDates[6].formatted}`;
}

function renderUserLegend() {
    const legend = document.getElementById('userLegend');
    legend.innerHTML = '';
    
    USERS.forEach(user => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        item.innerHTML = `
            <div class=\"legend-color\" style=\"background-color: ${user.color}\"></div>
            <span style=\"font-size: 14px; color: #64748b;\">${user.name}</span>
        `;
        legend.appendChild(item);
    });
}

function renderCalendar() {
    const calendar = document.getElementById('calendar');
    const timeSlots = generateTimeSlots();
    const weekDates = getWeekDates(currentWeekStart);
    
    let html = '';
    
    // Header row
    html += '<div class=\"calendar-header\">';
    html += '<div class=\"header-cell time-header\">🕒</div>';
    
    weekDates.forEach((dayData, dayIndex) => {
        const stats = getOccupancyStats(dayIndex);
        const todayClass = isToday(dayData.date) ? 'today' : '';
        
        html += `
            <div class=\"header-cell day-header ${todayClass}\">
                <div class=\"day-name\">${dayData.name}</div>
                <div class=\"day-date\">${dayData.formatted}</div>
                <div class=\"occupancy-badge\">${stats.occupied}/${stats.total} (${stats.percentage}%)</div>
            </div>
        `;
    });
    html += '</div>';
    
    // Time rows
    timeSlots.forEach(time => {
        html += '<div class=\"time-row\">';
        html += `<div class=\"time-cell\"><div class=\"time-label\">${time}</div></div>`;
        
        weekDates.forEach((dayData, dayIndex) => {
            const slotKey = createSlotKey(dayIndex, time);
            const reservedUserId = reservations[slotKey];
            const reservedUser = USERS.find(u => u.id === reservedUserId);
            const isFiltered = filteredUserId && reservedUserId !== filteredUserId;
            const isSelected = selectedSlots.includes(slotKey);
            const isTodaySlot = isToday(dayData.date);
            
            let slotClasses = ['slot'];
            if (reservedUser) slotClasses.push('reserved');
            if (isSelected) slotClasses.push('selected');
            if (isFiltered) slotClasses.push('filtered');
            if (isTodaySlot) slotClasses.push('today-slot');
            
            const backgroundColor = reservedUser ? reservedUser.color : 'transparent';
            const initials = reservedUser ? reservedUser.name.split(' ').map(n => n[0]).join('') : '';
            
            html += `
                <div class=\"time-cell\">
                    <div class=\"${slotClasses.join(' ')}\" 
                         style=\"background-color: ${backgroundColor}\"
                         data-day=\"${dayIndex}\" 
                         data-time=\"${time}\"
                         role=\"gridcell\"
                         tabindex=\"0\"
                         aria-label=\"${dayData.name} ${dayData.formatted} ${time} ${reservedUser ? `rezervisano za ${reservedUser.name}` : 'slobodno'}\">
                        ${!isFiltered && initials ? initials : ''}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
    });
    
    calendar.innerHTML = html;
    
    // Attach event listeners to slots
    document.querySelectorAll('.slot').forEach(slot => {
        const dayIndex = parseInt(slot.dataset.day);
        const time = slot.dataset.time;
        
        slot.addEventListener('mousedown', (e) => handleSlotMouseDown(dayIndex, time, e));
        slot.addEventListener('mouseenter', () => handleSlotMouseEnter(dayIndex, time));
        
        // Keyboard navigation
        slot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleReservation(dayIndex, time, e.shiftKey);
            }
        });
    });
}

// Navigation Functions
function goToPreviousWeek() {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    renderWeekRange();
    renderCalendar();
}

function goToNextWeek() {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    renderWeekRange();
    renderCalendar();
}

function goToCurrentWeek() {
    currentWeekStart = getCurrentWeekStart();
    renderWeekRange();
    renderCalendar();
}

// Export/Import Functions
function exportData() {
    const data = {
        reservations,
        exportDate: new Date().toISOString(),
        users: USERS
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `raspored-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('Eksport završen - Raspored je uspješno eksportovan.');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.reservations) {
                history.push(JSON.parse(JSON.stringify(reservations)));
                if (history.length > 10) history.shift();
                
                reservations = data.reservations;
                saveReservations();
                renderCalendar();
                showToast('Import završen - Raspored je uspješno importovan.');
            }
        } catch (error) {
            showToast('Greška - Neispravna datoteka za import.', 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function undo() {
    if (history.length > 0) {
        const previousState = history.pop();
        reservations = previousState;
        saveReservations();
        renderCalendar();
        showToast('Vraćeno - Poslednja akcija je poništena.');
    }
}

function clearAll() {
    if (Object.keys(reservations).length === 0) {
        showToast('Nema rezervacija za brisanje.', 'error');
        return;
    }
    
    history.push(JSON.parse(JSON.stringify(reservations)));
    if (history.length > 10) history.shift();
    
    reservations = {};
    saveReservations();
    renderCalendar();
    showToast('Obrisano - Sve rezervacije su obrisane.');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load data and render
    loadReservations();
    renderUserSelects();
    renderActiveUser();
    renderWeekRange();
    renderUserLegend();
    renderCalendar();
    
    // User selection
    document.getElementById('userSelect').addEventListener('change', (e) => {
        activeUserId = parseInt(e.target.value);
        renderActiveUser();
    });
    
    // Filter selection
    document.getElementById('filterSelect').addEventListener('change', (e) => {
        filteredUserId = e.target.value === 'all' ? null : parseInt(e.target.value);
        renderCalendar();
    });
    
    // Navigation buttons
    document.getElementById('prevWeek').addEventListener('click', goToPreviousWeek);
    document.getElementById('nextWeek').addEventListener('click', goToNextWeek);
    document.getElementById('currentWeek').addEventListener('click', goToCurrentWeek);
    
    // Action buttons
    document.getElementById('exportBtn').addEventListener('click', exportData);
    document.getElementById('importFile').addEventListener('change', importData);
    document.getElementById('undoBtn').addEventListener('click', undo);
    document.getElementById('clearBtn').addEventListener('click', clearAll);
    
    // Global mouse up for drag selection
    document.addEventListener('mouseup', handleSlotMouseUp);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            isDragging = false;
            dragStartSlot = null;
            selectedSlots = [];
            renderCalendar();
        }
        
        // Ctrl+Z for undo
        if (e.ctrlKey && e.key === 'z') {
            e.preventDefault();
            undo();
        }
    });
    
    // Update undo button state
    setInterval(() => {
        document.getElementById('undoBtn').disabled = history.length === 0;
    }, 100);
});