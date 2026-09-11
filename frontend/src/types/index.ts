export type Role = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'ACTIVE' | 'SUSPENDED';
  created_at: string;
  lastLogin?: string;
  scansCount?: number;
}

export type ScanType = 'URL' | 'EMAIL';

export type RiskLevel = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface UrlScanDetails {
  url: string;
  domain: string;
  isHttps: boolean;
  domainAgeDays: number;
  ipHostname: boolean;
  suspiciousKeywords: string[];
  virusTotalReputation: {
    malicious: number;
    suspicious: number;
    harmless: number;
    total: number;
  };
  googleSafeBrowsing: {
    isBlacklisted: boolean;
    threatType?: string;
  };
  entropyScore: number;
}

export interface EmailScanDetails {
  subject: string;
  sender: string;
  urgentLanguageDetected: boolean;
  credentialRequestDetected: boolean;
  detectedKeywords: string[];
  suspiciousLinks: string[];
  spoofedHeader: boolean;
}

export interface ScanResult {
  id: string;
  user_id: string;
  user_name?: string;
  scan_type: ScanType;
  content: string;
  risk_score: number; // 0 to 100
  risk_level: RiskLevel;
  recommendation: string;
  created_at: string;
  details: {
    urlDetails?: UrlScanDetails;
    emailDetails?: EmailScanDetails;
  };
}

export interface SecurityReport {
  id: string;
  scan_id: string;
  report_type: 'URL_SCAN' | 'EMAIL_SCAN' | 'THREAT_AUDIT';
  summary: string;
  risk_level: RiskLevel;
  risk_score: number;
  created_at: string;
  scanResult: ScanResult;
}

export interface SystemStats {
  totalScans: number;
  phishingDetected: number;
  safeUrls: number;
  emailsAnalyzed: number;
  activeUsers: number;
  riskDistribution: { name: string; value: number; color: string }[];
  scanHistoryTrend: { date: string; urlScans: number; emailScans: number; threats: number }[];
}

export interface ApiConfig {
  virusTotalKey: string;
  googleSafeBrowsingKey: string;
  enableHeuristics: boolean;
  autoBlockHighRisk: boolean;
  mockMode: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
}
