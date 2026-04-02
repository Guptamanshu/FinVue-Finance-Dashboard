import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

// Each card type gets its own gradient + text color combo
const CARD_THEMES = {
  balance: {
    gradient: 'from-brand-600 to-brand-800',
    iconBg: 'bg-white/20',
    text: 'text-white',
    subText: 'text-brand-100',
    trendUp: 'text-emerald-300',
    trendDown: 'text-rose-300',
  },
  income: {
    gradient: 'from-emerald-500 to-emerald-700',
    iconBg: 'bg-white/20',
    text: 'text-white',
    subText: 'text-emerald-100',
    trendUp: 'text-emerald-200',
    trendDown: 'text-rose-300',
  },
  expenses: {
    gradient: 'from-rose-500 to-rose-700',
    iconBg: 'bg-white/20',
    text: 'text-white',
    subText: 'text-rose-100',
    trendUp: 'text-rose-200',
    trendDown: 'text-emerald-300',
  },
};

/**
 * @param {{ title, value, trend, type, icon }} props
 * trend: number | null (percent change)
 * type: 'balance' | 'income' | 'expenses'
 */
export default function SummaryCard({ title, value, trend, type, icon: Icon }) {
  const theme = CARD_THEMES[type] || CARD_THEMES.balance;

  const trendLabel = trend !== null && trend !== undefined
    ? `${trend >= 0 ? '+' : ''}${trend.toFixed(1)}%`
    : null;

  const isUp = trend > 0;
  const isDown = trend < 0;

  return (
    <div
      className={`animate-fade-in-up relative overflow-hidden rounded-2xl bg-gradient-to-br ${theme.gradient}
        p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}
    >
      {/* Decorative circles */}
      <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white/5" />
      <div className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/5" />

      <div className="relative z-10 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className={`text-xs sm:text-sm font-medium ${theme.subText} mb-0.5 sm:mb-1`}>{title}</p>
          <p className={`text-xl sm:text-2xl md:text-3xl font-bold ${theme.text} tracking-tight`}>
            {formatCurrency(value)}
          </p>
          {trendLabel && (
            <div className={`flex items-center gap-1 mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium
              ${isUp ? theme.trendUp : isDown ? theme.trendDown : theme.subText}`}
            >
              {isUp && <TrendingUp size={14} />}
              {isDown && <TrendingDown size={14} />}
              {!isUp && !isDown && <Minus size={14} />}
              <span className="truncate">{trendLabel} vs last month</span>
            </div>
          )}
        </div>
        <div className={`${theme.iconBg} p-2 sm:p-3 rounded-xl shrink-0`}>
          <Icon size={20} className="text-white sm:w-6 sm:h-6" />
        </div>
      </div>
    </div>
  );
}
