const STORAGE_KEY = 'my-discipline-system-v1';

const els = {
  overallProgress: document.getElementById('overallProgress'),
  progressRing: document.getElementById('progressRing'),
  ringValue: document.getElementById('ringValue'),
  streakValue: document.getElementById('streakValue'),
  todayCompleted: document.getElementById('todayCompleted'),
  monthProgress: document.getElementById('monthProgress'),
  bestHabit: document.getElementById('bestHabit'),
  focusQuote: document.getElementById('focusQuote'),
  todayLabel: document.getElementById('todayLabel'),
  nonNegotiables: document.getElementById('nonNegotiables'),
  otherHabits: document.getElementById('otherHabits'),
  addNonBtn: document.getElementById('addNonBtn'),
  addOtherBtn: document.getElementById('addOtherBtn'),
  taskForm: document.getElementById('taskForm'),
  taskInput: document.getElementById('taskInput'),
  taskList: document.getElementById('taskList'),
  clearTasks: document.getElementById('clearTasks'),
  reflection: document.getElementById('reflection'),
  noteStatus: document.getElementById('noteStatus'),
  themeBtn: document.getElementById('themeBtn'),
  exportBtn: document.getElementById('exportBtn'),
  importBtn: document.getElementById('importBtn'),
  importFile: document.getElementById('importFile'),
  manageBtn: document.getElementById('manageBtn'),
  resetBtn: document.getElementById('resetBtn'),
  habitDialog: document.getElementById('habitDialog'),
  habitForm: document.getElementById('habitForm'),
  dialogTitle: document.getElementById('dialogTitle'),
  editingHabitId: document.getElementById('editingHabitId'),
  habitName: document.getElementById('habitName'),
  habitCategory: document.getElementById('habitCategory'),
  habitIcon: document.getElementById('habitIcon'),
  closeHabit: document.getElementById('closeHabit'),
  cancelHabit: document.getElementById('cancelHabit'),
  confirmDialog: document.getElementById('confirmDialog'),
  cancelReset: document.getElementById('cancelReset'),
  confirmReset: document.getElementById('confirmReset'),
  trackerHead: document.getElementById('trackerHead'),
  trackerBody: document.getElementById('trackerBody'),
  monthTitle: document.getElementById('monthTitle'),
  prevMonth: document.getElementById('prevMonth'),
  nextMonth: document.getElementById('nextMonth'),
  currentMonthBtn: document.getElementById('currentMonthBtn')
};

const defaultState = {
  habits: [
    { id: 'habit-workout', name: 'Workout', icon: '🏋️', category: 'nonNegotiable', completions: {} },
    { id: 'habit-meditation', name: 'Meditation', icon: '🧘', category: 'nonNegotiable', completions: {} },
    { id: 'habit-read', name: 'Read', icon: '📚', category: 'other', completions: {} },
    { id: 'habit-focus', name: 'Deep work', icon: '💻', category: 'other', completions: {} }
  ],
  tasks: [
    { id: 'task-1', text: 'Plan the top 3 priorities for today', done: false },
    { id: 'task-2', text: 'Do one hard thing before noon', done: false }
  ],
  reflection: '',
  theme: 'light',
  monthCursor: getMonthCursorKey(new Date())
};

let state = loadState();

