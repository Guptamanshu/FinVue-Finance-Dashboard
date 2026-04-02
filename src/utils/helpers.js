/*
  helpers.js
  ----------
  Keeps all the calculation and formatting logic in one place.
  None of these touch the DOM or React state — they just take data in
  and return results, which makes them easy to test if we add Vitest later.
*/

// Formats a number as USD without decimal cents (e.g. $1,250)
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Takes an ISO date like '2026-03-15' and returns 'Mar 15, 2026'
// The T00:00:00 suffix avoids timezone offset issues in some browsers
export function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Runs through all transactions and tallies up income vs expenses
export function computeAggregates(transactions) {
  let totalIncome = 0;
  let totalExpenses = 0;

  for (const txn of transactions) {
    if (txn.type === 'income') totalIncome += txn.amount;
    else totalExpenses += txn.amount;
  }

  return {
    totalIncome,
    totalExpenses,
    totalBalance: totalIncome - totalExpenses,
  };
}

// Simple percent change — returns null if there's no previous value to compare against
export function percentChange(current, previous) {
  if (!previous || previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

// Groups expense transactions by category and sorts highest-spend first.
// Used by the donut chart and the "top category" insight.
export function spendingByCategory(transactions) {
  const categoryTotals = {};

  for (const txn of transactions) {
    if (txn.type !== 'expense') continue;
    categoryTotals[txn.category] = (categoryTotals[txn.category] || 0) + txn.amount;
  }

  return Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

/*
  computeInsights — the brain behind the Insights page.
  Pulls together several metrics from the raw transaction list
  and the monthly balance history. Returns an object that the
  InsightsPanel component can render directly.
*/
export function computeInsights(transactions, balanceHistory) {
  // Which category is eating the most money?
  const spending = spendingByCategory(transactions);
  const highestCategory = spending.length > 0 ? spending[0] : null;

  // Compare the last two months that have actual expense data
  const monthsWithData = balanceHistory.filter(m => m.expenses > 0);
  let monthlyComparison = null;
  if (monthsWithData.length >= 2) {
    const curr = monthsWithData[monthsWithData.length - 1];
    const prev = monthsWithData[monthsWithData.length - 2];
    monthlyComparison = {
      currentMonth: curr.month,
      currentExpenses: curr.expenses,
      previousMonth: prev.month,
      previousExpenses: prev.expenses,
      change: percentChange(curr.expenses, prev.expenses),
    };
  }

  // What fraction of income is being saved?
  const { totalIncome, totalExpenses } = computeAggregates(transactions);
  const savingsRate = totalIncome > 0
    ? ((totalIncome - totalExpenses) / totalIncome) * 100
    : 0;

  // Average expense — useful to know what a "normal" transaction looks like
  const expenseList = transactions.filter(txn => txn.type === 'expense');
  const avgExpense = expenseList.length > 0
    ? expenseList.reduce((sum, txn) => sum + txn.amount, 0) / expenseList.length
    : 0;

  // Find the single biggest expense
  const largestExpense = expenseList.length > 0
    ? expenseList.reduce((biggest, txn) => txn.amount > biggest.amount ? txn : biggest, expenseList[0])
    : null;

  return {
    highestCategory,
    monthlyComparison,
    savingsRate,
    avgExpense,
    largestExpense,
    totalCategories: spending.length,
  };
}

/*
  filterTransactions — handles search, type filtering, and sorting
  all in one pass. The Dashboard and Transaction views both call this
  through the context so they always show consistent results.
*/
export function filterTransactions(transactions, { search, filterType, sortField, sortDir }) {
  let result = [...transactions];

  // Text search across title and category
  if (search) {
    const query = search.toLowerCase();
    result = result.filter(
      txn => txn.title.toLowerCase().includes(query) || txn.category.toLowerCase().includes(query)
    );
  }

  // Income / Expense / All filter
  if (filterType && filterType !== 'all') {
    result = result.filter(txn => txn.type === filterType);
  }

  // Column sorting — dates need to be converted to timestamps first
  if (sortField) {
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortField === 'date') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }
      return sortDir === 'asc' ? valA - valB : valB - valA;
    });
  } else {
    // No explicit sort? Show newest first.
    result.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  return result;
}

// Generates a new ID by taking the current max and adding 1.
// Not production-grade (a UUID would be better) but fine for mock data.
export function generateId(transactions) {
  return transactions.length > 0
    ? Math.max(...transactions.map(txn => txn.id)) + 1
    : 1;
}

// localStorage wrappers — wrapped in try/catch because storage
// can throw in incognito mode or when the quota is exceeded.
export function loadFromStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Quota exceeded or private browsing — not much we can do here
  }
}
