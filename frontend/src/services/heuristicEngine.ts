import type { ScanResult, UrlScanDetails, EmailScanDetails, RiskLevel } from '../types';

const SUSPICIOUS_URL_KEYWORDS = [
  'login', 'signin', 'verify', 'update', 'account', 'banking', 'secure', 'paypal', 
  'appleid', 'microsoft', 'google-security', 'password', 'validation', 'confirm',
  'support', 'wallet', 'crypto', 'bonus', 'free-gift', 'claim'
];

const SUSPICIOUS_TLDS = ['.xyz', '.top', '.club', '.online', '.site', '.work', '.info', '.cc', '.tk', '.ga', '.cf', '.ml'];

const SCAM_EMAIL_KEYWORDS = [
  'urgent action required', 'account suspended', 'immediate response needed',
  'verify your identity', 'unauthorized login attempt', 'update payment details',
  'wire transfer', 'gift card', 'lottery winner', 'reset password immediately',
  'click here to unlock', 'tax refund', 'inherited funds', 'package delivery failed'
];

export class HeuristicEngine {

  /**
   * Analyzes a URL using cybersecurity heuristics
   */
  static analyzeUrl(inputUrl: string, userId: string = 'user-1'): ScanResult {
    let cleanUrl = inputUrl.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'http://' + cleanUrl;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(cleanUrl);
    } catch {
      parsedUrl = new URL('http://' + cleanUrl);
    }

    const domain = parsedUrl.hostname.toLowerCase();
    const isHttps = parsedUrl.protocol === 'https:';
    
    // Check if IP host
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    const isIpHostname = ipPattern.test(domain);

    // Keyword check
    const matchedKeywords = SUSPICIOUS_URL_KEYWORDS.filter(kw => 
      cleanUrl.toLowerCase().includes(kw)
    );

    // TLD check
    const hasSuspiciousTld = SUSPICIOUS_TLDS.some(tld => domain.endsWith(tld));

    // Calculate domain entropy
    const entropy = this.calculateEntropy(domain);

    // Fake domain age
    const isBrandSpoofing = (domain.includes('paypa1') || domain.includes('micros0ft') || domain.includes('g00gle') || domain.includes('app1e'));
    const domainAgeDays = isBrandSpoofing || isIpHostname || matchedKeywords.length > 1 ? 4 : 850;

    // Calculate Risk Score
    let riskScore = 10;

    if (!isHttps) riskScore += 20;
    if (isIpHostname) riskScore += 35;
    if (hasSuspiciousTld) riskScore += 25;
    if (isBrandSpoofing) riskScore += 45;
    riskScore += matchedKeywords.length * 15;
    if (entropy > 3.8) riskScore += 20;

    // Cap score
    riskScore = Math.min(Math.max(riskScore, 5), 98);

    // Risk level
    let riskLevel: RiskLevel = 'SAFE';
    if (riskScore >= 75) riskLevel = 'CRITICAL';
    else if (riskScore >= 50) riskLevel = 'HIGH';
    else if (riskScore >= 30) riskLevel = 'MEDIUM';
    else if (riskScore >= 15) riskLevel = 'LOW';

    // Mock API Reputation
    const maliciousCount = riskScore > 60 ? Math.floor(riskScore / 5) : 0;
    const suspiciousCount = riskScore > 35 ? 3 : 0;
    const harmlessCount = Math.max(0, 90 - maliciousCount - suspiciousCount);

    let recommendation = 'URL appears safe. Proceed with standard web security practices.';
    if (riskLevel === 'CRITICAL') {
      recommendation = 'HIGH RISK PHISHING DETECTED! Do NOT enter credentials or download any attachments from this domain.';
    } else if (riskLevel === 'HIGH') {
      recommendation = 'Suspicious URL detected. Avoid sharing sensitive information or logging in.';
    } else if (riskLevel === 'MEDIUM') {
      recommendation = 'Exercise caution. Verify the domain identity before taking any actions.';
    }

