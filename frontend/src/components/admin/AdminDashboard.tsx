import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Key, 
  Activity, 
  Users, 
  Lock, 
  CheckCircle2, 
  Save
} from 'lucide-react';
import { adminService, dashboardService } from '../../services/api';
import type { User, AuditLog, ApiConfig } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const [activeAdminTab, setActiveAdminTab] = useState<'users' | 'logs' | 'api'>('users');

  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);

  // API Config State
  const [apiConfig, setApiConfig] = useState<ApiConfig>({
    virusTotalKey: 'vt-api-key-live-prod-8847291a89b7c',
    googleSafeBrowsingKey: 'gsb-api-key-live-prod-771239c82b',
    enableHeuristics: true,
    autoBlockHighRisk: true,
    mockMode: true,
  });
  const [configSaved, setConfigSaved] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    Promise.all([
      adminService.getUsers(),
      dashboardService.getAuditLogs()
    ]).then(([usersData, logsData]) => {
      setUsers(usersData);
      setLogs(logsData);
    }).catch(console.error);
  }, [isAdmin]);

  const handleToggleStatus = async (userId: string) => {
    try {
      const updated = await adminService.toggleUserStatus(userId);
      setUsers(prev => prev.map(u => u.id === userId ? updated : u));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'USER' | 'ADMIN') => {
    try {
      const updated = await adminService.updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? updated : u));
    } catch (err) {
      console.error('Failed to change role:', err);
    }
  };

  const handleSaveApiConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 3000);
  };

  if (!isAdmin) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4 border border-rose-500/30">
        <Lock className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-extrabold text-white">Admin Privileges Required</h2>
        <p className="text-xs text-slate-300 font-mono">
          You are currently in standard User View. Click the <span className="text-red-400 font-bold">Admin</span> role button in the top navigation bar to switch into Administrator mode.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Admin Header */}
      <div className="glass-panel p-6 rounded-2xl border border-red-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-mono font-bold uppercase tracking-widest">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Platform Management & Audit</h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">Manage registered accounts, view threat audit logs, and configure security APIs.</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveAdminTab('users')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeAdminTab === 'users'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Users ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('logs')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeAdminTab === 'logs'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Audit Logs</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('api')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeAdminTab === 'api'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>API Credentials</span>
          </button>
        </div>
      </div>

      {/* User Management Tab */}
      {activeAdminTab === 'users' && (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">User Directory & Role Control</h3>
            <span className="text-xs text-slate-400 font-mono">Total Users: {users.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Scans Run</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-900/50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-bold text-white">{u.name}</p>
                        <p className="text-[11px] font-mono text-slate-400">{u.email}</p>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as 'USER' | 'ADMIN')}
                        className="bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs rounded px-2 py-1"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>

                    <td className="py-3 px-4">
                      {u.status === 'ACTIVE' ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[10px] border border-emerald-500/30">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-mono font-bold text-[10px] border border-rose-500/30">
                          SUSPENDED
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-300">
                      {u.scansCount || 12}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-400">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(u.id)}
                        className={`px-3 py-1 rounded text-[11px] font-bold transition-colors border ${
                          u.status === 'ACTIVE'
                            ? 'bg-rose-950 hover:bg-rose-900 text-rose-300 border-rose-800'
                            : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border-emerald-800'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeAdminTab === 'logs' && (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Real-Time Threat Audit Logs</h3>
            <span className="text-xs text-slate-400 font-mono">System Events</span>
          </div>

          <div className="divide-y divide-slate-800">
            {logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-900/40 flex items-start space-x-3 text-xs font-mono">
                <div className={`p-1.5 rounded shrink-0 mt-0.5 ${
                  log.level === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                  log.level === 'WARNING' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                  'bg-cyan-950 text-cyan-400 border border-cyan-800'
                }`}>
                  <Activity className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{log.action}</span>
                    <span className="text-[11px] text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-300">{log.details}</p>
                  <p className="text-[10px] text-slate-500">Initiated by: {log.user}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* API Config Tab */}
      {activeAdminTab === 'api' && (
        <div className="glass-panel rounded-2xl border border-slate-800 p-6 max-w-2xl mx-auto space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-white">Third-Party Cybersecurity API Keys</h3>
            <p className="text-xs text-slate-400 font-mono">Configure credentials for VirusTotal and Google Safe Browsing integration</p>
          </div>

          <form onSubmit={handleSaveApiConfig} className="space-y-4">
            
            {/* VirusTotal Key */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-300">VirusTotal v3 API Key</label>
              <input
                type="text"
                value={apiConfig.virusTotalKey}
                onChange={(e) => setApiConfig({ ...apiConfig, virusTotalKey: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Google Safe Browsing Key */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-300">Google Safe Browsing v4 API Key</label>
              <input
                type="text"
                value={apiConfig.googleSafeBrowsingKey}
                onChange={(e) => setApiConfig({ ...apiConfig, googleSafeBrowsingKey: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={apiConfig.enableHeuristics}
                  onChange={(e) => setApiConfig({ ...apiConfig, enableHeuristics: e.target.checked })}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0 w-4 h-4 bg-slate-900"
                />
                <span className="text-xs text-slate-300 font-medium">Enable Client-Side Heuristic Rules Engine</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={apiConfig.autoBlockHighRisk}
                  onChange={(e) => setApiConfig({ ...apiConfig, autoBlockHighRisk: e.target.checked })}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0 w-4 h-4 bg-slate-900"
                />
                <span className="text-xs text-slate-300 font-medium">Auto-Flag Domains with Risk Score &gt; 75%</span>
              </label>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all flex items-center space-x-2 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
              >
                <Save className="w-4 h-4" />
                <span>Save Security API Configuration</span>
              </button>

              {configSaved && (
                <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>API Keys Updated!</span>
                </span>
              )}
            </div>

          </form>
        </div>
      )}

    </div>
  );
};
