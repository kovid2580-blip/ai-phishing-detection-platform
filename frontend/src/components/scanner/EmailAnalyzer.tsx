import React, { useState } from 'react';
import { 
  Mail, 
  ShieldAlert, 
  ShieldCheck, 
  AlertOctagon, 
  FileText, 
  RefreshCw, 
  Sparkles,
  Link2,
  FileCheck,
  Zap
} from 'lucide-react';
import { scanService } from '../../services/api';
import type { ScanResult } from '../../types';
import { RiskGauge } from './RiskGauge';
import { useAuth } from '../../context/AuthContext';

interface EmailAnalyzerProps {
  onReportGenerated: (scan: ScanResult) => void;
}

export const EmailAnalyzer: React.FC<EmailAnalyzerProps> = ({ onReportGenerated }) => {
  const { user } = useAuth();
  const [emailText, setEmailText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const sampleEmails = [
    {
      label: 'Urgent Bank Scam',
      content: `SUBJECT: URGENT: Your bank account will be suspended in 24 hours!
Dear Customer,
We detected unauthorized login attempts on your banking profile. Please verify your SSN, credit card, and password immediately at http://login-verify-paypal-update-account.xyz/signin to prevent permanent account termination.
Sincerely, Bank Security Team`
    },
    {
      label: 'Wire Transfer Phish',
      content: `SUBJECT: Immediate Response Needed - Wire Transfer Request
Hi Accountant,
I am currently in an urgent meeting with investors and need you to execute a confidential wire transfer of $45,000 immediately. Reply with confirmation once processed. Do not call my office line.`
    },
    {
      label: 'Legitimate Email',
      content: `SUBJECT: Weekly Engineering Status & Sprint Sync
Hi Team,
Great progress on the Java Spring Boot API endpoints this week. Please review the updated documentation on GitHub when you have a moment. Let me know if you have questions before our tomorrow sync!`
    }
  ];

  const handleAnalyze = async (customContent?: string) => {
    const textToScan = customContent || emailText;
    if (!textToScan.trim()) return;

    setIsAnalyzing(true);
    setScanResult(null);

    try {
      await new Promise(r => setTimeout(r, 1200));
      const result = await scanService.analyzeEmail(textToScan, user?.id || 'user-1');
      setScanResult(result);
    } catch (err) {
      console.error('Email analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="relative glass-panel rounded-2xl p-6 sm:p-8 overflow-hidden border border-purple-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Mail className="w-3.5 h-3.5 animate-pulse" />
            <span>Phishing Email NLP & Keyword Scanner</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Analyze Email Content & Fraud Tactics
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Paste incoming raw emails or messages to detect urgent coercion language, credential harvesting requests, spoofed headers, and suspicious embedded links.
          </p>

          {/* Email Text Area Form */}
          <form onSubmit={(e) => { e.preventDefault(); handleAnalyze(); }} className="mt-6">
            <div className="space-y-3">
              <textarea
                rows={6}
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                placeholder="Paste raw email body or header text here..."
                className="w-full p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all font-mono resize-y"
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                
                {/* Preset Samples */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-400 font-semibold">Load sample email:</span>
                  {sampleEmails.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setEmailText(sample.content);
                        handleAnalyze(sample.content);
                      }}
                      className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-purple-950 text-slate-300 border border-slate-700 hover:border-purple-500/40 text-xs transition-colors flex items-center space-x-1"
                    >
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span>{sample.label}</span>
                    </button>
                  ))}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isAnalyzing || !emailText.trim()}
                  className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-sm transition-all flex items-center space-x-2 shadow-[0_0_20px_rgba(168,85,247,0.3)] ml-auto"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Analyzing Email Text...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-white" />
                      <span>Analyze Phishing Threats</span>
                    </>
                  )}
                </button>

              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Analysis Result Card */}
      {scanResult && scanResult.scan_type === 'EMAIL' && scanResult.details.emailDetails && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="glass-panel-glow rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-purple-500/30">
            
            {/* Gauge */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800 pb-6 lg:pb-0 lg:pr-6">
              <RiskGauge score={scanResult.risk_score} level={scanResult.risk_level} size={190} />
              <div className="mt-4 text-center">
                <p className="text-xs font-mono text-slate-400">Analysis Date</p>
                <p className="text-xs font-semibold text-slate-200">{new Date(scanResult.created_at).toLocaleString()}</p>
              </div>
            </div>

            {/* Content Details */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-mono text-purple-400 uppercase tracking-widest">EMAIL SUBJECT SUMMARY</span>
                  <h2 className="text-xl font-bold text-white font-mono mt-0.5">
                    {scanResult.details.emailDetails.subject}
                  </h2>
                </div>

                <button
                  onClick={() => onReportGenerated(scanResult)}
                  className="px-3.5 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-bold transition-colors flex items-center space-x-1.5 border border-purple-500/40"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Generate Report</span>
                </button>
              </div>

              {/* Recommendation Box */}
              <div className={`p-4 rounded-xl border flex items-start space-x-3 ${
                scanResult.risk_level === 'CRITICAL' || scanResult.risk_level === 'HIGH'
                  ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                  : scanResult.risk_level === 'MEDIUM'
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                  : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              }`}>
                {scanResult.risk_level === 'CRITICAL' || scanResult.risk_level === 'HIGH' ? (
                  <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                ) : scanResult.risk_level === 'MEDIUM' ? (
                  <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-sm font-bold tracking-wide">Threat Mitigation Guidance</h4>
                  <p className="text-xs mt-1 leading-relaxed">{scanResult.recommendation}</p>
                </div>
              </div>

              {/* Threat Indicators Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Urgent Tone</span>
                  <div className="mt-1 font-bold text-sm">
                    {scanResult.details.emailDetails.urgentLanguageDetected ? (
                      <span className="text-rose-400 flex items-center space-x-1">
                        <AlertOctagon className="w-3.5 h-3.5" />
                        <span>High Urgency Detected</span>
                      </span>
                    ) : (
                      <span className="text-emerald-400 flex items-center space-x-1">
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Normal Tone</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Credential Harvesting</span>
                  <div className="mt-1 font-bold text-sm">
                    {scanResult.details.emailDetails.credentialRequestDetected ? (
                      <span className="text-rose-400">Request Detected</span>
                    ) : (
                      <span className="text-emerald-400">None Detected</span>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Header Spoofing</span>
                  <div className="mt-1 font-bold text-sm">
                    {scanResult.details.emailDetails.spoofedHeader ? (
                      <span className="text-amber-400">Suspicious Origin</span>
                    ) : (
                      <span className="text-emerald-400 font-normal">Standard</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Extracted Links & Keywords */}
              {scanResult.details.emailDetails.detectedKeywords.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] font-mono text-slate-400 block mb-1.5">Detected Fraud Trigger Phrases:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {scanResult.details.emailDetails.detectedKeywords.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-xs font-mono">
                        "{kw}"
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {scanResult.details.emailDetails.suspiciousLinks.length > 0 && (
                <div className="pt-1">
                  <span className="text-[11px] font-mono text-slate-400 block mb-1.5 flex items-center space-x-1">
                    <Link2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Embedded Target Links Extracted ({scanResult.details.emailDetails.suspiciousLinks.length}):</span>
                  </span>
                  <div className="space-y-1">
                    {scanResult.details.emailDetails.suspiciousLinks.map((link, idx) => (
                      <div key={idx} className="p-2 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-rose-300 break-all">
                        {link}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
