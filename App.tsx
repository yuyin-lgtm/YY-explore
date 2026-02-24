
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './screens/Dashboard';
import Campaigns from './screens/Campaigns';
import Creatives from './screens/Creatives';
import Creators from './screens/Creators';
import Automations from './screens/Automations';
import WasteReport from './screens/WasteReport';
import VisaMonitor from './screens/VisaMonitor';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <HashRouter>
      <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <Header onToggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/creatives" element={<Creatives />} />
              <Route path="/creators" element={<Creators />} />
              <Route path="/automations" element={<Automations />} />
              <Route path="/waste-report" element={<WasteReport />} />
              <Route path="/visa-monitor" element={<VisaMonitor />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
