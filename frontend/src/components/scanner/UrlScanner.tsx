import React, { useState } from 'react';
import { 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  Unlock, 
  Globe, 
  Cpu, 
  ExternalLink,
  FileText,
  Copy,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { scanService } from '../../services/api';
import type { ScanResult } from '../../types';
import { RiskGauge } from './RiskGauge';
import { useAuth } from '../../context/AuthContext';

interface UrlScannerProps {
  onReportGenerated: (scan: ScanResult) => void;
}

export const UrlScanner: React.FC<UrlScannerProps> = ({ onReportGenerated }) => {
  const { user } = useAuth();
  const [urlInput, setUrlInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [copied, setCopied] = useState(false);

  const sampleUrls = [
    { label: 'Phishing Spoof', url: 'http://login-verify-paypal-update-account.xyz/signin' },
    { label: 'IP Hostname Phish', url: 'http://192.168.1.105/auth/microsoft-login-form.php' },
    { label: 'Safe Domain', url: 'https://github.com/kovid2580-blip/ai-phishing-detection-platform' },
  ];

  const handleScan = async (targetUrl?: string) => {
    const urlToScan = targetUrl || urlInput;
    if (!urlToScan.trim()) return;

    setIsScanning(true);
    setScanResult(null);

    try {
      await new Promise(r => setTimeout(r, 1200));
      const result = await scanService.scanUrl(urlToScan, user?.id || 'user-1');
      setScanResult(result);
    } catch (err) {
      console.error('Scan failed:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleCopy = () => {
    if (!scanResult) return;
    navigator.clipboard.writeText(JSON.stringify(scanResult, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="relative glass-panel rounded-2xl p-6 sm:p-8 overflow-hidden border border-cyan-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Cpu className="w-3.5 h-3.5 animate-pulse" />
            <span>AI Real-Time URL Inspector</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Detect Suspicious URLs & Cyber Attacks
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Enter any web link to perform deep cybersecurity analysis using VirusTotal reputation engines, Google Safe Browsing heuristics, SSL checks, and domain entropy calculation.
          </p>

          {/* Search Input */}
          <form onSubmit={(e) => { e.preventDefault(); handleScan(); }} className="mt-6">
            <div className="relative flex items-center">
              <div className="absolute left-4 text-slate-400 pointer-events-none">
                <Globe className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste suspicious URL (e.g., http://verify-account-update.xyz/login)..."
                className="w-full pl-12 pr-36 py-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
              />
              <button
                type="submit"
                disabled={isScanning || !urlInput.trim()}
                className="absolute right-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition-all flex items-center space-x-2 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 text-slate-950" />
                    <span>Scan URL</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Sample Preset Buttons */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">Try sample target:</span>
            {sampleUrls.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setUrlInput(sample.url);
                  handleScan(sample.url);
                }}
                className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 font-mono transition-colors flex items-center space-x-1"
              >
                <span>{sample.label}</span>
                <ExternalLink className="w-3 h-3 text-cyan-400" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Radar Animation Overlay while scanning */}
      {isScanning && (
        <div className="glass-panel rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4 border border-cyan-500/30">
          <div className="relative w-28 h-28 rounded-full border-2 border-cyan-500/40 flex items-center justify-center radar-sweep">
            <Globe className="w-10 h-10 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">Executing Multi-Layer Security Scan</h3>
            <p className="text-xs text-slate-400 font-mono mt-1">Checking VirusTotal • Google Safe Browsing • SSL Certificates • Heuristics</p>
          </div>
        </div>
      )}

      {/* Scan Results Display */}
      {scanResult && scanResult.scan_type === 'URL' && scanResult.details.urlDetails && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Main Summary Card */}
          <div className="glass-panel-glow rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Risk Gauge */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800 pb-6 lg:pb-0 lg:pr-6">
              <RiskGauge score={scanResult.risk_score} level={scanResult.risk_level} size={190} />
              <div className="mt-4 text-center">
                <p className="text-xs font-mono text-slate-400">Analysis Completed At</p>
                <p className="text-xs font-semibold text-slate-200">{new Date(scanResult.created_at).toLocaleString()}</p>
              </div>
            </div>

            {/* Assessment & Actions */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">TARGET DOMAIN</span>
                  <h2 className="text-2xl font-bold text-white font-mono break-all">
                    {scanResult.details.urlDetails.domain}
                  </h2>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center space-x-1.5 border border-slate-700"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Data'}</span>
                  </button>

                  <button
                    onClick={() => onReportGenerated(scanResult)}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold transition-colors flex items-center space-x-1.5 border border-cyan-500/40"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Security Report</span>
                  </button>
                </div>
              </div>

              {/* Recommendation Alert Box */}
              <div className={`p-4 rounded-xl border flex items-start space-x-3 ${
                scanResult.risk_level === 'CRITICAL' || scanResult.risk_level === 'HIGH'
                  ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                  : scanResult.risk_level === 'MEDIUM'
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                  : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              }`}>
                {scanResult.risk_level === 'CRITICAL' || scanResult.risk_level === 'HIGH' ? (
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                ) : scanResult.risk_level === 'MEDIUM' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-sm font-bold tracking-wide">Threat Mitigation Advice</h4>
                  <p className="text-xs mt-1 leading-relaxed">{scanResult.recommendation}</p>
                </div>
              </div>

              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">HTTPS Protocol</span>
                  <div className="flex items-center space-x-1.5 mt-1 font-bold text-sm">
                    {scanResult.details.urlDetails.isHttps ? (
                      <>
                        <Lock className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">Secure (HTTPS)</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4 text-rose-400" />
                        <span className="text-rose-400">Insecure (HTTP)</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Domain Age</span>
                  <div className="mt-1 font-bold text-sm text-white font-mono">
                    {scanResult.details.urlDetails.domainAgeDays} days
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">IP Hostname</span>
                  <div className="mt-1 font-bold text-sm font-mono">
                    {scanResult.details.urlDetails.ipHostname ? (
                      <span className="text-rose-400">Raw IP Detected</span>
                    ) : (
                      <span className="text-emerald-400">Valid Domain</span>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Entropy Score</span>
                  <div className="mt-1 font-bold text-sm text-white font-mono">
                    {scanResult.details.urlDetails.entropyScore}
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Detailed Security Engine Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* VirusTotal Engine Breakdown */}
            <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-white text-sm">VirusTotal API Intelligence</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">90 Engine Audits</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Malicious Flagged</span>
                  <span className="font-bold text-rose-400 font-mono">
                    {scanResult.details.urlDetails.virusTotalReputation.malicious} / {scanResult.details.urlDetails.virusTotalReputation.total}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-rose-500 h-full transition-all" 
                    style={{ width: `${(scanResult.details.urlDetails.virusTotalReputation.malicious / 90) * 100}%` }} 
                  />
                  <div 
                    className="bg-emerald-500 h-full transition-all" 
                    style={{ width: `${(scanResult.details.urlDetails.virusTotalReputation.harmless / 90) * 100}%` }} 
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">Harmless / Verified</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    {scanResult.details.urlDetails.virusTotalReputation.harmless} engines
                  </span>
                </div>
              </div>
            </div>

            {/* Google Safe Browsing Engine */}
            <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-white text-sm">Google Safe Browsing API</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Blacklist Check</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Blacklist Status</span>
                  {scanResult.details.urlDetails.googleSafeBrowsing.isBlacklisted ? (
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/40">
                      BLACKLISTED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40">
                      CLEAN / PASSED
                    </span>
                  )}
                </div>

                {scanResult.details.urlDetails.googleSafeBrowsing.threatType && (
                  <div className="flex items-center justify-between text-xs pt-2">
                    <span className="text-slate-400">Threat Type Classification</span>
                    <span className="font-mono text-rose-300 font-semibold">
                      {scanResult.details.urlDetails.googleSafeBrowsing.threatType}
                    </span>
                  </div>
                )}

                {scanResult.details.urlDetails.suspiciousKeywords.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] text-slate-400 font-mono block mb-1.5">Detected Phishing Keywords:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {scanResult.details.urlDetails.suspiciousKeywords.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[11px] font-mono">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