function createId(prefix = 'id') {
  if (window.crypto && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}


function getMonthCursorKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function parseMonthCursor(value) {
  const [year, month] = String(value || getMonthCursorKey(new Date())).split('-').map(Number);
  const safeMonth = Number.isFinite(month) && month >= 1 && month <= 12 ? month - 1 : new Date().getMonth();
  return new Date(year || new Date().getFullYear(), safeMonth, 1);
}

function safeJsonParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

function loadState() {
  const saved = safeJsonParse(localStorage.getItem(STORAGE_KEY), null);
  return normalizeState(saved);
}

function normalizeState(raw) {
  const base = JSON.parse(JSON.stringify(defaultState));
  if (!raw || typeof raw !== 'object') {
    return base;
  }

  base.habits = Array.isArray(raw.habits) && raw.habits.length
    ? raw.habits.map(normalizeHabit)
    : base.habits;

  base.tasks = Array.isArray(raw.tasks)
    ? raw.tasks.map(normalizeTask).filter(Boolean)
    : base.tasks;

  base.reflection = typeof raw.reflection === 'string' ? raw.reflection : '';
  base.theme = raw.theme === 'dark' ? 'dark' : 'light';
  base.monthCursor = typeof raw.monthCursor === 'string' && /^\d{4}-\d{2}$/.test(raw.monthCursor)
    ? raw.monthCursor
    : getMonthCursorKey(new Date());

  return base;
}

function normalizeHabit(habit) {
  if (!habit || typeof habit !== 'object') {
    return null;
  }

  return {
    id: String(habit.id || createId('habit')),
    name: String(habit.name || 'New habit').trim() || 'New habit',
    icon: String(habit.icon || '✓').trim() || '✓',
    category: habit.category === 'other' ? 'other' : 'nonNegotiable',
    completions: habit.completions && typeof habit.completions === 'object' ? habit.completions : {}
  };
}

function normalizeTask(task) {
  if (!task || typeof task !== 'object') {
    return null;
  }

  const text = String(task.text || '').trim();
  if (!text) {
    return null;
  }

  return {
    id: String(task.id || createId('task')),
    text,
    done: Boolean(task.done)
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function sameDay(first, second) {
  return first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();
}

function getTodayKey() {
  return formatDateKey(new Date());
}

function getHabitCompletionCount(habit, dateKey) {
  return habit && habit.completions && habit.completions[dateKey] ? 1 : 0;
}

function getTotalHabitCount() {
  return state.habits.length;
}

function getCompletedTodayCount() {
  const todayKey = getTodayKey();
  return state.habits.reduce((count, habit) => count + getHabitCompletionCount(habit, todayKey), 0);
}

function getOverallProgress() {
  const total = getTotalHabitCount();
  if (!total) return 0;
  return Math.round((getCompletedTodayCount() / total) * 100);
}

function getCurrentStreak() {
  const today = new Date();
  let streak = 0;

  for (let offset = 0; offset < 365; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    const dayKey = formatDateKey(date);
    const dailyTotal = state.habits.reduce((sum, habit) => sum + getHabitCompletionCount(habit, dayKey), 0);

    if (dailyTotal > 0) {
      streak += 1;
    } else if (offset === 0) {
      let previous = new Date(today);
      previous.setDate(today.getDate() - 1);
      const previousKey = formatDateKey(previous);
      const previousTotal = state.habits.reduce((sum, habit) => sum + getHabitCompletionCount(habit, previousKey), 0);
      if (previousTotal > 0) {
        streak = 1;
        for (let j = 1; j < 365; j += 1) {
          const d = new Date(today);
          d.setDate(today.getDate() - (j + 1));
          const k = formatDateKey(d);
          const total = state.habits.reduce((sum, habit) => sum + getHabitCompletionCount(habit, k), 0);
          if (total > 0) {
            streak += 1;
          } else {
            break;
          }
        }
      }
      break;
    } else {
      break;
    }
  }

  return streak;
}

function getMonthProgress() {
  const monthCursor = parseMonthCursor(state.monthCursor);
  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let completedDays = 0;

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const key = formatDateKey(date);
    const total = state.habits.reduce((sum, habit) => sum + getHabitCompletionCount(habit, key), 0);
    if (total > 0) {
      completedDays += 1;
    }
  }

  return daysInMonth ? Math.round((completedDays / daysInMonth) * 100) : 0;
}

function getBestHabit() {
  const monthCursor = parseMonthCursor(state.monthCursor);
  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let best = { name: '—', count: -1 };

  state.habits.forEach((habit) => {
    let count = 0;

    for (let d = 1; d <= daysInMonth; d += 1) {
      const date = new Date(year, month, d);
      const key = formatDateKey(date);
      if (habit.completions[key]) {
        count += 1;
      }
    }

    if (count > best.count) {
      best = { name: habit.name, count };
    }
  });

  return best.count >= 0 ? best.name : '—';
}

function renderQuote() {
  const today = new Date();
  const formatted = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }).format(today);
  els.todayLabel.textContent = formatted;

  const quoteList = [
    'Be the person you want to become.',
    'Discipline compounds.',
    'Small wins build a strong life.',
    'Your future is built in the present.',
    'Consistency beats intensity.'
  ];

  const index = today.getDate() % quoteList.length;
  els.focusQuote.textContent = quoteList[index];
}

