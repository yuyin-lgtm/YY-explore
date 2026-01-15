
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const WasteReport: React.FC = () => {
  const scatterData = [
    { x: 0.5, y: 8000, z: 200, status: 'waste' },
    { x: 0.8, y: 6500, z: 150, status: 'waste' },
    { x: 1.2, y: 3000, z: 300, status: 'efficient' },
    { x: 2.5, y: 9000, z: 500, status: 'efficient' },
    { x: 3.2, y: 5000, z: 400, status: 'efficient' },
    { x: 1.5, y: 4500, z: 250, status: 'waste' },
    { x: 4.1, y: 7500, z: 600, status: 'efficient' },
    { x: 0.3, y: 4000, z: 100, status: 'waste' },
  ];

  const bucketData = [
    { name: '< 1x WASTE', value: 12430, color: '#EF5350' },
    { name: '1x - 2x AT RISK', value: 8120, color: '#FFB74D' },
    { name: '2x - 3x HEALTHY', value: 22300, color: '#4FC3F7' },
    { name: '3x+ SCALING', value: 35100, color: '#359EFF' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard label="Wasteful Spend %" value="24.5%" trend="+2.1%" color="red" footer="Budget spent on < 1.0 ROAS" />
        <KPICard label="Total Waste ($)" value="-$12,430" trend="-5.4%" color="orange" footer="Opportunity cost identified" />
        <KPICard label="Concentration Metric" value="Diversified" trend="Optimal" color="primary" footer="Budget spread across 45 groups" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="text-base font-bold">Spend vs ROAS Distribution</h4>
              <p className="text-xs text-slate-400">Identifying creative outliers and inefficiency clusters</p>
            </div>
            <div className="flex gap-4">
              <LegendItem color="bg-red-500" label="Waste" />
              <LegendItem color="bg-primary" label="Efficient" />
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis type="number" dataKey="x" name="ROAS" unit="x" axisLine={false} tickLine={false} style={{ fontSize: '10px', fontWeight: 'bold' }} />
                <YAxis type="number" dataKey="y" name="Spend" unit="$" axisLine={false} tickLine={false} style={{ fontSize: '10px', fontWeight: 'bold' }} />
                <ZAxis type="number" dataKey="z" range={[50, 400]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter data={scatterData}>
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.status === 'waste' ? '#EF5350' : '#359EFF'} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm flex flex-col">
          <h4 className="text-base font-bold mb-1">Spend by ROI Bucket</h4>
          <p className="text-xs text-slate-400 mb-6">Budget allocation by performance tier</p>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bucketData} layout="vertical" margin={{ left: 0, right: 30 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} style={{ fontSize: '10px', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {bucketData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl flex flex-col md:flex-row items-center gap-6">
        <div className="size-16 bg-primary/20 rounded-full flex items-center justify-center text-primary shrink-0">
          <span className="material-symbols-outlined text-4xl">lightbulb</span>
        </div>
        <div className="flex-1">
          <h5 className="text-lg font-bold text-primary mb-1">Concentration Insight</h5>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            Your budget is spread across 45 different item groups. Data suggests that <span className="font-bold">consolidating spend</span> from the 10 lowest performers into the top 3 scaling creatives could reduce total waste by <span className="font-bold underline decoration-2">12% within 7 days</span>.
          </p>
        </div>
        <button className="bg-primary text-white font-bold py-2.5 px-6 rounded-lg shadow-md hover:bg-primary/90 transition-all">Optimize Distribution</button>
      </div>
    </div>
  );
};

const KPICard = ({ label, value, trend, color, footer }: any) => (
  <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm relative overflow-hidden group">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <h3 className="text-3xl font-black mt-1 tracking-tight">{value}</h3>
      </div>
      <div className={`px-2 py-1 rounded text-xs font-black
        ${color === 'red' ? 'bg-red-500/10 text-red-500' : color === 'orange' ? 'bg-orange-500/10 text-orange-500' : 'bg-primary/10 text-primary'}`}>
        {trend}
      </div>
    </div>
    <div className="relative h-2 w-full bg-slate-100 dark:bg-border-dark rounded-full overflow-hidden">
      <div className={`absolute left-0 top-0 h-full rounded-full w-[60%] 
        ${color === 'red' ? 'bg-red-500' : color === 'orange' ? 'bg-orange-500' : 'bg-primary'}`} />
    </div>
    <p className="text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-wider">{footer}</p>
  </div>
);

const LegendItem = ({ color, label }: any) => (
  <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
    <span className={`w-2 h-2 rounded-full ${color}`} /> {label}
  </span>
);

export default WasteReport;