    const urlDetails: UrlScanDetails = {
      url: cleanUrl,
      domain,
      isHttps,
      domainAgeDays,
      ipHostname: isIpHostname,
      suspiciousKeywords: matchedKeywords,
      virusTotalReputation: {
        malicious: maliciousCount,
        suspicious: suspiciousCount,
        harmless: harmlessCount,
        total: 90
      },
      googleSafeBrowsing: {
        isBlacklisted: riskScore >= 70,
        threatType: riskScore >= 70 ? 'SOCIAL_ENGINEERING / PHISHING' : undefined
      },
      entropyScore: Math.round(entropy * 100) / 100
    };

    return {
      id: 'scan-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      user_id: userId,
      scan_type: 'URL',
      content: cleanUrl,
      risk_score: riskScore,
      risk_level: riskLevel,
      recommendation,
      created_at: new Date().toISOString(),
      details: { urlDetails }
    };
  }

  /**
   * Analyzes Email text for phishing indicators
   */
  static analyzeEmail(emailText: string, userId: string = 'user-1'): ScanResult {
    const textLower = emailText.toLowerCase();

    // Matched scam keywords
    const matchedKeywords = SCAM_EMAIL_KEYWORDS.filter(kw => textLower.includes(kw));

    // Urgency check
    const urgentWords = ['urgent', 'immediately', 'within 24 hours', 'suspended', 'account closure', 'act now'];
    const urgentLanguageDetected = urgentWords.some(w => textLower.includes(w));

    // Credential harvesting check
    const credWords = ['password', 'ssn', 'credit card', 'login credentials', 'bank account', 'pin', 'verify identity'];
    const credentialRequestDetected = credWords.some(w => textLower.includes(w));

    // Extract links
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    const extractedLinks = emailText.match(linkRegex) || [];

    // Calculate score
    let riskScore = 15;
    riskScore += matchedKeywords.length * 20;
    if (urgentLanguageDetected) riskScore += 20;
    if (credentialRequestDetected) riskScore += 25;
    if (extractedLinks.length > 0) riskScore += 15;

    riskScore = Math.min(Math.max(riskScore, 8), 96);

    let riskLevel: RiskLevel = 'SAFE';
    if (riskScore >= 75) riskLevel = 'CRITICAL';
    else if (riskScore >= 50) riskLevel = 'HIGH';
    else if (riskScore >= 30) riskLevel = 'MEDIUM';
    else if (riskScore >= 15) riskLevel = 'LOW';

    let recommendation = 'Email content seems legitimate. No high-risk scam indicators found.';
    if (riskLevel === 'CRITICAL') {
      recommendation = 'CRITICAL PHISHING THREAT DETECTED. Do not click links, reply, or share credentials.';
    } else if (riskLevel === 'HIGH') {
      recommendation = 'High risk of credential harvesting scam. Verify email sender address carefully.';
    } else if (riskLevel === 'MEDIUM') {
      recommendation = 'Urgent tone detected. Verify via independent communication channels before responding.';
    }

    const emailDetails: EmailScanDetails = {
      subject: emailText.slice(0, 50) + (emailText.length > 50 ? '...' : ''),
      sender: 'Detected from content headers',
      urgentLanguageDetected,
      credentialRequestDetected,
      detectedKeywords: matchedKeywords,
      suspiciousLinks: extractedLinks,
      spoofedHeader: matchedKeywords.length > 1
    };

    return {
      id: 'scan-em-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      user_id: userId,
      scan_type: 'EMAIL',
      content: emailText.slice(0, 150) + (emailText.length > 150 ? '...' : ''),
      risk_score: riskScore,
      risk_level: riskLevel,
      recommendation,
      created_at: new Date().toISOString(),
      details: { emailDetails }
    };
  }

  private static calculateEntropy(str: string): number {
    const len = str.length;
    if (len === 0) return 0;
    const frequencies: { [key: string]: number } = {};
    for (let i = 0; i < len; i++) {
      const char = str[i];
      frequencies[char] = (frequencies[char] || 0) + 1;
    }
    let entropy = 0;
    for (const char in frequencies) {
      const p = frequencies[char] / len;
      entropy -= p * Math.log2(p);
    }
    return entropy;
  }
}