function renderStats() {
  const progress = getOverallProgress();
  const monthProgress = getMonthProgress();

  els.overallProgress.textContent = `${progress}%`;
  els.ringValue.textContent = `${progress}%`;
  els.progressRing.style.setProperty('--p', `${progress}%`);

  els.streakValue.textContent = `${getCurrentStreak()} days`;
  els.todayCompleted.textContent = `${getCompletedTodayCount()} / ${getTotalHabitCount()}`;
  els.monthProgress.textContent = `${monthProgress}%`;
  els.bestHabit.textContent = getBestHabit();
}

function renderHabitList() {
  const renderGroup = (category, container) => {
    const habits = state.habits.filter((habit) => habit.category === category);

    if (!habits.length) {
      container.innerHTML = '<div class="habit-card"><div class="habit-icon">✦</div><div><h3>No habits yet</h3><p>Add your first routine to get started.</p></div></div>';
      return;
    }

    container.innerHTML = habits.map((habit) => {
      const todayKey = getTodayKey();
      const doneToday = Boolean(habit.completions[todayKey]);
      const monthCount = getMonthHabitCount(habit);
      const totalDays = getDaysInCurrentMonth();
      const cardStatus = doneToday ? 'done' : '';

      return `
        <article class="habit-card" data-habit-id="${habit.id}">
          <div class="habit-icon">${habit.icon || '✓'}</div>
          <div>
            <h3>${escapeHTML(habit.name)}</h3>
            <p>${monthCount}/${totalDays} days this month</p>
          </div>
          <div class="habit-actions">
            <button class="check-today ${cardStatus}" type="button" data-action="toggle-habit" data-id="${habit.id}" aria-label="Toggle ${escapeHTML(habit.name)} today">${doneToday ? '✓' : '○'}</button>
            <button class="mini-btn" type="button" data-action="edit-habit" data-id="${habit.id}" aria-label="Edit ${escapeHTML(habit.name)}">✎</button>
            <button class="mini-btn" type="button" data-action="delete-habit" data-id="${habit.id}" aria-label="Delete ${escapeHTML(habit.name)}">🗑</button>
          </div>
        </article>
      `;
    }).join('');
  };

  renderGroup('nonNegotiable', els.nonNegotiables);
  renderGroup('other', els.otherHabits);
}

function getDaysInCurrentMonth() {
  const monthCursor = parseMonthCursor(state.monthCursor);
  return new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 0).getDate();
}

function getMonthHabitCount(habit) {
  const monthCursor = parseMonthCursor(state.monthCursor);
  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  let count = 0;

  for (let d = 1; d <= days; d += 1) {
    const key = formatDateKey(new Date(year, month, d));
    if (habit.completions[key]) {
      count += 1;
    }
  }

  return count;
}

function toggleHabitCompletion(habitId, dateKey = getTodayKey()) {
  const habit = state.habits.find((item) => item.id === habitId);
  if (!habit) return;

  if (!habit.completions[dateKey]) {
    habit.completions[dateKey] = true;
  } else {
    delete habit.completions[dateKey];
  }

  saveState();
  renderAll();
}

function openHabitDialog(mode, habitId = null) {
  const habit = state.habits.find((item) => item.id === habitId);
  els.habitForm.reset();
  els.editingHabitId.value = habit ? habit.id : '';
  els.habitName.value = habit ? habit.name : '';
  els.habitCategory.value = habit ? habit.category : 'nonNegotiable';
  els.habitIcon.value = habit ? habit.icon : '✓';
  els.dialogTitle.textContent = habit ? 'Edit habit' : 'Add habit';

  if (typeof els.habitDialog.showModal === 'function') {
    els.habitDialog.showModal();
  } else {
    els.habitDialog.setAttribute('open', 'open');
  }
}

function closeHabitDialog() {
  els.habitForm.reset();
  els.habitDialog.close();
}

function addOrUpdateHabit(event) {
  event.preventDefault();
  const name = els.habitName.value.trim();
  const category = els.habitCategory.value;
  const icon = els.habitIcon.value.trim() || '✓';
  const editingId = els.editingHabitId.value;

  if (!name) {
    els.habitName.focus();
    return;
  }

  if (editingId) {
    const habit = state.habits.find((item) => item.id === editingId);
    if (habit) {
      habit.name = name;
      habit.category = category;
      habit.icon = icon.slice(0, 3);
    }
  } else {
    state.habits.push({
      id: createId('habit'),
      name,
      category,
      icon: icon.slice(0, 3),
      completions: {}
    });
  }

  saveState();
  closeHabitDialog();
  renderAll();
}

