import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Globe, 
  Mail, 
  TrendingUp, 
  Zap,
  Activity
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { dashboardService } from '../../services/api';
import type { SystemStats, ScanResult } from '../../types';

interface OverviewDashboardProps {
  onNavigate: (tab: string) => void;
  onViewReport: (scan: ScanResult) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<SystemStats | null>(null);

  useEffect(() => {
    dashboardService.getStats().then(setStats).catch(console.error);
  }, []);

  if (!stats) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center flex flex-col items-center justify-center">
        <Activity className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
        <span className="text-sm text-slate-300 font-mono">Loading Security Analytics & Threat Intelligence...</span>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Scans Executed', value: stats.totalScans, icon: Zap, color: 'cyan', change: '+18% this week' },
    { title: 'Phishing Attacks Blocked', value: stats.phishingDetected, icon: ShieldAlert, color: 'red', change: '+24% detected' },
    { title: 'Safe Domains Verified', value: stats.safeUrls, icon: ShieldCheck, color: 'emerald', change: '99.4% accuracy' },
    { title: 'Emails Analyzed', value: stats.emailsAnalyzed, icon: Mail, color: 'purple', change: '+12% volume' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Live Threat Intelligence Engine Connected</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
            Cybersecurity Analytics & Risk Radar
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time phishing threat metrics, URL scanning stats, and API risk breakdowns.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('url-scanner')}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all flex items-center space-x-1.5 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          >
            <Globe className="w-4 h-4" />
            <span>Scan URL</span>
          </button>

          <button
            onClick={() => onNavigate('email-analyzer')}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all flex items-center space-x-1.5 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
          >
            <Mail className="w-4 h-4" />
            <span>Analyze Email</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="glass-panel p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{card.title}</span>
                <div className={`p-2 rounded-lg bg-slate-900 border border-slate-800 text-${card.color}-400`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="text-3xl font-extrabold text-white tracking-tight font-mono">
                  {card.value.toLocaleString()}
                </h3>
                <span className="text-[11px] font-semibold text-emerald-400 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                  {card.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Threat Trend Area Chart */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">Weekly Scan Volume & Threat Velocity</h3>
              <p className="text-xs text-slate-400 font-mono">Aggregated daily URL and Email inspection metrics</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 text-xs font-mono border border-cyan-500/30">
              7-Day Activity
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.scanHistoryTrend}>
                <defs>
                  <linearGradient id="urlGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF1744" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#FF1744" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="urlScans" name="URL Scans" stroke="#00F0FF" fillOpacity={1} fill="url(#urlGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="threats" name="Threats Detected" stroke="#FF1744" fillOpacity={1} fill="url(#threatGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Donut Chart */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white tracking-wide">Risk Level Breakdown</h3>
            <p className="text-xs text-slate-400 font-mono">Severity categorization</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="space-y-1.5 pt-2">
            {stats.riskDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
