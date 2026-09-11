import React from 'react';
import { 
  ShieldAlert, 
  Globe, 
  Mail, 
  LayoutDashboard, 
  History, 
  UserCheck, 
  Lock,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user, isAdmin, logout, openAuthModal, switchRole } = useAuth();

  const navItems = [
    { id: 'url-scanner', label: 'URL Scanner', icon: Globe },
    { id: 'email-analyzer', label: 'Email Analysis', icon: Mail },
    { id: 'dashboard', label: 'Security Dashboard', icon: LayoutDashboard },
    { id: 'history', label: 'Scan History', icon: History },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin Console', icon: UserCheck });
  }

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('url-scanner')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative p-2 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 group-hover:border-cyan-400 transition-all duration-300">
              <ShieldAlert className="w-6 h-6 text-cyan-400 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-wider text-white">PHISH<span className="text-cyan-400">GUARD</span></span>
                <span className="text-[10px] font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  AI v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight hidden sm:block">Threat Intelligence & Risk Scanner</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Role Switcher & Auth Actions */}
          <div className="flex items-center space-x-3">
            
            {/* Quick Demo Role Switcher */}
            <div className="flex items-center bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => switchRole('USER')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  !isAdmin ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                User
              </button>
              <button
                onClick={() => switchRole('ADMIN')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center space-x-1 ${
                  isAdmin ? 'bg-red-500 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Lock className="w-3 h-3" />
                <span>Admin</span>
              </button>
            </div>

            {/* Profile / Auth Button */}
            {user ? (
              <div className="flex items-center space-x-2 border-l border-slate-800 pl-3">
                <div className="hidden lg:block text-right">
                  <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
                  <span className="text-[10px] text-cyan-400 font-mono leading-none">{user.role}</span>
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 bg-slate-950 px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center p-1.5 rounded-md text-xs font-medium ${
                isActive ? 'text-cyan-400' : 'text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
