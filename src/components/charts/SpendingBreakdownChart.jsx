/*
  SpendingBreakdownChart
  Donut chart showing where the money goes, by category.
  innerRadius > 0 turns it into a donut (vs a full pie) which
  looks cleaner and leaves room for a center label if needed later.
*/

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useAppContext } from '../../context/AppContext';
import { spendingByCategory, formatCurrency } from '../../utils/helpers';
import { CATEGORY_COLORS } from '../../data/mockData';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 px-4 py-3 text-sm">
      <p className="font-semibold text-slate-700 dark:text-slate-200">{name}</p>
      <p className="text-slate-500 dark:text-slate-400 mt-0.5">{formatCurrency(value)}</p>
    </div>
  );
}

export default function SpendingBreakdownChart() {
  const { transactions } = useAppContext();
  const data = spendingByCategory(transactions);
  const total = data.reduce((s, d) => s + d.value, 0);

  if (data.length === 0) {
    return (
      <div className="animate-fade-in-up bg-white dark:bg-slate-800/80 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 flex items-center justify-center h-[380px]">
        <p className="text-slate-400 dark:text-slate-500 text-sm">No expense data to display</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up bg-white dark:bg-slate-800/80 rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-slate-100 dark:border-slate-700/50">
      <div className="mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white">Spending Breakdown</h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">By category</p>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={75}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={CATEGORY_COLORS[entry.name] || '#94a3b8'}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
        {data.map(item => {
          const pct = ((item.value / total) * 100).toFixed(1);
          return (
            <div key={item.name} className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0"
                  style={{ background: CATEGORY_COLORS[item.name] || '#94a3b8' }}
                />
                <span className="text-slate-600 dark:text-slate-300 truncate">{item.name}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {formatCurrency(item.value)}
                </span>
                <span className="text-slate-400 dark:text-slate-500 w-10 sm:w-12 text-right">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
