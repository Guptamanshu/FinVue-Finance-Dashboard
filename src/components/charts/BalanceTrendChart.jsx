/*
  BalanceTrendChart
  Shows income, expenses, and net balance as layered area lines.
  I used Recharts' AreaChart instead of LineChart because the
  gradient fill makes trends easier to read at a glance.
*/

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import { useAppContext } from '../../context/AppContext';

// Custom tooltip — Recharts' default one looks pretty bland

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 px-4 py-3 text-sm">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{label}</p>
      {payload.map(entry => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
          <span className="text-slate-500 dark:text-slate-400 capitalize">{entry.dataKey}:</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            ${entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function BalanceTrendChart() {
  const { balanceHistory, darkMode } = useAppContext();

  const gridColor = darkMode ? '#334155' : '#e2e8f0';
  const textColor = darkMode ? '#94a3b8' : '#64748b';

  return (
    <div className="animate-fade-in-up bg-white dark:bg-slate-800/80 rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-slate-100 dark:border-slate-700/50">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white">Balance Trend</h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Last 6 months overview</p>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1 sm:gap-1.5">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-brand-500" /> Income
          </span>
          <span className="flex items-center gap-1 sm:gap-1.5">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-rose-500" /> Expenses
          </span>
          <span className="flex items-center gap-1 sm:gap-1.5">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500" /> Balance
          </span>
        </div>
      </div>

      <div className="w-full" style={{ height: 'clamp(200px, 35vw, 280px)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={balanceHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="income" stroke="#6366f1" strokeWidth={2} fill="url(#gradIncome)" dot={{ r: 3, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 5 }} />
            <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2} fill="transparent" dot={{ r: 3, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 5 }} />
            <Area type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={2} fill="url(#gradBalance)" dot={{ r: 3, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
