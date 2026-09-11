import axios from 'axios';
import type { ScanResult, User, SecurityReport, SystemStats, AuditLog } from '../types';
import { HeuristicEngine } from './heuristicEngine';
import { INITIAL_MOCK_SCANS, INITIAL_MOCK_USERS, INITIAL_MOCK_STATS, INITIAL_AUDIT_LOGS } from './mockData';

const API_BASE_URL = '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Attach JWT token from localStorage if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Local state cache for offline / mock mode fallback
let localScans: ScanResult[] = JSON.parse(localStorage.getItem('phish_scans') || 'null') || INITIAL_MOCK_SCANS;
let localUsers: User[] = JSON.parse(localStorage.getItem('phish_users') || 'null') || INITIAL_MOCK_USERS;
let localAuditLogs: AuditLog[] = JSON.parse(localStorage.getItem('phish_logs') || 'null') || INITIAL_AUDIT_LOGS;

const saveState = () => {
  localStorage.setItem('phish_scans', JSON.stringify(localScans));
  localStorage.setItem('phish_users', JSON.stringify(localUsers));
  localStorage.setItem('phish_logs', JSON.stringify(localAuditLogs));
};

export const scanService = {
  async scanUrl(url: string, userId: string = 'user-1'): Promise<ScanResult> {
    try {
      const response = await apiClient.post<ScanResult>('/scan/url', { url });
      localScans.unshift(response.data);
      saveState();
      return response.data;
    } catch {
      // Fallback to Heuristic engine if Spring Boot backend is offline
      const result = HeuristicEngine.analyzeUrl(url, userId);
      const user = localUsers.find(u => u.id === userId);
      if (user) result.user_name = user.name;
      
      localScans.unshift(result);
      
      // Log audit
      localAuditLogs.unshift({
        id: 'log-' + Date.now(),
        timestamp: new Date().toISOString(),
        user: user?.name || 'Anonymous User',
        action: 'URL_SCAN_EXECUTED',
        details: `Scanned URL: ${url} (Score: ${result.risk_score}%, Level: ${result.risk_level})`,
        level: result.risk_score >= 70 ? 'CRITICAL' : result.risk_score >= 40 ? 'WARNING' : 'INFO'
      });
      saveState();
      return result;
    }
  },

  async analyzeEmail(emailText: string, userId: string = 'user-1'): Promise<ScanResult> {
    try {
      const response = await apiClient.post<ScanResult>('/scan/email', { content: emailText });
      localScans.unshift(response.data);
      saveState();
      return response.data;
    } catch {
      const result = HeuristicEngine.analyzeEmail(emailText, userId);
      const user = localUsers.find(u => u.id === userId);
      if (user) result.user_name = user.name;

      localScans.unshift(result);

      // Log audit
      localAuditLogs.unshift({
        id: 'log-' + Date.now(),
        timestamp: new Date().toISOString(),
        user: user?.name || 'Anonymous User',
        action: 'EMAIL_ANALYSIS_EXECUTED',
        details: `Analyzed Email (Score: ${result.risk_score}%, Level: ${result.risk_level})`,
        level: result.risk_score >= 70 ? 'CRITICAL' : result.risk_score >= 40 ? 'WARNING' : 'INFO'
      });
      saveState();
      return result;
    }
  },

  async getScanHistory(): Promise<ScanResult[]> {
    try {
      const response = await apiClient.get<ScanResult[]>('/scans/history');
      return response.data;
    } catch {
      return localScans;
    }
  },

  async deleteScan(scanId: string): Promise<void> {
    try {
      await apiClient.delete(`/scans/${scanId}`);
    } catch {
      localScans = localScans.filter(s => s.id !== scanId);
      saveState();
    }
  }
};

export const dashboardService = {
  async getStats(): Promise<SystemStats> {
    try {
      const response = await apiClient.get<SystemStats>('/dashboard/stats');
      return response.data;
    } catch {
      // Recalculate live stats from localScans
      const totalScans = localScans.length + INITIAL_MOCK_STATS.totalScans - INITIAL_MOCK_SCANS.length;
      const phishingDetected = localScans.filter(s => s.risk_score >= 60).length + 340;
      const safeUrls = localScans.filter(s => s.scan_type === 'URL' && s.risk_score < 30).length + 888;
      const emailsAnalyzed = localScans.filter(s => s.scan_type === 'EMAIL').length + 590;

      return {
        ...INITIAL_MOCK_STATS,
        totalScans,
        phishingDetected,
        safeUrls,
        emailsAnalyzed
      };
    }
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    try {
      const response = await apiClient.get<AuditLog[]>('/admin/logs');
      return response.data;
    } catch {
      return localAuditLogs;
    }
  }
};

export const adminService = {
  async getUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get<User[]>('/admin/users');
      return response.data;
    } catch {
      return localUsers;
    }
  },

  async toggleUserStatus(userId: string): Promise<User> {
    try {
      const response = await apiClient.put<User>(`/admin/users/${userId}/toggle-status`);
      return response.data;
    } catch {
      const user = localUsers.find(u => u.id === userId);
      if (user) {
        user.status = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        saveState();
        return { ...user };
      }
      throw new Error('User not found');
    }
  },

  async updateUserRole(userId: string, role: 'USER' | 'ADMIN'): Promise<User> {
    try {
      const response = await apiClient.put<User>(`/admin/users/${userId}/role`, { role });
      return response.data;
    } catch {
      const user = localUsers.find(u => u.id === userId);
      if (user) {
        user.role = role;
        saveState();
        return { ...user };
      }
      throw new Error('User not found');
    }
  }
};

export const reportService = {
  generateReport(scan: ScanResult): SecurityReport {
    return {
      id: 'rep-' + Date.now(),
      scan_id: scan.id,
      report_type: scan.scan_type === 'URL' ? 'URL_SCAN' : 'EMAIL_SCAN',
      summary: `Automated ${scan.scan_type} Phishing Risk Report generated for target: ${scan.content.slice(0, 40)}...`,
      risk_level: scan.risk_level,
      risk_score: scan.risk_score,
      created_at: new Date().toISOString(),
      scanResult: scan
    };
  }
};
