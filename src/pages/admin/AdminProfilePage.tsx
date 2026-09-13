import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/ToastContainer';
import { UserCheck, Shield, Key, Mail, RefreshCw, CheckCircle2 } from 'lucide-react';

export const AdminProfilePage: React.FC = () => {
  const { user, adminRecord, resetPassword } = useAuth();
  const { addToast } = useToast();

  const [resetting, setResetting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleTriggerReset = async () => {
    if (!user?.email) return;
    setResetting(true);
    const { error } = await resetPassword(user.email);
    setResetting(false);
    if (error) {
      addToast(error.message, 'error');
    } else {
      setResetSent(true);
      addToast('পাসওয়ার্ড রিসেট ইমেল আপনার ঠিকানায় পাঠানো হয়েছে।', 'success');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-cyan-400" />
          <span>Admin Profile & Security</span>
        </h2>
        <p className="text-xs text-slate-400">
          আপনার প্রশাসক প্রোফাইল ও নিরাপত্তা সেটিংস পর্যালোচনা করুন
        </p>
      </div>

      <div className="bg-[#081022] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 p-[2px]">
            <div className="w-full h-full bg-[#050b16] rounded-[14px] flex items-center justify-center text-cyan-400 font-extrabold text-2xl">
              {adminRecord?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {adminRecord?.full_name || 'Admin User'}
            </h3>
            <p className="text-xs text-slate-400 font-mono">{adminRecord?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${
                adminRecord?.role === 'super_admin'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
              }`}>
                {adminRecord?.role || 'Admin'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {adminRecord?.status || 'Active'}
              </span>
            </div>
          </div>
        </div>

        {/* Credentials and Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block mb-1">User UUID (Auth)</span>
            <span className="text-slate-300 select-all">{user?.id}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block mb-1">Registered Since</span>
            <span className="text-slate-300">
              {adminRecord?.created_at ? new Date(adminRecord.created_at).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>

        {/* Password Reset Action */}
        <div className="pt-6 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" />
                <span>Password & Authentication Security</span>
              </h4>
              <p className="text-xs text-slate-400">
                পাসওয়ার্ড পরিবর্তন করতে চাইলে আপনার ইমেলে সিকিউর রিসেট লিংক পাঠাতে পারেন।
              </p>
            </div>

            <button
              type="button"
              onClick={handleTriggerReset}
              disabled={resetting || resetSent}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors disabled:opacity-50 shrink-0"
            >
              {resetting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : resetSent ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Mail className="w-4 h-4" />
              )}
              <span>{resetSent ? 'ইমেল পাঠানো হয়েছে' : 'পাসওয়ার্ড রিসেট ইমেল পাঠান'}</span>
            </button>
          </div>
        </div>

        {/* Security advisory */}
        <div className="p-4 rounded-xl bg-[#09152e] border border-cyan-500/20 text-xs text-slate-300 flex items-start gap-3">
          <Shield className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-white">নিরাপত্তা সতর্কতা:</strong> আপনার অ্যাডমিন লগইন তথ্য কারো সাথে শেয়ার করবেন না। প্রতিটি অ্যাডমিন অ্যাকশন (প্যাকেজ পরিবর্তন, নোটিশ তৈরি বা ডিলিট) অডিট লগে অপরিবর্তনীয়ভাবে সংরক্ষিত হয়।
          </p>
        </div>
      </div>
    </div>
  );
};
