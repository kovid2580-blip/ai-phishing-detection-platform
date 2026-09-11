import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { UrlScanner } from './components/scanner/UrlScanner';
import { EmailAnalyzer } from './components/scanner/EmailAnalyzer';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { ScanHistoryTable } from './components/dashboard/ScanHistoryTable';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SecurityReportModal } from './components/reports/SecurityReportModal';
import { AuthModal } from './components/auth/AuthModal';
import type { ScanResult } from './types';
import { ShieldCheck, Terminal, Server, Cpu } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('url-scanner');
  const [reportScan, setReportScan] = useState<ScanResult | null>(null);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans flex flex-col cyber-grid">
      
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'url-scanner' && (
          <UrlScanner onReportGenerated={(scan) => setReportScan(scan)} />
        )}

        {activeTab === 'email-analyzer' && (
          <EmailAnalyzer onReportGenerated={(scan) => setReportScan(scan)} />
        )}

        {activeTab === 'dashboard' && (
          <OverviewDashboard 
            onNavigate={(tab) => setActiveTab(tab)} 
            onViewReport={(scan) => setReportScan(scan)} 
          />
        )}

        {activeTab === 'history' && (
          <ScanHistoryTable onViewReport={(scan) => setReportScan(scan)} />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 text-xs py-8 mt-12 glass-panel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          <div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span className="font-extrabold text-white text-sm">AI Phishing Detection Platform</span>
            </div>
            <p className="text-slate-400 mt-1 text-[11px] leading-relaxed">
              Enterprise cybersecurity application engineered with React, Java Spring Boot, VirusTotal API, and Google Safe Browsing heuristics.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-slate-400 font-mono text-[11px]">
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 flex items-center space-x-1">
              <Server className="w-3 h-3 text-emerald-400" />
              <span>Spring Boot REST</span>
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 flex items-center space-x-1">
              <Terminal className="w-3 h-3 text-cyan-400" />
              <span>VirusTotal v3</span>
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 flex items-center space-x-1">
              <Cpu className="w-3 h-3 text-purple-400" />
              <span>Google Safe Browsing</span>
            </span>
          </div>

          <div className="text-right text-slate-400 font-mono text-[11px]">
            <p>© 2026 AI Phishing Detection Platform</p>
            <p className="text-cyan-400 font-bold mt-0.5">Dual Mode Engine Active</p>
          </div>

        </div>
      </footer>

      {/* Modals */}
      <SecurityReportModal scan={reportScan} onClose={() => setReportScan(null)} />
      <AuthModal />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
