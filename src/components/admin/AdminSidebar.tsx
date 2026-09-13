import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BRAND } from '../../lib/constants';
import { 
  LayoutDashboard, 
  Package, 
  Network, 
  HelpCircle, 
  Bell, 
  Settings, 
  Palette,
  PhoneCall, 
  UserCheck, 
  FileText, 
  LogOut, 
  Shield, 
  ExternalLink,
  Users
} from 'lucide-react';

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onCloseMobile }) => {
  const { isSuperAdmin, isAdmin, signOut, adminRecord } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Packages', path: '/admin/packages', icon: Package },
    { name: 'Services', path: '/admin/services', icon: Network },
    { name: 'FAQs', path: '/admin/faqs', icon: HelpCircle },
    { name: 'Announcements', path: '/admin/announcements', icon: Bell },
    ...(isAdmin ? [{ name: 'Appearance / Theme', path: '/admin/settings?tab=appearance', icon: Palette }] : []),
    ...(isAdmin ? [{ name: 'Website Settings', path: '/admin/settings?tab=branding', icon: Settings }] : []),
    ...(isAdmin ? [{ name: 'Contacts', path: '/admin/contacts', icon: PhoneCall }] : []),
    ...(isSuperAdmin ? [{ name: 'Audit Logs', path: '/admin/audit-logs', icon: FileText }] : []),
    ...(isSuperAdmin ? [{ name: 'Admins', path: '/admin/admins', icon: Users }] : []),
    { name: 'Admin Profile', path: '/admin/profile', icon: UserCheck },
  ];

  return (
    <aside className="w-64 bg-[#060b17] border-r border-slate-800 flex flex-col justify-between h-full select-none">
      {/* Brand Header */}
      <div>
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Shield className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm text-white tracking-tight">
                {BRAND.SHORT_NAME}
              </span>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                Admin Console
              </span>
            </div>
          </div>
        </div>

        {/* Admin Badge Info */}
        <div className="px-5 py-4 border-b border-slate-800/60 bg-[#081022]/40">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">Role:</span>
            <span className={`text-[11px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
              adminRecord?.role === 'super_admin' 
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : adminRecord?.role === 'admin'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {adminRecord?.role || 'Admin'}
            </span>
          </div>
          <div className="text-xs text-slate-300 truncate mt-1.5 font-medium">
            {adminRecord?.email}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <a
          href="#/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Website</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Live</span>
        </a>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-600/20 border border-transparent hover:border-rose-500/30 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>লগআউট (Logout)</span>
        </button>
      </div>
    </aside>
  );
};
