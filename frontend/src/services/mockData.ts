import type { ScanResult, User, SystemStats, AuditLog } from '../types';

export const INITIAL_MOCK_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@cybersec.org',
    role: 'USER',
    status: 'ACTIVE',
    created_at: '2026-08-15T09:20:00Z',
    lastLogin: '2026-09-11T18:40:00Z',
    scansCount: 42
  },
  {
    id: 'user-2',
    name: 'Sarah Connor',
    email: 'admin@phishdetect.io',
    role: 'ADMIN',
    status: 'ACTIVE',
    created_at: '2026-07-01T10:00:00Z',
    lastLogin: '2026-09-11T19:15:00Z',
    scansCount: 128
  },
  {
    id: 'user-3',
    name: 'Michael Vance',
    email: 'm.vance@techcorp.net',
    role: 'USER',
    status: 'SUSPENDED',
    created_at: '2026-09-02T14:30:00Z',
    lastLogin: '2026-09-08T11:20:00Z',
    scansCount: 8
  }
];

export const INITIAL_MOCK_SCANS: ScanResult[] = [
  {
    id: 'scan-1001',
    user_id: 'user-1',
    user_name: 'Alex Rivera',
    scan_type: 'URL',
    content: 'http://login-verify-paypal-update-account.xyz/signin',
    risk_score: 92,
    risk_level: 'CRITICAL',
    recommendation: 'HIGH RISK PHISHING DETECTED! Do NOT enter credentials or download any attachments from this domain.',
    created_at: '2026-09-11T18:45:00Z',
    details: {
      urlDetails: {
        url: 'http://login-verify-paypal-update-account.xyz/signin',
        domain: 'login-verify-paypal-update-account.xyz',
        isHttps: false,
        domainAgeDays: 2,
        ipHostname: false,
        suspiciousKeywords: ['login', 'verify', 'paypal', 'update', 'account'],
        virusTotalReputation: { malicious: 18, suspicious: 5, harmless: 67, total: 90 },
        googleSafeBrowsing: { isBlacklisted: true, threatType: 'SOCIAL_ENGINEERING' },
        entropyScore: 4.12
      }
    }
  },
  {
    id: 'scan-1002',
    user_id: 'user-1',
    user_name: 'Alex Rivera',
    scan_type: 'EMAIL',
    content: 'URGENT: Your bank account will be suspended in 24 hours. Click here to verify your SSN and credit card immediately!',
    risk_score: 88,
    risk_level: 'CRITICAL',
    recommendation: 'CRITICAL PHISHING THREAT DETECTED. Do not click links, reply, or share credentials.',
    created_at: '2026-09-11T17:30:00Z',
    details: {
      emailDetails: {
        subject: 'URGENT: Account Suspension Notice',
        sender: 'security-alert-no-reply@bank-verification-auth.org',
        urgentLanguageDetected: true,
        credentialRequestDetected: true,
        detectedKeywords: ['urgent action required', 'account suspended', 'verify your identity'],
        suspiciousLinks: ['http://bank-verification-auth.org/login'],
        spoofedHeader: true
      }
    }
  },
  {
    id: 'scan-1003',
    user_id: 'user-2',
    user_name: 'Sarah Connor',
    scan_type: 'URL',
    content: 'https://github.com/kovid2580-blip/ai-phishing-detection-platform',
    risk_score: 5,
    risk_level: 'SAFE',
    recommendation: 'URL appears safe. Proceed with standard web security practices.',
    created_at: '2026-09-11T16:10:00Z',
    details: {
      urlDetails: {
        url: 'https://github.com/kovid2580-blip/ai-phishing-detection-platform',
        domain: 'github.com',
        isHttps: true,
        domainAgeDays: 6200,
        ipHostname: false,
        suspiciousKeywords: [],
        virusTotalReputation: { malicious: 0, suspicious: 0, harmless: 90, total: 90 },
        googleSafeBrowsing: { isBlacklisted: false },
        entropyScore: 2.85
      }
    }
  },
  {
    id: 'scan-1004',
    user_id: 'user-1',
    user_name: 'Alex Rivera',
    scan_type: 'URL',
    content: 'http://192.168.1.105/auth/microsoft-login-form.php',
    risk_score: 78,
    risk_level: 'HIGH',
    recommendation: 'Suspicious URL detected. Avoid sharing sensitive information or logging in.',
    created_at: '2026-09-10T22:15:00Z',
    details: {
      urlDetails: {
        url: 'http://192.168.1.105/auth/microsoft-login-form.php',
        domain: '192.168.1.105',
        isHttps: false,
        domainAgeDays: 1,
        ipHostname: true,
        suspiciousKeywords: ['microsoft', 'login'],
        virusTotalReputation: { malicious: 12, suspicious: 3, harmless: 75, total: 90 },
        googleSafeBrowsing: { isBlacklisted: true, threatType: 'MALWARE_DISTRIBUTION' },
        entropyScore: 3.4
      }
    }
  },
  {
    id: 'scan-1005',
    user_id: 'user-3',
    user_name: 'Michael Vance',
    scan_type: 'EMAIL',
    content: 'Team meeting agenda for Q4 planning attached. Let me know if you have suggestions.',
    risk_score: 12,
    risk_level: 'SAFE',
    recommendation: 'Email content seems legitimate. No high-risk scam indicators found.',
    created_at: '2026-09-10T14:00:00Z',
    details: {
      emailDetails: {
        subject: 'Q4 Planning Meeting Agenda',
        sender: 'm.vance@techcorp.net',
        urgentLanguageDetected: false,
        credentialRequestDetected: false,
        detectedKeywords: [],
        suspiciousLinks: [],
        spoofedHeader: false
      }
    }
  }
];

