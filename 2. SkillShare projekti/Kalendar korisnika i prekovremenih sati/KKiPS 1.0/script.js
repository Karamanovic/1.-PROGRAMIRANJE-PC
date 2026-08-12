const STORAGE_KEY = 'overtime-users-v1';
const MONTHS = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Juni', 'Juli', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'];
let users = loadUsers();
let activeUserId = null;
let chartInstances = { users: null, months: null };
let activeTheme = localStorage.getItem('overtime-theme') || 'light';

document.addEventListener('DOMContentLoaded', init);

function init() {
  applyTheme(activeTheme);
  bindEvents();
  setDefaultEntryValues();
  render();
}

function bindEvents() {
  document.querySelector('nav').addEventListener('click', (event) => {
    const button = event.target.closest('button[data-page]');
    if (!button) return;
    switchPage(button.dataset.page);
  });

  document.getElementById('userForm').addEventListener('submit', handleUserSubmit);
  document.getElementById('usersContainer').addEventListener('click', handleUserActions);
  document.getElementById('hoursForm').addEventListener('submit', handleHoursSubmit);
  document.getElementById('exportJson').addEventListener('click', exportJson);
  document.getElementById('importJson').addEventListener('click', () => document.getElementById('jsonFile').click());
  document.getElementById('jsonFile').addEventListener('change', importJson);
  document.getElementById('exportExcel').addEventListener('click', exportExcel);
  document.getElementById('importExcel').addEventListener('click', () => document.getElementById('excelFile').click());
  document.getElementById('excelFile').addEventListener('change', importExcel);
  document.getElementById('toggleTheme').addEventListener('click', toggleTheme);

  const historyDialog = document.getElementById('historyDialog');
  const hoursDialog = document.getElementById('hoursDialog');

  historyDialog.addEventListener('close', () => {
    document.getElementById('historyBody').innerHTML = '';
  });

  hoursDialog.addEventListener('close', () => {
    document.getElementById('hoursForm').reset();
    setDefaultEntryValues();
    activeUserId = null;
  });
}

function switchPage(page) {
  document.querySelectorAll('.page').forEach((section) => section.classList.toggle('active', section.id === page));
  document.querySelectorAll('nav button').forEach((button) => button.classList.toggle('active', button.dataset.page === page));
}

function render() {
  renderDashboard();
  renderUsers();
  renderStats();
}

