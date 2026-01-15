
import React, { useState } from 'react';

const Automations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Rules' | 'History' | 'Templates'>('Rules');

  const tabs = ['Rules', 'History', 'Templates'] as const;

  return (
    <div className="p-8 max-w-[1200px] mx-auto w-full flex flex-col gap-8">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <nav className="flex gap-6 border-b border-slate-200 dark:border-border-dark w-full mb-2">
          {tabs.map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm pb-3 transition-all ${
                activeTab === tab 
                  ? 'font-extrabold text-primary border-b-2 border-primary' 
                  : 'font-medium text-slate-500 hover:text-primary'
              }`}
            >
              {tab === 'Rules' ? 'Active Rules' : tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'Rules' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
            <StatsCard label="Total Actions Today" value="42" trend="+5% vs yesterday" icon="bolt" iconColor="text-primary" />
            <StatsCard label="Estimated Spend Saved" value="$1,240.50" trend="Automated Pausing" icon="savings" iconColor="text-orange-500" />
            <StatsCard label="Revenue Lift" value="+12.4%" trend="+1.5% this week" icon="trending_up" iconColor="text-[#0bda4d]" />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-xl border border-primary/30 bg-primary/5 p-6 border-dashed animate-in slide-in-from-top-4 duration-300">
            <div className="flex gap-4 items-center">
              <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">experiment</span>
              </div>
              <div className="flex flex-col">
                <p className="text-base font-bold leading-tight">Simulation Mode</p>
                <p className="text-slate-500 text-sm">Preview rule impacts on historical data before going live.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-primary">ACTIVE</span>
              <div className="w-12 h-6 bg-primary rounded-full relative p-1 cursor-pointer">
                <div className="absolute right-1 top-1 size-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-200 dark:border-border-dark flex items-center justify-between">
                  <h3 className="font-bold flex items-center gap-2"><span className="material-symbols-outlined text-primary text-lg">construction</span> Rule Builder</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-border-dark rounded text-slate-500">DRAFT</span>
                </div>
                <div className="p-6 flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded">IF</span>
                      <span className="text-xs font-medium text-slate-400">Trigger conditions met</span>
                    </div>
                    <ConditionBlock label="ROAS" value="3.0" operator="is greater than" />
                    <div className="flex items-center gap-2 pl-4"><span className="text-[10px] font-bold text-slate-300">AND</span></div>
                    <ConditionBlock label="Daily Spend" value="$500" operator="is less than" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0bda4d] px-2 py-1 bg-[#0bda4d]/10 rounded">THEN</span>
                      <span className="text-xs font-medium text-slate-400">Action to execute</span>
                    </div>
                    <div className="p-4 bg-[#0bda4d]/5 rounded-lg border border-[#0bda4d]/20 flex items-center gap-2">
                      <span className="text-sm font-bold px-2 py-1 bg-[#0bda4d] text-white rounded">Increase Budget</span>
                      <span className="text-sm text-slate-400">by</span>
                      <span className="text-sm font-bold px-2 py-1 bg-white border border-slate-200 rounded">20%</span>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button className="flex-1 py-3 bg-primary text-white font-bold rounded-lg text-sm shadow-lg shadow-primary/20">Save & Activate</button>
                    <button className="px-6 py-3 bg-slate-100 dark:bg-border-dark text-slate-500 font-bold rounded-lg text-sm">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-black">Active Rules (12)</h2>
              </div>
              <div className="flex flex-col gap-4">
                <RuleCard 
                  name="Auto-Boost High ROAS" 
                  scope="Applies to 24 TikTok Campaigns" 
                  logic="IF ROAS > 3.0 & Spend < $500 THEN Increase Budget 20%" 
                  actions="142 times" 
                  lift="+0.8x" 
                  type="boost" 
                />
                <RuleCard 
                  name="Pause Underperformers" 
                  scope="Applies to All Product Groups" 
                  logic="IF ROAS < 1.2 & Spend > $50 THEN Pause Campaign" 
                  actions="28 times" 
                  lift="$3,400 saved" 
                  type="pause" 
                />
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'History' && (
        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-8 text-center animate-in fade-in zoom-in-95 duration-300">
           <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">history</span>
           <h3 className="text-xl font-bold">Automation History</h3>
           <p className="text-slate-500 mt-2 max-w-sm mx-auto">Displaying the log of the last 1,000 automated actions triggered by your rules.</p>
           <div className="mt-8 space-y-4 text-left max-w-2xl mx-auto">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 p-4 rounded-lg bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-border-dark">
                   <div className="size-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined">check_circle</span>
                   </div>
                   <div>
                      <p className="text-sm font-bold">Rule "Auto-Boost" increased budget for <span className="text-primary">Summer_Sale</span></p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase font-black">Today at 2:45 PM • ROI: 4.2x</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'Templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
           {['Scaling Pro', 'Waste Reduction', 'Late Night Boost', 'Brand Protection'].map(t => (
             <div key={t} className="p-6 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl hover:border-primary transition-all cursor-pointer">
                <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-1 rounded uppercase mb-4 inline-block">Recommended</span>
                <h4 className="font-bold text-lg mb-2">{t}</h4>
                <p className="text-xs text-slate-500 mb-6">Optimized preset for high-performing shop campaigns.</p>
                <button className="w-full py-2 border border-primary text-primary font-bold text-xs rounded-lg hover:bg-primary hover:text-white transition-all">Use Template</button>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

const StatsCard = ({ label, value, trend, icon, iconColor }: any) => (
  <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm flex flex-col gap-2">
    <div className="flex justify-between items-start">
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
    </div>
    <div className="flex items-baseline gap-2">
      <p className="text-2xl font-black">{value}</p>
      <p className={`text-xs font-bold ${trend.includes('+') ? 'text-emerald-500' : 'text-slate-400'}`}>{trend}</p>
    </div>
  </div>
);

const ConditionBlock = ({ label, value, operator }: any) => (
  <div className="flex flex-wrap gap-2 items-center p-3 bg-slate-50 dark:bg-black/20 rounded-lg border border-slate-100 dark:border-border-dark">
    <span className="text-sm font-bold px-2 py-1 bg-white dark:bg-border-dark border rounded shadow-sm">{label}</span>
    <span className="text-sm text-slate-400">{operator}</span>
    <span className="text-sm font-bold px-2 py-1 bg-white dark:bg-border-dark border rounded shadow-sm">{value}</span>
  </div>
);

const RuleCard = ({ name, scope, logic, actions, lift, type }: any) => (
  <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm hover:border-primary transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className={`size-10 rounded-lg flex items-center justify-center 
          ${type === 'boost' ? 'bg-[#0bda4d]/10 text-[#0bda4d]' : 'bg-orange-500/10 text-orange-500'}`}>
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>{type === 'boost' ? 'trending_up' : 'pause_circle'}</span>
        </div>
        <div>
          <h4 className="font-bold text-base">{name}</h4>
          <p className="text-xs text-slate-400">{scope}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="text-[10px] font-black px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full uppercase">Running</span>
        <div className="flex gap-2">
          <span className="material-symbols-outlined text-slate-300 hover:text-primary cursor-pointer">edit</span>
          <span className="material-symbols-outlined text-slate-300 hover:text-red-500 cursor-pointer">delete</span>
        </div>
      </div>
    </div>
    <div className="bg-slate-50 dark:bg-black/20 rounded-lg p-3 mb-4">
      <p className="text-xs font-mono text-slate-600 dark:text-slate-300 font-bold">{logic}</p>
    </div>
    <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-border-dark">
      <div className="flex gap-8">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Actions (7D)</span>
          <span className="text-sm font-bold">{actions}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{type === 'boost' ? 'ROAS Lift' : 'Efficiency'}</span>
          <span className={`text-sm font-bold ${type === 'boost' ? 'text-emerald-500' : 'text-orange-500'}`}>{lift}</span>
        </div>
      </div>
    </div>
  </div>
);

export default Automations;
