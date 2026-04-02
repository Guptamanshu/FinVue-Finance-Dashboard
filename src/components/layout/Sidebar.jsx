import { useAppContext } from '../../context/AppContext';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Shield,
  Eye,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview',     label: 'Overview',      icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions',  icon: ArrowLeftRight },
  { id: 'insights',     label: 'Insights',      icon: Lightbulb },
];

export default function Sidebar({ activeSection, onNavigate, collapsed, onToggleCollapse }) {
  const { role, setRole, darkMode, toggleDarkMode } = useAppContext();

  return (
    <>
      {/* ─── Mobile top bar ─── */}
      <div className="lg:hidden fixed top-0 left-0 z-40 h-[60px] w-full
        bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
        border-b border-slate-200 dark:border-slate-700 flex items-center px-3 sm:px-4 gap-2 sm:gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-sm shadow-brand-500/20">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="font-bold text-lg text-slate-800 dark:text-white">FinVue</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            id="role-toggle-mobile"
            onClick={() => setRole(role === 'admin' ? 'viewer' : 'admin')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
              bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300
              hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {role === 'admin' ? <Shield size={14} /> : <Eye size={14} />}
            {role === 'admin' ? 'Admin' : 'Viewer'}
          </button>
          <button
            id="dark-mode-toggle-mobile"
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300
              hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>

      {/* ─── Mobile bottom nav ─── */}
      <nav className="lg:hidden fixed bottom-0 left-0 z-40 w-full
        bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
        border-t border-slate-200 dark:border-slate-700 flex justify-around py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all duration-200
                ${isActive
                  ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ─── Desktop sidebar ─── */}
      <aside
        className={`hidden lg:flex flex-col fixed top-0 left-0 z-30 h-screen
          bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-700/80
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-[72px]' : 'w-[260px]'}`}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 px-4 border-b border-slate-100 dark:border-slate-800
          ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shrink-0 shadow-md shadow-brand-500/20">
            <span className="text-white font-extrabold text-sm">F</span>
          </div>
          {!collapsed && (
            <span className="font-bold text-xl text-slate-800 dark:text-white tracking-tight whitespace-nowrap">
              FinVue
            </span>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                  transition-all duration-200 text-[14px] font-medium
                  ${isActive
                    ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
                  }
                  ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={20} className="shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom controls */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {/* Role switcher */}
          <button
            id="role-toggle-desktop"
            onClick={() => setRole(role === 'admin' ? 'viewer' : 'admin')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium
              transition-all duration-200
              ${role === 'admin'
                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
              }
              hover:shadow-sm
              ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? `Role: ${role}` : undefined}
          >
            {role === 'admin' ? <Shield size={18} /> : <Eye size={18} />}
            {!collapsed && <span>{role === 'admin' ? 'Admin Mode' : 'Viewer Mode'}</span>}
          </button>

          {/* Dark mode */}
          <button
            id="dark-mode-toggle-desktop"
            onClick={toggleDarkMode}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium
              text-slate-500 dark:text-slate-400
              hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200
              transition-all duration-200
              ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? (darkMode ? 'Light Mode' : 'Dark Mode') : undefined}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {!collapsed && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          {/* Collapse toggle */}
          <button
            id="sidebar-collapse-toggle"
            onClick={onToggleCollapse}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium
              text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300
              hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 justify-center"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span className="text-xs">Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
