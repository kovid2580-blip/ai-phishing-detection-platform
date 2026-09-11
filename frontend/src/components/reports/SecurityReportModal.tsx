import React from 'react';
import { 
  X, 
  Download, 
  Printer, 
  FileText
} from 'lucide-react';
import type { ScanResult } from '../../types';
import { reportService } from '../../services/api';

interface SecurityReportModalProps {
  scan: ScanResult | null;
  onClose: () => void;
}

export const SecurityReportModal: React.FC<SecurityReportModalProps> = ({ scan, onClose }) => {
  if (!scan) return null;

  const report = reportService.generateReport(scan);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `phishing-security-report-${scan.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.15)]">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">Cybersecurity Investigation Report</h2>
              <p className="text-xs font-mono text-cyan-400">Report ID: {report.id}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadJson}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors text-xs font-mono flex items-center space-x-1"
              title="Download JSON Report"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">JSON</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors text-xs font-mono flex items-center space-x-1"
              title="Print Report"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Body Content */}
        <div className="p-6 space-y-6">
          
          {/* Executive Overview Banner */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-400 block uppercase">Target Type</span>
              <span className="font-bold text-white text-sm uppercase mt-0.5 block">{scan.scan_type}</span>
            </div>
            <div>
              <span className="text-slate-400 block uppercase">Risk Score</span>
              <span className={`font-bold text-base mt-0.5 block ${
                scan.risk_score >= 70 ? 'text-rose-400' : scan.risk_score >= 40 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {scan.risk_score}% ({scan.risk_level})
              </span>
            </div>
            <div>
              <span className="text-slate-400 block uppercase">Generated At</span>
              <span className="font-bold text-slate-200 mt-0.5 block">{new Date(scan.created_at).toLocaleString()}</span>
            </div>
          </div>

          {/* Analyzed Target Payload */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Target Content / URL Payload</h3>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 break-all">
              {scan.content}
            </div>
          </div>

          {/* Mitigation Directive */}
          <div className={`p-4 rounded-xl border space-y-1 ${
            scan.risk_level === 'CRITICAL' || scan.risk_level === 'HIGH'
              ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              : scan.risk_level === 'MEDIUM'
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
              : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
          }`}>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider">Security Directive</h4>
            <p className="text-xs leading-relaxed">{scan.recommendation}</p>
          </div>

          {/* Technical Details Breakdown */}
          {scan.scan_type === 'URL' && scan.details.urlDetails && (
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Deep Inspection Metrics</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Domain</span>
                  <span className="text-white font-bold">{scan.details.urlDetails.domain}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">HTTPS SSL</span>
                  <span className={scan.details.urlDetails.isHttps ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {scan.details.urlDetails.isHttps ? 'Valid HTTPS' : 'No Encryption'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Domain Age</span>
                  <span className="text-white font-bold">{scan.details.urlDetails.domainAgeDays} days</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">VirusTotal Flags</span>
                  <span className="text-rose-400 font-bold">
                    {scan.details.urlDetails.virusTotalReputation.malicious} / {scan.details.urlDetails.virusTotalReputation.total}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Google Safe Browsing</span>
                  <span className={scan.details.urlDetails.googleSafeBrowsing.isBlacklisted ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {scan.details.urlDetails.googleSafeBrowsing.isBlacklisted ? 'Blacklisted' : 'Clean'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Entropy Score</span>
                  <span className="text-white font-bold">{scan.details.urlDetails.entropyScore}</span>
                </div>
              </div>
            </div>
          )}

          {scan.scan_type === 'EMAIL' && scan.details.emailDetails && (
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Email Forensic Flags</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Urgency Language</span>
                  <span className={scan.details.emailDetails.urgentLanguageDetected ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                    {scan.details.emailDetails.urgentLanguageDetected ? 'Detected' : 'Normal'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Credential Harvester</span>
                  <span className={scan.details.emailDetails.credentialRequestDetected ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                    {scan.details.emailDetails.credentialRequestDetected ? 'Detected' : 'None'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Extracted Links</span>
                  <span className="text-cyan-300 font-bold">{scan.details.emailDetails.suspiciousLinks.length} URLs</span>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>AI Phishing Detection Platform • Java Spring Boot Security Integration</span>
            <span>Signature Verified</span>
          </div>

        </div>

      </div>
    </div>
  );
};