function deleteHabit(habitId) {
  state.habits = state.habits.filter((habit) => habit.id !== habitId);
  saveState();
  renderAll();
}

function renderTasks() {
  if (!state.tasks.length) {
    els.taskList.innerHTML = '<li class="task-item"><span>No tasks yet</span></li>';
    return;
  }

  els.taskList.innerHTML = state.tasks.map((task) => `
    <li class="task-item ${task.done ? 'done' : ''}">
      <input type="checkbox" data-action="toggle-task" data-id="${task.id}" ${task.done ? 'checked' : ''}>
      <span>${escapeHTML(task.text)}</span>
      <button class="task-delete" type="button" data-action="delete-task" data-id="${task.id}">×</button>
    </li>
  `).join('');
}

function addTask(event) {
  event.preventDefault();
  const value = els.taskInput.value.trim();
  if (!value) {
    els.taskInput.focus();
    return;
  }

  state.tasks.push({ id: createId('task'), text: value, done: false });
  els.taskInput.value = '';
  saveState();
  renderAll();
}

function toggleTask(taskId) {
  const task = state.tasks.find((item) => item.id === taskId);
  if (!task) return;
  task.done = !task.done;
  saveState();
  renderTasks();
  renderStats();
}

function deleteTask(taskId) {
  state.tasks = state.tasks.filter((task) => task.id !== taskId);
  saveState();
  renderTasks();
}

function clearCompletedTasks() {
  state.tasks = state.tasks.filter((task) => !task.done);
  saveState();
  renderTasks();
}

function renderReflection() {
  els.reflection.value = state.reflection;
}

function handleReflectionInput() {
  state.reflection = els.reflection.value;
  els.noteStatus.textContent = 'Saving...';
  saveState();

  window.clearTimeout(handleReflectionInput.timeoutId);
  handleReflectionInput.timeoutId = window.setTimeout(() => {
    els.noteStatus.textContent = 'Saved automatically';
  }, 350);
}

function bindTheme() {
  const dark = state.theme === 'dark';
  document.body.classList.toggle('dark-mode', dark);
  els.themeBtn.textContent = dark ? '☀' : '☾';
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  saveState();
  bindTheme();
}

function exportData() {
  const payload = JSON.stringify(state, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'my-discipline-system-export.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importData(file) {
  if (!file) return;
  const fileReader = new FileReader();

  fileReader.onload = (event) => {
    try {
      const parsed = safeJsonParse(event.target.result, null);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid file contents');
      }
      state = normalizeState(parsed);
      saveState();
      renderAll();
    } catch (error) {
      window.alert('Could not import that file. Please use a valid My Discipline System export.');
    } finally {
      els.importFile.value = '';
    }
  };

  fileReader.readAsText(file);
}

function resetAllData() {
  state = JSON.parse(JSON.stringify(defaultState));
  saveState();
  renderAll();
  els.confirmDialog.close();
}

function renderTracker() {
  const monthCursor = parseMonthCursor(state.monthCursor);
  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  els.monthTitle.textContent = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(monthCursor);

  let headHTML = '<tr><th class="habit-col">Habit</th>';
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const isToday = sameDay(date, today);
    headHTML += `<th class="${isToday ? 'today' : ''}">${day}</th>`;
  }
  headHTML += '</tr>';
  els.trackerHead.innerHTML = headHTML;

  const rows = state.habits.map((habit) => {
    let rowHTML = `<tr><td class="habit-name">${habit.icon || '✓'} ${escapeHTML(habit.name)}</td>`;

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const key = formatDateKey(date);
      const isDone = Boolean(habit.completions[key]);
      const isToday = sameDay(date, today);
      const classes = ['day'];
      if (isDone) classes.push('done');
      if (isToday) classes.push('today');

      rowHTML += `<td class="${classes.join(' ')}" data-action="toggle-date" data-habit-id="${habit.id}" data-date="${key}" title="${habit.name} on ${new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)}">${isDone ? '✓' : ''}</td>`;
    }

    rowHTML += '</tr>';
    return rowHTML;
  }).join('');

  els.trackerBody.innerHTML = rows;
}

function changeMonth(offset) {
  const current = parseMonthCursor(state.monthCursor);
  current.setMonth(current.getMonth() + offset);
  state.monthCursor = getMonthCursorKey(current);
  saveState();
  renderTracker();
  renderStats();
  renderHabitList();
}

