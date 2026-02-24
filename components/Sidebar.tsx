
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'dashboard' },
    { name: 'Campaigns', path: '/campaigns', icon: 'campaign' },
    { name: 'Creatives', path: '/creatives', icon: 'grid_view' },
    { name: 'Creators', path: '/creators', icon: 'group' },
    { name: 'Automations', path: '/automations', icon: 'bolt' },
    { name: 'Waste Report', path: '/waste-report', icon: 'bar_chart' },
    { name: 'Visa Monitor', path: '/visa-monitor', icon: 'flight' },
  ];

  return (
    <aside className="w-64 flex flex-col bg-white dark:bg-surface-dark border-r border-slate-200 dark:border-border-dark shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary size-10 rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-2xl">rocket_launch</span>
        </div>
        <div>
          <h1 className="text-lg font-extrabold leading-tight tracking-tight">Reacher</h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-primary font-bold">TikTok Shop GMV Max</p>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                isActive 
                  ? 'bg-slate-100 dark:bg-primary/20 text-slate-900 dark:text-white font-bold border-r-4 border-primary' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-border-dark font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`material-symbols-outlined transition-colors ${isActive ? 'text-primary' : 'group-hover:text-primary'}`}>
                  {item.icon}
                </span>
                <span className="text-sm">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-border-dark space-y-2">
        <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-white rounded-lg font-bold text-sm shadow-md shadow-primary/30 hover:bg-primary/90 transition-all">
          <span className="material-symbols-outlined text-sm">sync</span>
          <span>Sync Data</span>
        </button>
        <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-border-dark transition-colors" href="#">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-sm font-medium">Settings</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