export const INITIAL_MOCK_STATS: SystemStats = {
  totalScans: 1482,
  phishingDetected: 342,
  safeUrls: 890,
  emailsAnalyzed: 592,
  activeUsers: 84,
  riskDistribution: [
    { name: 'Safe', value: 890, color: '#00E676' },
    { name: 'Low Risk', value: 160, color: '#00F0FF' },
    { name: 'Medium Risk', value: 90, color: '#FFB300' },
    { name: 'High Risk', value: 180, color: '#FF9100' },
    { name: 'Critical Phishing', value: 162, color: '#FF1744' }
  ],
  scanHistoryTrend: [
    { date: 'Sep 05', urlScans: 120, emailScans: 80, threats: 32 },
    { date: 'Sep 06', urlScans: 145, emailScans: 95, threats: 41 },
    { date: 'Sep 07', urlScans: 160, emailScans: 110, threats: 38 },
    { date: 'Sep 08', urlScans: 185, emailScans: 130, threats: 55 },
    { date: 'Sep 09', urlScans: 210, emailScans: 140, threats: 62 },
    { date: 'Sep 10', urlScans: 195, emailScans: 125, threats: 48 },
    { date: 'Sep 11', urlScans: 230, emailScans: 155, threats: 66 }
  ]
};

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-11T18:45:02Z',
    user: 'Alex Rivera',
    action: 'URL_SCAN_EXECUTED',
    details: 'Flagged CRITICAL phishing URL: login-verify-paypal-update-account.xyz',
    level: 'CRITICAL'
  },
  {
    id: 'log-2',
    timestamp: '2026-09-11T17:30:15Z',
    user: 'Alex Rivera',
    action: 'EMAIL_ANALYSIS',
    details: 'Detected credential harvesting attempt from security-alert-no-reply@bank-verification-auth.org',
    level: 'WARNING'
  },
  {
    id: 'log-3',
    timestamp: '2026-09-11T16:00:00Z',
    user: 'Sarah Connor (Admin)',
    action: 'API_KEY_UPDATE',
    details: 'Updated VirusTotal Security API credentials',
    level: 'INFO'
  },
  {
    id: 'log-4',
    timestamp: '2026-09-08T11:20:00Z',
    user: 'System Guard',
    action: 'USER_SUSPENDED',
    details: 'User Michael Vance suspended due to automated threat alert threshold',
    level: 'ERROR'
  }
];
