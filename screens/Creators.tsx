
import React from 'react';

const Creators: React.FC = () => {
  const kpis = [
    { label: 'Total Creator Spend', value: '$45,200.00', trend: '12.5%', icon: 'payments' },
    { label: 'Average ROI', value: '4.2x', trend: '0.8%', icon: 'trending_up' },
    { label: 'Active Campaigns', value: '14', trend: 'Ongoing', icon: 'campaign' },
    { label: 'Total Content', value: '284', trend: 'Videos', icon: 'video_library' },
  ];

  const creators = [
    { handle: '@sarah_trends', followers: '421k', spend: '$1,200', revenue: '$10,450', roas: '8.7x', tags: ['Top Performer', 'Beauty'], status: 'up' },
    { handle: '@tech_with_alex', followers: '1.2M', spend: '$12,500', revenue: '$48,200', roas: '3.9x', tags: ['On Retainer', 'Gadgets'], status: 'up' },
    { handle: '@jordan_vlogs', followers: '89k', spend: '$450', revenue: '$210', roas: '0.5x', tags: ['Under Review'], status: 'down' },
    { handle: '@fashion_mia', followers: '560k', spend: '$6,800', revenue: '$32,100', roas: '4.7x', tags: ['High ROAS', 'Fashion'], status: 'up' },
  ];

  return (
    <div className="p-8 flex flex-col gap-8 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tight mb-1">Creator CRM</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your creator relationships and track ROI performance.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg border border-slate-200 dark:border-border-dark text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
            <span className="material-symbols-outlined text-xl">upload_file</span> CSV Import
          </button>
          <button className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-primary/30 flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">person_add</span> Add Creator
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="p-5 rounded-xl border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark shadow-sm">
            <p className="text-slate-500 text-xs font-black uppercase tracking-wider mb-2">{kpi.label}</p>
            <div className="flex items-end gap-3">
              <span className="text-2xl font-black tracking-tight">{kpi.value}</span>
              <span className={`text-xs font-bold flex items-center mb-1 ${kpi.trend.includes('%') ? 'text-emerald-500' : 'text-slate-400'}`}>
                {kpi.trend.includes('%') && <span className="material-symbols-outlined text-sm">trending_up</span>}
                {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">search</span>
          <input className="w-full bg-slate-100 dark:bg-border-dark border-none rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-primary" placeholder="Search by handle or tag..." />
        </div>
        <button className="h-11 px-4 rounded-xl border border-slate-200 dark:border-border-dark flex items-center gap-2 text-xs font-bold">
          <span className="material-symbols-outlined text-lg">filter_list</span> Filter
        </button>
      </div>

      <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-border-dark bg-slate-50 dark:bg-black/20">
                <th className="p-5 text-[10px] uppercase font-black text-slate-400 tracking-widest">Creator Profile</th>
                <th className="p-5 text-[10px] uppercase font-black text-slate-400 tracking-widest">Tags</th>
                <th className="p-5 text-[10px] uppercase font-black text-slate-400 tracking-widest text-center">Videos</th>
                <th className="p-5 text-[10px] uppercase font-black text-slate-400 tracking-widest">Spend</th>
                <th className="p-5 text-[10px] uppercase font-black text-slate-400 tracking-widest">Revenue</th>
                <th className="p-5 text-[10px] uppercase font-black text-slate-400 tracking-widest text-right">ROAS</th>
                <th className="p-5 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-dark/50">
              {creators.map((c, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-black/20 transition-all group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full border-2 border-primary/30 bg-center bg-cover" style={{backgroundImage: `url('https://picsum.photos/seed/${c.handle}/100/100')`}} />
                      <div>
                        <p className="text-sm font-bold">{c.handle}</p>
                        <p className="text-[10px] text-slate-400">{c.followers} Followers</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex gap-2">
                      {c.tags.map((t, tidx) => (
                        <span key={tidx} className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${tidx === 0 ? 'bg-primary/10 text-primary' : 'bg-slate-500/10 text-slate-500'}`}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-5 text-center font-bold text-sm">{Math.floor(Math.random() * 50) + 1}</td>
                  <td className="p-5 font-bold text-sm">{c.spend}</td>
                  <td className="p-5 font-bold text-sm">{c.revenue}</td>
                  <td className="p-5 text-right">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-sm
                      ${c.status === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {c.roas}
                      <span className="material-symbols-outlined text-xs">{c.status === 'up' ? 'trending_up' : 'trending_down'}</span>
                    </div>
                  </td>
                  <td className="p-5"><span className="material-symbols-outlined text-slate-300 cursor-pointer hover:text-primary">more_vert</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Creators;
