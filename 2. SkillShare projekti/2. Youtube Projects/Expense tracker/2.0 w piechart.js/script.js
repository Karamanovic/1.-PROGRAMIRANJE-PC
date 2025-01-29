const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Corrected currency code: "BAM" (for Bosnia and Herzegovina Convertible Mark)
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "BAM",
  signDisplay: "always",
});

const list = document.getElementById("transactionList");
const form = document.getElementById("transactionForm");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const dateInput = document.getElementById("date");

// Set the default date and make the calendar start on Monday
const today = new Date();
const todayISO = today.toISOString().split("T")[0];
dateInput.defaultValue = todayISO;

// Ensure weeks start on Monday for date display
function formatDateToStartMonday(date) {
  const options = { weekday: "long", year: "numeric", month: "short", day: "numeric" };
  const formattedDate = new Date(date);
  // Adjust Sunday (0) to 7, so it falls after Monday (1)
  const dayOfWeek = formattedDate.getDay();
  const adjustedDate = dayOfWeek === 0 ? new Date(formattedDate.setDate(formattedDate.getDate() - 6)) : formattedDate;
  return adjustedDate.toLocaleDateString("en-GB", options);
}

form.addEventListener("submit", addTransaction);

function formatCurrency(value) {
  if (value === 0) {
    return formatter.format(0).replace(/^[+-]/, "");
  }
  return formatter.format(value);
}

function createItem({ id, name, amount, date, type }) {
  const sign = type === "income" ? 1 : -1;

  const li = document.createElement("li");

  li.innerHTML = `
      <div class="name">
        <h4>${name}</h4>
        <p>${formatDateToStartMonday(date)}</p>
      </div>

      <div class="amount ${type}">
        <span>${formatCurrency(amount * sign)}</span>
      </div>
    `;

  li.addEventListener("click", (e) => {
    e.stopPropagation();
    if (confirm("Delete transaction?")) {
      deleteTransaction(id);
    }
  });

  return li;
}

function updateTotal() {
  const incomeTotal = transactions
    .filter((trx) => trx.type === "income")
    .reduce((total, trx) => total + trx.amount, 0);

  const expenseTotal = transactions
    .filter((trx) => trx.type === "expense")
    .reduce((total, trx) => total + trx.amount, 0);

  const balanceTotal = incomeTotal - expenseTotal;

  balance.textContent = formatCurrency(balanceTotal).replace(/^\+/, "");
  income.textContent = formatCurrency(incomeTotal);
  expense.textContent = formatCurrency(expenseTotal * -1);
}

function renderList() {
  list.innerHTML = "";

  transactions.forEach((transaction) => {
    const li = createItem(transaction);
    list.appendChild(li);
  });
}

renderList();
updateTotal();

function deleteTransaction(id) {
  const index = transactions.findIndex((trx) => trx.id === id);
  transactions.splice(index, 1);

  list.removeChild(list.children[index]);

  updateTotal();
  saveTransactions();
}

function addTransaction(e) {
  e.preventDefault();

  const formData = new FormData(form);
  form.reset();

  const uniqueId =
    Date.now().toString(36) + Math.random().toString(36).substring(2);

  const newTransaction = {
    id: uniqueId,
    name: formData.get("name"),
    amount: parseFloat(formData.get("amount")),
    date: new Date(formData.get("date")),
    type: formData.get("type") === "on" ? "expense" : "income",
  };

  if (
    !newTransaction.name ||
    isNaN(newTransaction.amount) ||
    !newTransaction.date
  ) {
    alert("Please fill in all fields correctly.");
    return;
  }

  transactions.push(newTransaction);
  saveTransactions();

  renderList();
  updateTotal();
}

function saveTransactions() {
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

/* PIE CHART */

const ctx = document.getElementById("expenseChart").getContext("2d");
let expenseChart;

// Function to update the chart
function updateChart() {
  const categories = {};
  transactions
    .filter((trx) => trx.type === "expense")
    .forEach((trx) => {
      categories[trx.name] = (categories[trx.name] || 0) + trx.amount;
    });

  const labels = Object.keys(categories);
  const data = Object.values(categories);

  if (expenseChart) {
    expenseChart.destroy();
  }

  expenseChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            "red",
            "blue",
            "green",
            "orange",
            "purple",
            "yellow",
            "pink",
          ],
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
}

// Update the chart when transactions change
function saveTransactions() {
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateChart();
}

// Initialize the chart on page load
updateChart();