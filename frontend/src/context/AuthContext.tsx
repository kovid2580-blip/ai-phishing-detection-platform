import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Role } from '../types';
import { INITIAL_MOCK_USERS } from '../services/mockData';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: Role) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('phish_current_user');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_USERS[0];
  });
  
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('jwt_token') || 'mock-jwt-token-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('phish_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('phish_current_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('jwt_token', token);
    } else {
      localStorage.removeItem('jwt_token');
    }
  }, [token]);

  const login = async (email: string): Promise<boolean> => {
    const matched = INITIAL_MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
      id: 'user-' + Date.now(),
      name: email.split('@')[0],
      email: email,
      role: 'USER' as Role,
      status: 'ACTIVE' as const,
      created_at: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    setUser(matched);
    setToken('mock-jwt-token-' + Math.random().toString(36).substring(7));
    setIsAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const switchRole = (newRole: Role) => {
    if (!user) {
      const mock = newRole === 'ADMIN' ? INITIAL_MOCK_USERS[1] : INITIAL_MOCK_USERS[0];
      setUser(mock);
    } else {
      setUser({
        ...user,
        role: newRole
      });
    }
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        isAuthModalOpen,
        login,
        logout,
        switchRole,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