function renderDashboard() {
  const totalUsers = users.length;
  const totalOvertime = users.reduce((sum, user) => sum + calculateTotalAddedHours(user), 0);
  const tableBody = document.getElementById('dashboardTableBody');

  document.getElementById('totalUsers').textContent = totalUsers;
  document.getElementById('totalHours').textContent = `${formatHours(totalOvertime)} h`;

  if (!tableBody) return;

  tableBody.innerHTML = '';
  if (!users.length) {
    tableBody.innerHTML = '<tr><td colspan="2">Nema korisnika.</td></tr>';
    return;
  }

  users.forEach((user) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${escapeHtml(user.name)}</td>
      <td>${formatHours(calculateTotalAddedHours(user))} h</td>
    `;
    tableBody.appendChild(row);
  });
}

function renderUsers() {
  const container = document.getElementById('usersContainer');
  container.innerHTML = '';

  if (!users.length) {
    container.innerHTML = '<div class="empty-state">Nema dodanih korisnika. Počni od dodavanja prvog korisnika.</div>';
    return;
  }

  const template = document.getElementById('userCardTemplate');

  users.forEach((user) => {
    const card = template.content.firstElementChild.cloneNode(true);
    card.dataset.userId = user.id;
    card.querySelector('.name').textContent = user.name;
    card.querySelector('.balance').textContent = `${formatHours(calculateBalance(user))} h`;
    container.appendChild(card);
  });
}

function renderStats() {
  const usersChart = document.getElementById('usersChart');
  const monthsChart = document.getElementById('monthsChart');
  let statsSummary = document.getElementById('statsSummary');

  if (!statsSummary) {
    const summary = document.createElement('div');
    summary.id = 'statsSummary';
    summary.className = 'summary-card';
    document.getElementById('stats').appendChild(summary);
    statsSummary = document.getElementById('statsSummary');
  }

  const userLabels = users.map((user) => user.name || 'Bez imena');
  const userData = users.map((user) => calculateBalance(user));
  const monthTotals = getMonthTotals();
  const monthLabels = Object.keys(monthTotals);
  const monthData = monthLabels.map((month) => monthTotals[month]);

  buildChart('usersChart', 'bar', {
    labels: userLabels,
    datasets: [{
      label: 'Ukupan broj sati po korisniku',
      data: userData,
      backgroundColor: '#1976d2',
      borderRadius: 6
    }]
  }, chartInstances.users);

  buildChart('monthsChart', 'bar', {
    labels: monthLabels,
    datasets: [{
      label: 'Ukupan broj sati po mjesecu',
      data: monthData,
      backgroundColor: '#2e7d32',
      borderRadius: 6
    }]
  }, chartInstances.months);

  statsSummary.innerHTML = `
    <h3>Pregled po korisnicima</h3>
    <ul>
      ${users.length ? users.map((user) => `<li><strong>${escapeHtml(user.name)}</strong> — ${formatHours(calculateBalance(user))} h</li>`).join('') : '<li>Nema korisnika</li>'}
    </ul>
    <h3>Pregled po mjesecima</h3>
    <ul>
      ${monthLabels.length ? monthLabels.map((month) => `<li><strong>${month}</strong> — ${formatHours(monthTotals[month])} h</li>`).join('') : '<li>Nema podataka</li>'}
    </ul>
  `;
}

function buildChart(canvasId, type, data, instanceRef) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  if (instanceRef) {
    instanceRef.destroy();
  }

  instanceRef = new Chart(canvas.getContext('2d'), {
    type,
    data: {
      labels: data.labels,
      datasets: data.datasets
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => `${value} h`
          }
        }
      }
    }
  });

  if (canvasId === 'usersChart') {
    chartInstances.users = instanceRef;
  } else {
    chartInstances.months = instanceRef;
  }
}

function handleUserSubmit(event) {
  event.preventDefault();
  const input = document.getElementById('userName');
  const name = input.value.trim();

  if (!name) return;

  users.unshift({
    id: `user-${Date.now()}`,
    name,
    entries: []
  });

  saveUsers();
  render();
  input.value = '';
}

function handleUserActions(event) {
  const button = event.target.closest('button');
  if (!button) return;

  const card = button.closest('.user-card');
  if (!card) return;

  const user = users.find((item) => item.id === card.dataset.userId);
  if (!user) return;

  if (button.classList.contains('addHours')) {
    openHoursDialog(user.id, 'add');
  } else if (button.classList.contains('removeHours')) {
    openHoursDialog(user.id, 'subtract');
  } else if (button.classList.contains('historyBtn')) {
    openHistoryDialog(user.id);
  } else if (button.classList.contains('deleteBtn')) {
    if (confirm(`Obrisati korisnika ${user.name}?`)) {
      users = users.filter((item) => item.id !== user.id);
      saveUsers();
      render();
    }
  }
}

function openHoursDialog(userId, type) {
  activeUserId = userId;
  const dialog = document.getElementById('hoursDialog');
  document.getElementById('entryType').value = type;
  document.getElementById('dialogTitle').textContent = type === 'add' ? 'Dodaj prekovremene sate' : 'Iskoristi prekovremene sate';
  document.getElementById('saveHoursBtn').textContent = type === 'add' ? 'Sačuvaj' : 'Sačuvaj';
  setDefaultEntryValues();

  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
  } else {
    dialog.setAttribute('open', 'true');
  }
}

function handleHoursSubmit(event) {
  event.preventDefault();
  const user = users.find((item) => item.id === activeUserId);
  if (!user) return;

  const hours = parseFloat(document.getElementById('entryHours').value);
  const description = document.getElementById('entryDescription').value.trim() || 'Bez opisa';
  const month = document.getElementById('entryMonth').value || getCurrentMonthName();
  const date = document.getElementById('entryDate').value || getTodayString();
  const type = document.getElementById('entryType').value || 'add';

  if (!Number.isFinite(hours) || hours <= 0) {
    alert('Unesite pozitivan broj sati.');
    return;
  }

  user.entries.unshift({
    id: `entry-${Date.now()}`,
    date,
    month,
    hours,
    description,
    type
  });

  saveUsers();
  render();
  document.getElementById('hoursDialog').close();
}

function openHistoryDialog(userId) {
  const user = users.find((item) => item.id === userId);
  if (!user) return;

  const body = document.getElementById('historyBody');
  body.innerHTML = '';

  if (!user.entries.length) {
    body.innerHTML = '<tr><td colspan="6">Nema istorije za ovog korisnika.</td></tr>';
  } else {
    let balance = 0;
    user.entries.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).forEach((entry) => {
      balance += entry.type === 'add' ? entry.hours : -entry.hours;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${entry.date}</td>
        <td>${entry.month}</td>
        <td>${escapeHtml(entry.description)}</td>
        <td>${entry.type === 'add' ? formatHours(entry.hours) : '-'}</td>
        <td>${entry.type === 'subtract' ? formatHours(entry.hours) : '-'}</td>
        <td>${formatHours(balance)} h</td>
      `;
      body.appendChild(row);
    });
  }

  document.getElementById('historyDialog').showModal();
}

