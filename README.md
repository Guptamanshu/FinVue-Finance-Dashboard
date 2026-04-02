# FinVue — Finance Dashboard

A responsive finance dashboard built with React for tracking income, expenses, and financial insights. Supports role-based access, dark mode, and localStorage persistence.

---

## Tech Stack

- **React 19** with Vite
- **Tailwind CSS v4** for styling
- **Recharts** for data visualization
- **Context API + useReducer** for state management
- **localStorage** for data persistence

---

## Features

- **Summary Cards** — Total Balance, Income, Expenses with month-over-month trend indicators
- **Balance Trend Chart** — Area chart showing income vs expenses vs net balance (last 6 months)
- **Spending Breakdown** — Donut chart with per-category expense distribution
- **Transactions Table** — Search, filter (Income/Expense/All), sort by Date or Amount
- **Role-Based UI** — Admin (full CRUD) and Viewer (read-only) modes
- **Dynamic Insights** — Savings rate, top category, monthly comparison, average expense, largest expense
- **Dark Mode** — Toggle with localStorage persistence
- **Responsive Layout** — Sidebar on desktop, bottom navigation on mobile

---

## Setup

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173` (or next available port).

---

## Folder Structure

```
src/
├── components/
│   ├── cards/
│   │   └── SummaryCard.jsx
│   ├── charts/
│   │   ├── BalanceTrendChart.jsx
│   │   └── SpendingBreakdownChart.jsx
│   ├── transactions/
│   │   ├── TransactionTable.jsx
│   │   └── TransactionModal.jsx
│   ├── insights/
│   │   └── InsightsPanel.jsx
│   └── layout/
│       └── Sidebar.jsx
├── pages/
│   └── Dashboard.jsx
├── context/
│   └── AppContext.jsx
├── data/
│   └── mockData.js
├── utils/
│   └── helpers.js
├── App.jsx
├── main.jsx
└── index.css
```

---

## Mock Data

26 transactions across 10 categories (Salary, Freelance, Food & Dining, Travel, Shopping, Entertainment, Utilities, Healthcare, Education, Investments) spread over November 2025 to April 2026.
