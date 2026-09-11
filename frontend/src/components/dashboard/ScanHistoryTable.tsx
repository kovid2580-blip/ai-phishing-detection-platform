import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Globe, 
  Mail, 
  FileText, 
  Trash2, 
  ShieldCheck,
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import { scanService } from '../../services/api';
import type { ScanResult, RiskLevel } from '../../types';

interface ScanHistoryTableProps {
  onViewReport: (scan: ScanResult) => void;
}

export const ScanHistoryTable: React.FC<ScanHistoryTableProps> = ({ onViewReport }) => {
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');

  const fetchScans = async () => {
    setLoading(true);
    try {
      const data = await scanService.getScanHistory();
      setScans(data);
    } catch (err) {
      console.error('Failed to load scan history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this scan record from history?')) {
      await scanService.deleteScan(id);
      setScans(prev => prev.filter(s => s.id !== id));
    }
  };

  const filteredScans = scans.filter(scan => {
    const matchesSearch = scan.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          scan.recommendation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = selectedRiskFilter === 'ALL' || scan.risk_level === selectedRiskFilter;
    const matchesType = selectedTypeFilter === 'ALL' || scan.scan_type === selectedTypeFilter;
    return matchesSearch && matchesRisk && matchesType;
  });

  const getRiskBadge = (level: RiskLevel, score: number) => {
    let style = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    if (level === 'CRITICAL') style = 'bg-rose-500/20 text-rose-400 border-rose-500/40 glow-red';
    else if (level === 'HIGH') style = 'bg-orange-500/20 text-orange-400 border-orange-500/40';
    else if (level === 'MEDIUM') style = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    else if (level === 'LOW') style = 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';

    return (
      <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${style}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        <span>{level} ({score}%)</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header & Controls */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Scan Audit Logs & History</h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">Archive of performed URL inspections and email analysis reports</p>
          </div>

          <button
            onClick={fetchScans}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center space-x-2 self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Refresh History</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search bar */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by domain, URL, or keywords..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          {/* Risk Level Filter */}
          <div className="sm:col-span-3 relative">
            <select
              value={selectedRiskFilter}
              onChange={(e) => setSelectedRiskFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-cyan-400 font-mono appearance-none"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">Critical Phishing</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
              <option value="SAFE">Safe / Clean</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>

          {/* Scan Type Filter */}
          <div className="sm:col-span-3 relative">
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-cyan-400 font-mono appearance-none"
            >
              <option value="ALL">All Scan Types</option>
              <option value="URL">URL Inspections</option>
              <option value="EMAIL">Email Scans</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>

        </div>
      </div>

      {/* Scans Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-mono text-sm flex items-center justify-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Fetching scan database records...</span>
          </div>
        ) : filteredScans.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ShieldCheck className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Scan Records Found</h3>
            <p className="text-xs text-slate-400 font-mono">Try clearing search filters or execute a new URL/Email scan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Target / Content Snippet</th>
                  <th className="py-3.5 px-4">Risk Severity</th>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredScans.map((scan) => (
                  <tr 
                    key={scan.id}
                    onClick={() => onViewReport(scan)}
                    className="hover:bg-slate-900/60 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      {scan.scan_type === 'URL' ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono font-bold text-[10px]">
                          <Globe className="w-3 h-3" />
                          <span>URL</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30 font-mono font-bold text-[10px]">
                          <Mail className="w-3 h-3" />
                          <span>EMAIL</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono max-w-md truncate text-white">
                      {scan.content}
                    </td>

                    <td className="py-3.5 px-4">
                      {getRiskBadge(scan.risk_level, scan.risk_score)}
                    </td>

                    <td className="py-3.5 px-4 text-slate-300 font-semibold">
                      {scan.user_name || 'Alex Rivera'}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(scan.created_at).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); onViewReport(scan); }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors text-[11px] inline-flex items-center space-x-1"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Report</span>
                      </button>

                      <button
                        onClick={(e) => handleDelete(scan.id, e)}
                        title="Delete record"
                        className="p-1 rounded bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors inline-flex"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