function resetToCurrentMonth() {
  state.monthCursor = getMonthCursorKey(new Date());
  saveState();
  renderTracker();
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function handleTrackerClick(event) {
  const cell = event.target.closest('[data-action="toggle-date"]');
  if (!cell) return;

  const { habitId, date } = cell.dataset;
  toggleHabitCompletion(habitId, date);
}

function handleHabitListClick(event) {
  const actionEl = event.target.closest('[data-action]');
  if (!actionEl) return;

  const { action, id } = actionEl.dataset;

  if (action === 'toggle-habit') {
    toggleHabitCompletion(id);
  }

  if (action === 'edit-habit') {
    openHabitDialog('edit', id);
  }

  if (action === 'delete-habit') {
    deleteHabit(id);
  }
}

function handleTaskListClick(event) {
  const actionEl = event.target.closest('[data-action]');
  if (!actionEl) return;

  const { action, id } = actionEl.dataset;

  if (action === 'toggle-task') {
    toggleTask(id);
  }

  if (action === 'delete-task') {
    deleteTask(id);
  }
}

function renderAll() {
  bindTheme();
  renderQuote();
  renderStats();
  renderHabitList();
  renderTasks();
  renderReflection();
  renderTracker();
}

function setupEvents() {
  els.addNonBtn.addEventListener('click', () => openHabitDialog('add', null));
  els.addOtherBtn.addEventListener('click', () => openHabitDialog('add', null));
  els.habitForm.addEventListener('submit', addOrUpdateHabit);
  els.closeHabit.addEventListener('click', closeHabitDialog);
  els.cancelHabit.addEventListener('click', closeHabitDialog);
  els.taskForm.addEventListener('submit', addTask);
  els.clearTasks.addEventListener('click', clearCompletedTasks);
  els.themeBtn.addEventListener('click', toggleTheme);
  els.exportBtn.addEventListener('click', exportData);
  els.importBtn.addEventListener('click', () => els.importFile.click());
  els.importFile.addEventListener('change', (event) => importData(event.target.files[0]));
  els.manageBtn.addEventListener('click', () => {
    document.querySelector('.section-head')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    openHabitDialog('add', null);
  });
  els.resetBtn.addEventListener('click', () => {
    if (typeof els.confirmDialog.showModal === 'function') {
      els.confirmDialog.showModal();
    } else {
      els.confirmDialog.setAttribute('open', 'open');
    }
  });
  els.cancelReset.addEventListener('click', () => els.confirmDialog.close());
  els.confirmReset.addEventListener('click', resetAllData);
  els.reflection.addEventListener('input', handleReflectionInput);
  els.trackerBody.addEventListener('click', handleTrackerClick);
  els.nonNegotiables.addEventListener('click', handleHabitListClick);
  els.otherHabits.addEventListener('click', handleHabitListClick);
  els.taskList.addEventListener('click', handleTaskListClick);
  els.taskList.addEventListener('change', (event) => {
    const input = event.target.closest('[data-action="toggle-task"]');
    if (input) {
      toggleTask(input.dataset.id);
    }
  });
  els.prevMonth.addEventListener('click', () => changeMonth(-1));
  els.nextMonth.addEventListener('click', () => changeMonth(1));
  els.currentMonthBtn.addEventListener('click', resetToCurrentMonth);
}

setupEvents();
renderAll();

/* Back to top button behavior */
function setupBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const getScrollTop = () => window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

  const toggle = () => {
    if (getScrollTop() > 120) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  };

  window.addEventListener('scroll', toggle, { passive: true });
  // initial state
  toggle();

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    // Try scrolling the document and a few common scrollable containers
    try {
      const docEl = document.scrollingElement || document.documentElement || document.body;
      docEl.scrollTo({ top: 0, behavior: 'smooth' });

      const candidates = [document.body, document.documentElement, document.querySelector('.app-shell'), document.querySelector('.container'), document.querySelector('.tracker-scroll')];
      candidates.forEach((el) => {
        if (!el) return;
        try {
          if (el.scrollHeight > el.clientHeight || el.scrollTop > 0) {
            el.scrollTo({ top: 0, behavior: 'smooth' });
          }
        } catch (err) {
          /* ignore non-scrollable elements */
        }
      });
    } catch (err) {
      window.scrollTo(0, 0);
    }

    btn.blur();
  });

  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
}

setupBackToTop();