function exportJson() {
  const blob = new Blob([JSON.stringify(users, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'overtime-backup.json';
  link.click();
  URL.revokeObjectURL(url);
}

function importJson(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!Array.isArray(parsed)) throw new Error('Neispravan format');
      users = parsed;
      saveUsers();
      render();
    } catch (error) {
      alert('Datoteka nije ispravna.');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function exportExcel() {
  const rows = [];

  users.forEach((user) => {
    if (!user.entries.length) {
      rows.push({
        korisnik: user.name,
        datum: '',
        mjesec: '',
        broj_sati: '',
        opis: '',
        tip: ''
      });
      return;
    }

    user.entries.forEach((entry) => {
      rows.push({
        korisnik: user.name,
        datum: entry.date || '',
        mjesec: entry.month || '',
        broj_sati: entry.hours,
        opis: entry.description || '',
        tip: entry.type === 'subtract' ? 'Oduzeto' : 'Dodato'
      });
    });
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Prekovremeni sati');
  XLSX.writeFile(workbook, 'overtime-export.xlsx');
}

function importExcel(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

      if (!rows.length) {
        alert('Excel datoteka ne sadrži podatke.');
        return;
      }

      const importedUsers = [];
      const userMap = new Map();

      rows.forEach((row) => {
        const name = String(row.korisnik || row.Korisnik || row.user || row.User || '').trim();
        if (!name) return;

        let user = userMap.get(name);
        if (!user) {
          user = {
            id: `user-${Date.now()}-${importedUsers.length + 1}`,
            name,
            entries: []
          };
          importedUsers.push(user);
          userMap.set(name, user);
        }

        const hours = parseFloat(row.broj_sati || row.hours || row['Broj sati'] || row['sati'] || 0);
        if (!Number.isFinite(hours) || hours <= 0) return;

        const type = String(row.tip || row.type || '').trim().toLowerCase();
        const normalizedType = type.includes('odu') || type === 'subtract' || type === 'minus' ? 'subtract' : 'add';

        user.entries.push({
          id: `entry-${Date.now()}-${user.entries.length + 1}`,
          date: String(row.datum || row.date || '').trim() || getTodayString(),
          month: String(row.mjesec || row.month || '').trim() || getCurrentMonthName(),
          hours,
          description: String(row.opis || row.description || '').trim() || 'Bez opisa',
          type: normalizedType
        });
      });

      if (!importedUsers.length) {
        alert('U Excel datoteci nisu pronađeni korisnici.');
        return;
      }

      users = importedUsers;
      saveUsers();
      render();
      alert('Excel podaci su uspješno uvezeni.');
    } catch (error) {
      alert('Nije moguće učitati Excel datoteku.');
    }
  };

  reader.readAsBinaryString(file);
  event.target.value = '';
}

function toggleTheme() {
  activeTheme = activeTheme === 'dark' ? 'light' : 'dark';
  applyTheme(activeTheme);
  localStorage.setItem('overtime-theme', activeTheme);
}

function applyTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
}

function calculateBalance(user) {
  return user.entries.reduce((balance, entry) => balance + (entry.type === 'add' ? entry.hours : -entry.hours), 0);
}

function calculateTotalAddedHours(user) {
  return user.entries.reduce((total, entry) => total + (entry.type === 'add' ? entry.hours : 0), 0);
}

function getUsedHours(user) {
  return user.entries.reduce((used, entry) => used + (entry.type === 'subtract' ? entry.hours : 0), 0);
}

function getMonthTotals() {
  const totals = {};
  users.forEach((user) => {
    user.entries.forEach((entry) => {
      const amount = entry.type === 'add' ? entry.hours : -entry.hours;
      totals[entry.month] = (totals[entry.month] || 0) + amount;
    });
  });

  return Object.fromEntries(
    Object.entries(totals).sort((a, b) => MONTHS.indexOf(a[0]) - MONTHS.indexOf(b[0]))
  );
}

function setDefaultEntryValues() {
  document.getElementById('entryDate').value = getTodayString();
  document.getElementById('entryMonth').value = getCurrentMonthName();
  document.getElementById('entryHours').value = '';
  document.getElementById('entryDescription').value = '';
}

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

function getCurrentMonthName() {
  return MONTHS[new Date().getMonth()];
}

function formatHours(value) {
  return Number(value).toFixed(1).replace(/\.0$/, '');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function loadUsers() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
}

function saveUsers() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}
