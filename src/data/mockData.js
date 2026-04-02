/*
  mockData.js
  -----------
  Sample transaction data for the dashboard. I tried to make these feel
  realistic — a mix of recurring bills, one-off purchases, and freelance
  income spread across the last six months.

  In a real app this would come from an API, but having it here makes
  it easy to develop and test the UI without a backend.
*/

// All the categories a transaction can belong to
export const CATEGORIES = [
  'Salary',
  'Freelance',
  'Food & Dining',
  'Travel',
  'Shopping',
  'Entertainment',
  'Utilities',
  'Healthcare',
  'Education',
  'Investments',
];

// Color mapping for charts — picked these to be visually distinct on
// both the donut chart and the legend
export const CATEGORY_COLORS = {
  'Salary':        '#6366f1',
  'Freelance':     '#818cf8',
  'Food & Dining': '#f97316',
  'Travel':        '#06b6d4',
  'Shopping':      '#ec4899',
  'Entertainment': '#8b5cf6',
  'Utilities':     '#eab308',
  'Healthcare':    '#ef4444',
  'Education':     '#14b8a6',
  'Investments':   '#22c55e',
};

// The actual transaction list — 26 entries across Nov 2025 to Apr 2026
export const initialTransactions = [
  // November 2025
  { id: 1,  date: '2025-11-01', title: 'Monthly Salary',          amount: 5200, category: 'Salary',        type: 'income'  },
  { id: 2,  date: '2025-11-03', title: 'Grocery Run',             amount: 87,   category: 'Food & Dining', type: 'expense' },
  { id: 3,  date: '2025-11-07', title: 'Netflix Subscription',    amount: 15,   category: 'Entertainment', type: 'expense' },
  { id: 4,  date: '2025-11-12', title: 'Electricity Bill',        amount: 142,  category: 'Utilities',     type: 'expense' },

  // December 2025
  { id: 5,  date: '2025-12-01', title: 'Monthly Salary',          amount: 5200, category: 'Salary',        type: 'income'  },
  { id: 6,  date: '2025-12-05', title: 'Holiday Shopping',        amount: 430,  category: 'Shopping',      type: 'expense' },
  { id: 7,  date: '2025-12-10', title: 'Freelance Web Project',   amount: 1800, category: 'Freelance',     type: 'income'  },
  { id: 8,  date: '2025-12-15', title: 'Flight to NYC',           amount: 320,  category: 'Travel',        type: 'expense' },
  { id: 9,  date: '2025-12-20', title: 'Restaurant Dinner',       amount: 96,   category: 'Food & Dining', type: 'expense' },

  // January 2026
  { id: 10, date: '2026-01-01', title: 'Monthly Salary',          amount: 5400, category: 'Salary',        type: 'income'  },
  { id: 11, date: '2026-01-04', title: 'Gym Membership',          amount: 50,   category: 'Healthcare',    type: 'expense' },
  { id: 12, date: '2026-01-09', title: 'Online Course — React',   amount: 199,  category: 'Education',     type: 'expense' },
  { id: 13, date: '2026-01-14', title: 'Gas Bill',                amount: 68,   category: 'Utilities',     type: 'expense' },
  { id: 14, date: '2026-01-22', title: 'Stock Dividend',          amount: 340,  category: 'Investments',   type: 'income'  },

  // February 2026
  { id: 15, date: '2026-02-01', title: 'Monthly Salary',          amount: 5400, category: 'Salary',        type: 'income'  },
  { id: 16, date: '2026-02-06', title: 'Valentine Dinner',        amount: 145,  category: 'Food & Dining', type: 'expense' },
  { id: 17, date: '2026-02-11', title: 'Freelance Logo Design',   amount: 600,  category: 'Freelance',     type: 'income'  },
  { id: 18, date: '2026-02-18', title: 'New Sneakers',            amount: 189,  category: 'Shopping',      type: 'expense' },
  { id: 19, date: '2026-02-25', title: 'Spotify Annual',          amount: 99,   category: 'Entertainment', type: 'expense' },

  // March 2026
  { id: 20, date: '2026-03-01', title: 'Monthly Salary',          amount: 5400, category: 'Salary',        type: 'income'  },
  { id: 21, date: '2026-03-05', title: 'Uber Rides',              amount: 74,   category: 'Travel',        type: 'expense' },
  { id: 22, date: '2026-03-10', title: 'Freelance API Project',   amount: 2200, category: 'Freelance',     type: 'income'  },
  { id: 23, date: '2026-03-15', title: 'Dental Checkup',          amount: 210,  category: 'Healthcare',    type: 'expense' },
  { id: 24, date: '2026-03-20', title: 'Weekend Groceries',       amount: 112,  category: 'Food & Dining', type: 'expense' },
  { id: 25, date: '2026-03-28', title: 'Internet Bill',           amount: 59,   category: 'Utilities',     type: 'expense' },

  // April 2026 (just started)
  { id: 26, date: '2026-04-01', title: 'Monthly Salary',          amount: 5600, category: 'Salary',        type: 'income'  },
];

// Pre-computed monthly summaries for the balance trend chart.
// I could calculate these on the fly from the transactions array,
// but having them pre-built keeps the chart data simple and avoids
// edge cases around partial months.
export const balanceHistory = [
  { month: 'Nov',  income: 5200,  expenses: 244,  balance: 4956  },
  { month: 'Dec',  income: 7000,  expenses: 846,  balance: 6154  },
  { month: 'Jan',  income: 5740,  expenses: 317,  balance: 5423  },
  { month: 'Feb',  income: 6000,  expenses: 433,  balance: 5567  },
  { month: 'Mar',  income: 7600,  expenses: 455,  balance: 7145  },
  { month: 'Apr',  income: 5600,  expenses: 0,    balance: 5600  },
];
