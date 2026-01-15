
import React, { useState } from 'react';

const Creatives: React.FC = () => {
  const [activeFolder, setActiveFolder] = useState('All Creatives');

  const folders = [
    { name: 'All Creatives', icon: 'grid_view' },
    { name: 'Scaling', icon: 'trending_up', color: 'primary' },
    { name: 'Organic Stars', icon: 'stars', color: 'primary' },
    { name: 'Potential', icon: 'lightbulb', color: 'amber' },
    { name: 'At Risk', icon: 'warning', color: 'red' },
    { name: 'Dying', icon: 'delete', color: 'slate' },
  ];

  const organicStars = [
    { title: 'Skincare Routine - Morning Glow', spend: '$12.40', roas: '18.4x', revenue: '$228.16', img: 'https://picsum.photos/seed/skin/400/700' },
    { title: 'Retro Gaming Setup Tour', spend: '$4.50', roas: '42.2x', revenue: '$189.90', img: 'https://picsum.photos/seed/game/400/700' },
  ];

  const optimizationNeeded = [
    { title: 'Generic Watch Ad #04', spend: '$420.00', roas: '0.8x', revenue: '$336.00', img: 'https://picsum.photos/seed/watch/400/700', status: 'Bleeding' },
    { title: 'Air Fryer Hack - Crispy Wings', spend: '$1,204', roas: '2.4x', revenue: '$2,889', img: 'https://picsum.photos/seed/cook/400/700', status: 'Average' },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-background-dark">
      <div className="px-8 py-3 bg-slate-50 dark:bg-primary/5 flex gap-2 overflow-x-auto shrink-0 border-b border-primary/5 scrollbar-hide">
        {folders.map((folder, idx) => (
          <button 
            key={idx} 
            onClick={() => setActiveFolder(folder.name)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all
              ${activeFolder === folder.name 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-white dark:bg-surface-dark border border-primary/20 text-slate-600 dark:text-slate-300 hover:border-primary'}`}
          >
            <span className={`material-symbols-outlined text-sm ${activeFolder !== folder.name && folder.color === 'primary' ? 'text-primary' : ''}`}>
              {folder.icon}
            </span>
            {folder.name}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <input type="checkbox" className="rounded border-primary/30 text-primary focus:ring-primary bg-transparent" />
              Select All (24)
            </label>
            <div className="h-4 w-px bg-primary/20"></div>
            <div className="flex gap-1">
              <button className="p-2 text-slate-500 hover:text-primary transition-colors hover:bg-primary/10 rounded-lg">
                <span className="material-symbols-outlined">folder_open</span>
              </button>
              <button className="p-2 text-slate-500 hover:text-red-500 transition-colors hover:bg-red-500/10 rounded-lg">
                <span className="material-symbols-outlined">pause_circle</span>
              </button>
              <button className="p-2 text-slate-500 hover:text-primary transition-colors hover:bg-primary/10 rounded-lg">
                <span className="material-symbols-outlined">auto_awesome</span>
              </button>
            </div>
          </div>
          <div className="text-sm font-medium text-slate-400">
            Current Filter: <span className="text-primary font-bold">{activeFolder}</span>
          </div>
        </div>

        {(activeFolder === 'All Creatives' || activeFolder === 'Organic Stars') && (
          <section className="mb-12 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary">auto_graph</span>
              <h3 className="text-md font-extrabold uppercase tracking-wide">Organic Stars</h3>
              <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold">TOP PERFORMERS</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {organicStars.map((item, idx) => (
                <CreativeCard key={idx} {...item} type="organic" />
              ))}
            </div>
          </section>
        )}

        {(activeFolder === 'All Creatives' || activeFolder === 'At Risk') && (
          <section className="animate-in fade-in duration-300">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-red-500">trending_down</span>
              <h3 className="text-md font-extrabold uppercase tracking-wide">Optimization Needed</h3>
              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-500 text-[10px] font-bold">WASTEFUL SPEND</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {optimizationNeeded.map((item, idx) => (
                <CreativeCard key={idx} {...item} type="wasteful" />
              ))}
            </div>
          </section>
        )}

        {activeFolder !== 'All Creatives' && activeFolder !== 'Organic Stars' && activeFolder !== 'At Risk' && (
          <div className="py-20 text-center animate-in fade-in duration-500">
            <span className="material-symbols-outlined text-6xl text-slate-100 mb-4">search_off</span>
            <p className="text-slate-400 font-bold">No items found in {activeFolder}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CreativeCard = ({ title, spend, roas, revenue, img, type, status }: any) => (
  <div className={`bg-white dark:bg-surface-dark border rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-300
    ${type === 'wasteful' ? 'border-red-500/20 hover:border-red-500' : 'border-primary/10 hover:border-primary/40'}`}>
    <div className="relative aspect-[9/16] overflow-hidden bg-slate-900">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" 
        style={{backgroundImage: `url('${img}')`}}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
      <div className="absolute top-3 left-3 flex gap-1">
        <span className={`${type === 'wasteful' && status === 'Bleeding' ? 'bg-red-500' : 'bg-primary'} px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase`}>
          {type === 'wasteful' ? status : 'Delivering'}
        </span>
        {type === 'organic' && (
          <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase flex items-center gap-1">
            <span className="material-symbols-outlined text-[10px] fill-1">eco</span> Organic
          </span>
        )}
      </div>
      <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white">
          <span className="material-symbols-outlined text-3xl">play_arrow</span>
        </div>
      </button>
      <div className="absolute bottom-3 left-3 right-3">
        <p className="text-white text-xs font-bold truncate mb-2">{title}</p>
        <div className="h-6 flex items-end">
          <svg className={`w-full h-full fill-none stroke-2 ${type === 'wasteful' ? 'stroke-red-500' : 'stroke-primary'}`}>
            <path d="M0 15 Q 25 10, 50 12 T 100 5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
    <div className={`p-4 ${type === 'wasteful' ? 'bg-red-500/5' : 'bg-slate-50/50 dark:bg-black/20'}`}>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 font-medium uppercase">Spend</span>
          <span className="text-sm font-bold">{spend}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 font-medium uppercase">ROAS</span>
          <span className={`text-sm font-bold ${type === 'wasteful' && roas.includes('0.') ? 'text-red-500' : 'text-primary'}`}>{roas}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 font-medium uppercase">Revenue</span>
          <span className="text-sm font-bold">{revenue}</span>
        </div>
      </div>
      {type === 'wasteful' && status === 'Bleeding' && (
        <button className="mt-4 w-full py-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded hover:brightness-110 transition-all">
          Pause Ad Now
        </button>
      )}
    </div>
  </div>
);

export default Creatives;
