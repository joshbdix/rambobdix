import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, LogOut, ArrowLeft } from 'lucide-react';
import { BRAND } from '../../lib/constants';

export const UnauthorizedPage: React.FC = () => {
  const { user, adminRecord, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const isSuspended = adminRecord?.status === 'suspended';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050811] px-4 py-12">
      <div className="max-w-lg w-full bg-[#0a1226] border border-rose-500/30 rounded-3xl p-8 shadow-2xl shadow-rose-950/20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-6 shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="inline-block px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono font-bold uppercase tracking-wider mb-3">
          403 Access Forbidden
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
          {isSuspended ? 'অ্যাকাউন্ট স্থগিত করা হয়েছে' : 'অননুমোদিত এক্সেস'}
        </h1>

        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          {isSuspended ? (
            <>
              আপনার অ্যাডমিন অ্যাকাউন্টটি <span className="font-semibold text-rose-400">Suspended</span> অবস্থায় রয়েছে। বিস্তারিত তথ্যের জন্য সুপার অ্যাডমিনের সাথে যোগাযোগ করুন।
            </>
          ) : (
            <>
              আপনি Supabase Auth-এ <span className="text-cyan-400 font-mono font-semibold">{user?.email}</span> হিসেবে লগইন করেছেন, কিন্তু এই অ্যাকাউন্টের জন্য <span className="font-semibold text-white">{BRAND.OFFICIAL_NAME}</span> অ্যাডমিন এক্সেস সক্রিয় করা নেই।
            </>
          )}
        </p>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs text-left text-slate-300 font-mono mb-8 space-y-1">
          <div><span className="text-slate-400">User ID:</span> {user?.id}</div>
          <div><span className="text-slate-400">Email:</span> {user?.email}</div>
          <div><span className="text-slate-400">Admin Role:</span> {adminRecord?.role || 'None'}</div>
          <div><span className="text-slate-400">Status:</span> {adminRecord?.status || 'Unauthorized'}</div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition-colors shadow-lg shadow-rose-950/50"
          >
            <LogOut className="w-4 h-4" />
            <span>লগআউট করুন</span>
          </button>

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>মূল ওয়েবসাইটে ফিরুন</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
