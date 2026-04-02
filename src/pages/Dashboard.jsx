/*
  Dashboard page
  This is the main content area. Instead of using React Router
  (overkill for three sections), I just conditionally render based
  on the activeSection prop that the sidebar controls.
*/

import { useAppContext } from '../context/AppContext';
import { percentChange } from '../utils/helpers';
import SummaryCard from '../components/cards/SummaryCard';
import BalanceTrendChart from '../components/charts/BalanceTrendChart';
import SpendingBreakdownChart from '../components/charts/SpendingBreakdownChart';
import TransactionTable from '../components/transactions/TransactionTable';
import InsightsPanel from '../components/insights/InsightsPanel';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

export default function Dashboard({ activeSection }) {
  const { aggregates, balanceHistory } = useAppContext();
  const { totalBalance, totalIncome, totalExpenses } = aggregates;

  // Compute trends from balance history
  const fullMonths = balanceHistory.filter(m => m.income > 0);
  const currMonth = fullMonths[fullMonths.length - 1] || {};
  const prevMonth = fullMonths.length >= 2 ? fullMonths[fullMonths.length - 2] : null;

  const balanceTrend = prevMonth ? percentChange(currMonth.balance, prevMonth.balance) : null;
  const incomeTrend = prevMonth ? percentChange(currMonth.income, prevMonth.income) : null;
  const expenseTrend = prevMonth ? percentChange(currMonth.expenses, prevMonth.expenses) : null;

  const showOverview = activeSection === 'overview';
  const showTransactions = activeSection === 'transactions';
  const showInsights = activeSection === 'insights';

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
          {showOverview && 'Dashboard Overview'}
          {showTransactions && 'Transactions'}
          {showInsights && 'Insights'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm sm:text-base">
          {showOverview && 'Your financial health at a glance'}
          {showTransactions && 'Manage and review your transactions'}
          {showInsights && 'Key patterns from your financial data'}
        </p>
      </div>

      {/* ── Overview Section ── */}
      {showOverview && (
        <>
          {/* Summary Cards */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 stagger">
            <SummaryCard
              title="Total Balance"
              value={totalBalance}
              trend={balanceTrend}
              type="balance"
              icon={Wallet}
            />
            <SummaryCard
              title="Total Income"
              value={totalIncome}
              trend={incomeTrend}
              type="income"
              icon={TrendingUp}
            />
            <SummaryCard
              title="Total Expenses"
              value={totalExpenses}
              trend={expenseTrend}
              type="expenses"
              icon={TrendingDown}
            />
          </div>

          {/* Charts */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <BalanceTrendChart />
            </div>
            <div className="lg:col-span-2">
              <SpendingBreakdownChart />
            </div>
          </div>

          {/* Transactions preview */}
          <TransactionTable />
        </>
      )}

      {/* ── Transactions Section ── */}
      {showTransactions && <TransactionTable />}

      {/* ── Insights Section ── */}
      {showInsights && <InsightsPanel />}
    </div>
  );
}
