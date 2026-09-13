import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Menu, RefreshCw, Database, ShieldCheck, User } from 'lucide-react';

interface AdminHeaderProps {
  onToggleMobileSidebar: () => void;
  title: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleMobileSidebar, title }) => {
  const { isConfigured, adminRecord } = useAuth();
  const { reloadData, loading } = useData();

  return (
    <header className="h-20 bg-[#060b17]/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {title}
          </h1>
          <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
            JOSH RAMBO BDIX Bypass™ Administrative Management
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Supabase Connection Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
          {isConfigured ? (
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Supabase Live RLS</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Supabase Required</span>
            </div>
          )}
        </div>

        {/* Refresh button */}
        <button
          type="button"
          onClick={() => reloadData()}
          disabled={loading}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
          title="ডাটা রিফ্রেশ করুন"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800 text-xs">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:block text-left">
            <div className="text-white font-semibold leading-tight">{adminRecord?.email?.split('@')[0]}</div>
            <div className="text-[10px] text-slate-400 font-mono">{adminRecord?.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
