// Each card here is driven by the computeInsights function in helpers.js.
// Nothing is hardcoded — if the user adds/removes transactions, these update.

import { useAppContext } from '../../context/AppContext';
import { formatCurrency } from '../../utils/helpers';
import {
  TrendingUp, TrendingDown, PiggyBank, ShoppingBag,
  BarChart3, Receipt, Layers,
} from 'lucide-react';

// Reusable card wrapper so each insight has consistent layout + hover effects
function InsightCard({ icon: Icon, iconColor, title, children }) {
  return (
    <div className="animate-fade-in-up bg-white dark:bg-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-sm
      border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className={`shrink-0 p-2.5 sm:p-3 rounded-xl ${iconColor}`}>
          <Icon size={18} className="text-white sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-white mb-0.5 sm:mb-1">{title}</h4>
          <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InsightsPanel() {
  const { insights } = useAppContext();
  const {
    highestCategory,
    monthlyComparison,
    savingsRate,
    avgExpense,
    largestExpense,
    totalCategories,
  } = insights;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Financial Insights</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Auto-generated from your transaction data
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 stagger">
        {/* How much of their income is actually being saved */}
        <InsightCard
          icon={PiggyBank}
          iconColor="bg-emerald-500"
          title="Savings Rate"
        >
          <p>
            You're saving <span className="font-semibold text-emerald-600 dark:text-emerald-400">{savingsRate.toFixed(1)}%</span> of
            your income. {savingsRate >= 20
              ? 'Great job — you\'re above the recommended 20% benchmark!'
              : 'Aim for at least 20% to build a healthy financial cushion.'}
          </p>
        </InsightCard>

        {/* Where the most money is going */}
        {highestCategory && (
          <InsightCard
            icon={ShoppingBag}
            iconColor="bg-rose-500"
            title="Top Spending Category"
          >
            <p>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{highestCategory.name}</span> is
              your biggest expense at{' '}
              <span className="font-semibold text-rose-600 dark:text-rose-400">
                {formatCurrency(highestCategory.value)}
              </span>
            </p>
          </InsightCard>
        )}

        {/* Did spending go up or down vs last month? */}
        {monthlyComparison && (
          <InsightCard
            icon={monthlyComparison.change > 0 ? TrendingUp : TrendingDown}
            iconColor={monthlyComparison.change > 0 ? 'bg-amber-500' : 'bg-brand-500'}
            title="Monthly Comparison"
          >
            <p>
              {monthlyComparison.currentMonth} expenses were{' '}
              <span className={`font-semibold ${monthlyComparison.change > 0
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-emerald-600 dark:text-emerald-400'}`}>
                {Math.abs(monthlyComparison.change).toFixed(1)}%{' '}
                {monthlyComparison.change > 0 ? 'higher' : 'lower'}
              </span>{' '}
              than {monthlyComparison.previousMonth} ({formatCurrency(monthlyComparison.currentExpenses)} vs{' '}
              {formatCurrency(monthlyComparison.previousExpenses)})
            </p>
          </InsightCard>
        )}

        {/* What a "typical" expense looks like */}
        <InsightCard
          icon={BarChart3}
          iconColor="bg-blue-500"
          title="Average Expense"
        >
          <p>
            Your average expense transaction is{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {formatCurrency(Math.round(avgExpense))}
            </span>
          </p>
        </InsightCard>

        {/* The single biggest hit to the wallet */}
        {largestExpense && (
          <InsightCard
            icon={Receipt}
            iconColor="bg-purple-500"
            title="Largest Expense"
          >
            <p>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{largestExpense.title}</span>{' '}
              on {new Date(largestExpense.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at{' '}
              <span className="font-semibold text-rose-600 dark:text-rose-400">
                {formatCurrency(largestExpense.amount)}
              </span>
            </p>
          </InsightCard>
        )}

        {/* How spread out the spending is across categories */}
        <InsightCard
          icon={Layers}
          iconColor="bg-teal-500"
          title="Spending Diversity"
        >
          <p>
            Your spending spans{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-200">{totalCategories}</span>{' '}
            categor{totalCategories === 1 ? 'y' : 'ies'}.{' '}
            {totalCategories >= 5
              ? 'Quite diversified — consider focusing on reducing the top one.'
              : 'Fairly concentrated spending patterns.'}
          </p>
        </InsightCard>
      </div>
    </div>
  );
}
