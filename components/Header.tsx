
import React from 'react';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleDarkMode, isDarkMode }) => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Analytics Overview';
      case '/creatives': return 'Creative Performance & Insights';
      case '/creators': return 'Creator CRM';
      case '/automations': return 'Automation Rules';
      case '/waste-report': return 'Waste & Efficiency Analysis';
      default: return 'Overview';
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 dark:border-border-dark bg-white dark:bg-background-dark sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-6">
        <h2 className="text-lg font-bold">{getPageTitle()}</h2>
        
        {/* Date Selector Segmented Control (Visible on Dashboard) */}
        {location.pathname === '/' && (
          <div className="flex h-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-border-dark p-1 w-64">
            {['Today', '7D', '30D'].map((range) => (
              <label key={range} className="flex cursor-pointer h-full grow items-center justify-center rounded-md px-2 has-[:checked]:bg-white dark:has-[:checked]:bg-background-dark has-[:checked]:shadow-sm text-slate-500 dark:text-slate-400 has-[:checked]:text-primary text-xs font-bold leading-normal transition-all">
                <span className="truncate">{range}</span>
                <input className="hidden" name="date-range" type="radio" value={range} defaultChecked={range === '7D'} />
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative group">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-lg">search</span>
          <input className="bg-slate-100 dark:bg-border-dark border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary w-64 transition-all" placeholder="Search campaigns..." type="text"/>
        </div>
        
        <button onClick={onToggleDarkMode} className="p-2 text-slate-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
        </button>

        <button className="bg-primary text-white p-2 rounded-lg hover:scale-105 transition-transform flex items-center justify-center">
          <span className="material-symbols-outlined">add</span>
        </button>

        <div className="h-8 w-[1px] bg-slate-200 dark:bg-border-dark mx-2"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden xl:block">
            <p className="text-xs font-bold">Trend Store</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">TikTok Seller</p>
          </div>
          <div 
            className="h-10 w-10 rounded-full border-2 border-primary bg-center bg-cover cursor-pointer" 
            style={{backgroundImage: `url('https://picsum.photos/seed/user/100/100')`}}
          ></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
