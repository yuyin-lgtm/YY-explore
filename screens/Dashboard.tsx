
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Total Spend', value: '$4,200.50', trend: '+5.4%', trendType: 'up', icon: 'payments' },
    { label: 'Total Orders', value: '1,120', trend: '-2.1%', trendType: 'down', icon: 'shopping_bag' },
    { label: 'Revenue', value: '$32,450.00', trend: '+12.8%', trendType: 'up', icon: 'monetization_on' },
    { label: 'Avg. ROAS', value: '7.7x', trend: '+0.8x', trendType: 'up', icon: 'star', primary: true },
  ];

  const campaignStatusData = [
    { name: 'Active', value: 17, color: '#359EFF' },
    { name: 'Paused', value: 3, color: '#e2e8f0' },
  ];

  const topCampaigns = [
    { name: 'Summer_Sale_Flash_TikTok', spend: '$1,240', revenue: '$10,540', roas: '8.5x', color: 'primary' },
    { name: 'Creator_Collab_Alex_04', spend: '$850', revenue: '$4,620', roas: '5.4x', color: 'primary' },
    { name: 'Smart_Creative_Optimization', spend: '$2,100', revenue: '$4,830', roas: '2.3x', color: 'amber' },
    { name: 'Restock_Announcement_V2', spend: '$450', revenue: '$1,210', roas: '2.7x', color: 'amber' },
    { name: 'Low_Performer_Experimental', spend: '$320', revenue: '$210', roas: '0.6x', color: 'red' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className={`flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark shadow-sm ${stat.primary ? 'ring-2 ring-primary/20' : ''}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
              <span className={`material-symbols-outlined text-lg ${stat.primary ? 'text-primary' : 'text-slate-400'}`}>{stat.icon}</span>
            </div>
            <p className={`tracking-tight text-3xl font-extrabold ${stat.primary ? 'text-primary' : ''}`}>{stat.value}</p>
            <div className={`flex items-center gap-1 text-sm font-bold ${stat.trendType === 'up' ? 'text-[#0bda4d]' : 'text-[#fa5c38]'}`}>
              <span className="material-symbols-outlined text-sm">{stat.trendType === 'up' ? 'trending_up' : 'trending_down'}</span>
              <span>{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Status Donut */}
        <div className="lg:col-span-1 flex flex-col rounded-xl p-6 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark shadow-sm">
          <h3 className="text-lg font-bold mb-6">Campaign Status</h3>
          <div className="flex-1 flex flex-col items-center justify-center relative py-4 min-h-[300px]">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={campaignStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  {campaignStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-extrabold">85%</span>
              <span className="text-[10px] uppercase font-bold text-slate-500">Active</span>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-4 w-full">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-primary"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Active</span>
                  <span className="text-sm font-bold">17 Campaigns</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-slate-200 dark:bg-border-dark"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Paused</span>
                  <span className="text-sm font-bold">3 Campaigns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top 5 Campaigns Table */}
        <div className="lg:col-span-2 flex flex-col rounded-xl p-6 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Top 5 Campaigns</h3>
            <button className="text-xs font-bold text-primary hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-slate-100 dark:border-border-dark">
                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="pb-3 px-2">Campaign Name</th>
                  <th className="pb-3 px-2 text-right">Spend</th>
                  <th className="pb-3 px-2 text-right">Revenue</th>
                  <th className="pb-3 px-2 text-center">ROAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-border-dark/50">
                {topCampaigns.map((camp, idx) => (
                  <tr key={idx} className="group hover:bg-slate-50 dark:hover:bg-background-dark/30 transition-colors">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-slate-100 dark:bg-border-dark flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm text-slate-500">
                            {idx % 3 === 0 ? 'video_library' : idx % 3 === 1 ? 'person' : 'auto_awesome'}
                          </span>
                        </div>
                        <span className="text-sm font-semibold truncate max-w-[220px]">{camp.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-right text-sm font-medium">{camp.spend}</td>
                    <td className="py-4 px-2 text-right text-sm font-bold">{camp.revenue}</td>
                    <td className="py-4 px-2 text-center">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ring-1 
                        ${camp.color === 'primary' ? 'bg-primary/20 text-primary ring-primary/40' : 
                          camp.color === 'amber' ? 'bg-amber-500/20 text-amber-500 ring-amber-500/40' : 
                          'bg-red-500/20 text-red-500 ring-red-500/40'}`}>
                        {camp.roas}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer Section Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex items-center gap-6 p-6 rounded-xl bg-primary/10 border border-primary/20">
          <div className="bg-primary size-12 rounded-xl flex items-center justify-center text-white shrink-0">
            <span className="material-symbols-outlined text-2xl">tips_and_updates</span>
          </div>
          <div>
            <h4 className="font-bold text-sm">Optimization Suggestion</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Campaign "Summer_Sale_Flash" is performing 40% above average. Consider increasing daily budget by 15% to capture additional evening traffic peak.</p>
          </div>
          <button className="ml-auto px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shrink-0">Apply</button>
        </div>
        <div className="flex items-center justify-between p-6 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark shadow-sm">
          <div className="flex flex-col">
            <h4 className="font-bold text-sm">Automation Status</h4>
            <p className="text-[10px] text-primary font-bold mt-1">4 RULES ACTIVE</p>
          </div>
          <span className="material-symbols-outlined text-primary text-3xl">toggle_on</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
