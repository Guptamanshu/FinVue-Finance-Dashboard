import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const desktopPl = sidebarCollapsed ? '88px' : '276px';

  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <Sidebar
          activeSection={activeSection}
          onNavigate={setActiveSection}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(c => !c)}
        />

        <main
          className="pt-[72px] pb-[80px] lg:pt-8 lg:pb-8 px-3 xs:px-4 sm:px-6 transition-all duration-300"
          style={{ paddingLeft: undefined }}
        >
          <div className="max-w-[1400px] mx-auto">
            <Dashboard activeSection={activeSection} />
          </div>
        </main>

        {/* Dynamic desktop sidebar offset */}
        <style>{`
          @media (min-width: 1024px) {
            main { padding-left: ${desktopPl} !important; padding-right: 24px !important; }
          }
        `}</style>
      </div>
    </AppProvider>
  );
}
