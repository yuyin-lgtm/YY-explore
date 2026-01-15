
import React from 'react';

const Campaigns: React.FC = () => {
  const campaigns = [
    { name: 'Summer_Sale_Flash_TikTok', status: 'Delivering', budget: '$500/day', spend: '$1,240', revenue: '$10,540', roas: '8.5x' },
    { name: 'Creator_Collab_Alex_04', status: 'Delivering', budget: '$200/day', spend: '$850', revenue: '$4,620', roas: '5.4x' },
    { name: 'Smart_Creative_Optimization', status: 'Learning', budget: '$1,000/day', spend: '$2,100', revenue: '$4,830', roas: '2.3x' },
    { name: 'Restock_Announcement_V2', status: 'Paused', budget: '$100/day', spend: '$450', revenue: '$1,210', roas: '2.7x' },
    { name: 'Low_Performer_Experimental', status: 'Reviewing', budget: '$50/day', spend: '$320', revenue: '$210', roas: '0.6x' },
    { name: 'Black_Friday_Warmup', status: 'Scheduled', budget: '$2,500/day', spend: '$0', revenue: '$0', roas: '0.0x' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight mb-1">Campaigns</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor and manage your GMV Max campaign performance.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg border border-slate-200 dark:border-border-dark text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
            <span className="material-symbols-outlined text-xl">file_download</span> Export
          </button>
          <button className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-primary/30 flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">add_circle</span> New Campaign
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-border-dark flex items-center gap-4">
           <div className="relative flex-1 max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-lg">search</span>
            <input className="w-full bg-slate-50 dark:bg-border-dark border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary" placeholder="Filter by campaign name..." type="text"/>
          </div>
          <button className="px-3 py-2 rounded-lg border border-slate-200 dark:border-border-dark text-xs font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">tune</span> Filters
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-border-dark bg-slate-50 dark:bg-black/20">
                <th className="p-5 w-12"><input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary" /></th>
                <th className="p-5 text-[10px] uppercase font-black text-slate-400 tracking-widest">Status</th>
                <th className="p-5 text-[10px] uppercase font-black text-slate-400 tracking-widest">Campaign Name</th>
                <th className="p-5 text-[10px] uppercase font-black text-slate-400 tracking-widest">Daily Budget</th>
                <th className="p-5 text-[10px] uppercase font-black text-slate-400 tracking-widest">Spend</th>
                <th className="p-5 text-[10px] uppercase font-black text-slate-400 tracking-widest">Revenue</th>
                <th className="p-5 text-[10px] uppercase font-black text-slate-400 tracking-widest text-right">ROAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-dark/50 text-sm">
              {campaigns.map((camp, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-black/20 transition-all group">
                  <td className="p-5"><input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary" /></td>
                  <td className="p-5">
                    <span className={`flex items-center gap-1.5 font-bold text-[10px] uppercase px-2 py-1 rounded-full
                      ${camp.status === 'Delivering' ? 'bg-emerald-500/10 text-emerald-500' : 
                        camp.status === 'Learning' ? 'bg-primary/10 text-primary' : 
                        camp.status === 'Paused' ? 'bg-slate-200 text-slate-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      <span className="size-1.5 rounded-full bg-current animate-pulse"></span>
                      {camp.status}
                    </span>
                  </td>
                  <td className="p-5 font-bold">{camp.name}</td>
                  <td className="p-5 text-slate-500">{camp.budget}</td>
                  <td className="p-5 font-medium">{camp.spend}</td>
                  <td className="p-5 font-bold">{camp.revenue}</td>
                  <td className="p-5 text-right font-black text-primary">{camp.roas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Campaigns;
