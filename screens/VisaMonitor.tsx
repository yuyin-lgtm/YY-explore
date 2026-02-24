
import React, { useState } from 'react';

const VisaMonitor: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'setup' | 'about'>('setup');

  const steps = [
    {
      icon: 'download',
      title: 'Load the Extension',
      description: 'Open Chrome and go to chrome://extensions. Enable "Developer mode" in the top right, then click "Load unpacked" and select the visa-monitor-extension folder from this project.',
    },
    {
      icon: 'login',
      title: 'Log In to Visa Scheduling',
      description: 'Navigate to usvisascheduling.com and log in with your credentials. Complete any security questions and captchas. The extension needs your active session.',
    },
    {
      icon: 'calendar_month',
      title: 'Go to the Schedule Page',
      description: 'Navigate to the appointment scheduling page. The extension will automatically hook into the scheduling API to watch for available slots.',
    },
    {
      icon: 'play_arrow',
      title: 'Start Monitoring',
      description: 'Click the extension icon in your toolbar and hit "Start Monitoring". Choose your refresh interval (how often to re-check). The page will auto-refresh to check for new slots.',
    },
    {
      icon: 'notifications_active',
      title: 'Get Notified',
      description: 'When slots appear, you\'ll get a desktop notification with a sound alert. Click the notification to jump straight to the scheduling page and book your appointment.',
    },
  ];

  const features = [
    { icon: 'api', label: 'API Interception', desc: 'Hooks into the ScheduleDays API endpoint to detect available appointment days in real-time.' },
    { icon: 'autorenew', label: 'Auto-Refresh', desc: 'Automatically refreshes the scheduling page at your chosen interval (15s to 5 min).' },
    { icon: 'volume_up', label: 'Sound Alerts', desc: 'Plays a distinct audio tone when slots are found so you never miss an opening.' },
    { icon: 'desktop_windows', label: 'Desktop Notifications', desc: 'Chrome desktop notifications with slot dates that you can click to open the page.' },
    { icon: 'lock', label: 'Privacy First', desc: 'Runs entirely in your browser. No data is sent to any third-party server.' },
    { icon: 'schedule', label: 'Persistent Monitoring', desc: 'Keeps checking as long as Chrome is open and the tab is active.' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-[1000px] mx-auto">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-900 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-4xl">flight</span>
            <div>
              <h1 className="text-2xl font-extrabold">US Visa Slot Monitor</h1>
              <p className="text-blue-200 text-sm">Chrome extension for usvisascheduling.com appointment notifications</p>
            </div>
          </div>
          <p className="text-blue-100 text-sm max-w-xl leading-relaxed">
            Never miss an available visa appointment again. This extension monitors the scheduling page
            and notifies you the moment a slot opens up — with desktop notifications and sound alerts.
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2">
        {(['setup', 'about'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-slate-100 dark:bg-border-dark text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-surface-dark'
            }`}
          >
            {tab === 'setup' ? 'Setup Guide' : 'How It Works'}
          </button>
        ))}
      </div>

      {/* Setup Tab */}
      {activeTab === 'setup' && (
        <div className="space-y-4">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="flex gap-5 p-5 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark"
            >
              <div className="shrink-0 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-extrabold text-sm">
                  {idx + 1}
                </div>
                {idx < steps.length - 1 && (
                  <div className="w-0.5 flex-1 bg-slate-200 dark:bg-border-dark mt-2"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-primary text-lg">{step.icon}</span>
                  <h3 className="font-bold text-sm">{step.title}</h3>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}

          {/* Warning */}
          <div className="flex gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30">
            <span className="material-symbols-outlined text-amber-500 shrink-0">warning</span>
            <div>
              <h4 className="text-sm font-bold text-amber-700 dark:text-amber-400">Important Notes</h4>
              <ul className="text-xs text-amber-600 dark:text-amber-300 mt-1 space-y-1 list-disc list-inside">
                <li>You must be logged in to usvisascheduling.com for this to work.</li>
                <li>Keep the scheduling tab open — the extension monitors that tab.</li>
                <li>Use a reasonable refresh interval (30s+) to avoid being rate-limited.</li>
                <li>When a slot appears, book it immediately — they go fast!</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* About Tab */}
      {activeTab === 'about' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="flex gap-3 p-4 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-lg">{feat.icon}</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold">{feat.label}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Architecture */}
          <div className="p-5 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">architecture</span>
              How It Works
            </h3>
            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-3 leading-relaxed">
              <p>
                The extension injects a content script into usvisascheduling.com pages that intercepts
                <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-border-dark rounded text-xs font-mono">fetch()</code> and
                <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-border-dark rounded text-xs font-mono">XMLHttpRequest</code> calls.
              </p>
              <p>
                When the page makes a request to the scheduling API endpoint
                (<code className="px-1.5 py-0.5 bg-slate-100 dark:bg-border-dark rounded text-xs font-mono">/api/v1/schedule-group/get-family-consular-schedule-days</code>),
                the extension reads the response and checks if the <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-border-dark rounded text-xs font-mono">ScheduleDays</code> array contains any entries.
              </p>
              <p>
                If slots are found, it sends a message to the background service worker, which triggers a desktop
                notification and an audio alert. The page auto-refreshes at your configured interval to keep checking.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisaMonitor;
