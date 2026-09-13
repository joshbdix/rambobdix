import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { BRAND } from '../../lib/constants';
import { 
  Package, 
  Network, 
  HelpCircle, 
  Bell, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  Activity, 
  ArrowRight,
  ShieldCheck,
  Plus
} from 'lucide-react';

export const AdminDashboardOverview: React.FC = () => {
  const { packages, services, faqs, announcements, auditLogs, settings } = useData();
  const { adminRecord } = useAuth();

  const activePackages = packages.filter((p) => p.status === 'active');
  const activeServices = services.filter((s) => s.status === 'active');
  const activeFaqs = faqs.filter((f) => f.status === 'active');
  const activeAnnouncements = announcements.filter((a) => a.status === 'active');

  const stats = [
    {
      title: 'Packages',
      activeCount: activePackages.length,
      totalCount: packages.length,
      icon: Package,
      path: '/admin/packages',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
    },
    {
      title: 'Services',
      activeCount: activeServices.length,
      totalCount: services.length,
      icon: Network,
      path: '/admin/services',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      title: 'FAQs',
      activeCount: activeFaqs.length,
      totalCount: faqs.length,
      icon: HelpCircle,
      path: '/admin/faqs',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
    {
      title: 'Announcements',
      activeCount: activeAnnouncements.length,
      totalCount: announcements.length,
      icon: Bell,
      path: '/admin/announcements',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#091530] via-[#071126] to-[#040915] border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-cyan-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                {adminRecord?.role === 'super_admin' ? 'Super Administrator' : 'Administrator'}
              </span>
              <span className="text-xs text-slate-400 font-mono">Logged in as {adminRecord?.email}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome to {BRAND.SHORT_NAME} Control Center
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              ওয়েবসাইটের সকল প্যাকেজ, সার্ভিস, নোটিশ, কন্টাক্ট ইনফো এবং সেটিংস রিয়েল-টাইমে Supabase RLS ডাটাবেসের সাথে সংযুক্ত রয়েছে।
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-colors"
            >
              <span>View Public Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Link
              key={idx}
              to={s.path}
              className="p-5 rounded-2xl bg-[#091124] border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 group hover:-translate-y-1 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl ${s.bg} ${s.border} border`}>
                    <Icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                    {s.activeCount} Active
                  </span>
                </div>
                <div className="text-2xl font-extrabold font-mono text-white group-hover:text-cyan-300 transition-colors">
                  {s.totalCount}
                </div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
                  Total {s.title}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-cyan-400 transition-colors">
                <span>ম্যানেজ করুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two Column Layout: Quick Actions & Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Quick Management Shortcuts */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Quick Content Shortcuts</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/admin/packages"
              className="p-4 rounded-xl bg-[#081022] border border-slate-800 hover:border-cyan-500/30 transition-colors flex items-center gap-3 group"
            >
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                <Plus className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white group-hover:text-cyan-400">নতুন প্যাকেজ যোগ</div>
                <div className="text-[10px] text-slate-400">Add Pricing & Features</div>
              </div>
            </Link>

            <Link
              to="/admin/announcements"
              className="p-4 rounded-xl bg-[#081022] border border-slate-800 hover:border-amber-500/30 transition-colors flex items-center gap-3 group"
            >
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                <Plus className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white group-hover:text-amber-400">নোটিশ প্রকাশ করুন</div>
                <div className="text-[10px] text-slate-400">Flash Banner Notice</div>
              </div>
            </Link>

            <Link
              to="/admin/settings"
              className="p-4 rounded-xl bg-[#081022] border border-slate-800 hover:border-blue-500/30 transition-colors flex items-center gap-3 group"
            >
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-slate-950 transition-colors">
                <Activity className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white group-hover:text-blue-400">ওয়েবসাইট টেক্সট আপডেট</div>
                <div className="text-[10px] text-slate-400">Hero & Business Message</div>
              </div>
            </Link>

            <Link
              to="/admin/contacts"
              className="p-4 rounded-xl bg-[#081022] border border-slate-800 hover:border-purple-500/30 transition-colors flex items-center gap-3 group"
            >
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-slate-950 transition-colors">
                <ExternalLink className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white group-hover:text-purple-400">কন্টাক্ট চ্যানেল লিংক</div>
                <div className="text-[10px] text-slate-400">Telegram & Messenger URLs</div>
              </div>
            </Link>
          </div>

          {/* Current Official Statement Preview */}
          <div className="p-5 rounded-2xl bg-[#070d1e] border border-slate-800 mt-4">
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
              Active Official Statement
            </div>
            <p className="text-sm font-semibold text-slate-200">
              "{settings.hero_title || BRAND.PRIMARY_STATEMENT}"
            </p>
            <div className="text-xs text-slate-400 mt-1">
              {settings.hero_description || BRAND.SUPPORTING_MESSAGE}
            </div>
          </div>
        </div>

        {/* Recent Audit Logs */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Recent Audit Logs</span>
            </h3>
            <Link
              to="/admin/audit-logs"
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono"
            >
              View All Logs →
            </Link>
          </div>

          <div className="bg-[#081022] border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/80">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="p-3.5 flex items-start justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white font-mono uppercase text-[11px] px-1.5 py-0.5 rounded bg-slate-800">
                      {log.action}
                    </span>
                    <span className="text-cyan-400 font-mono text-[11px]">{log.entity_type}</span>
                  </div>
                  <div className="text-slate-400 truncate max-w-xs">{log.details}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[100px]">
                    {log.admin_email?.split('@')[0]}
                  </div>
                </div>
              </div>
            ))}

            {auditLogs.length === 0 && (
              <div className="p-6 text-center text-slate-400 text-xs font-mono">
                কোনো সাম্প্রতিক অডিট লগ নেই
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
