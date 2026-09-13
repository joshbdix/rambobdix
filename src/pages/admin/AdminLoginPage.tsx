import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BRAND } from '../../lib/constants';
import { isSupabaseConfigured, saveRuntimeSupabaseConfig, SUPABASE_URL } from '../../lib/supabase';
import { 
  Shield, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Settings
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [customUrl, setCustomUrl] = useState(SUPABASE_URL || '');
  const [customKey, setCustomKey] = useState('');

  const { signIn, resetPassword, isEditor, isSuspended, user, adminRecord } = useAuth();
  const navigate = useNavigate();

  // If already logged in:
  // Active admin/editor -> /admin
  // Suspended or authenticated non-admin -> /403
  React.useEffect(() => {
    if (user) {
      if (isSuspended || (adminRecord && adminRecord.status === 'suspended')) {
        navigate('/403', { replace: true });
      } else if (isEditor) {
        navigate('/admin', { replace: true });
      } else if (adminRecord && adminRecord.status !== 'active') {
        navigate('/403', { replace: true });
      }
    }
  }, [user, isEditor, isSuspended, adminRecord, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    if (!email || !password) {
      setErrorMsg('Email and password are required.');
      setLoading(false);
      return;
    }

    const { error, authorized } = await signIn(email, password);

    if (error) {
      setErrorMsg(error.message || 'Authentication failed. Please verify credentials.');
      setLoading(false);
    } else if (authorized === false) {
      // Authenticated with Supabase, but not an authorized/active admin in admins table
      navigate('/403', { replace: true });
    } else {
      navigate('/admin', { replace: true });
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setErrorMsg('Please provide your admin email to receive a password reset link.');
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setResetSuccess(true);
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveRuntimeSupabaseConfig(customUrl, customKey);
    setShowConfigModal(false);
  };

  const isConfigured = isSupabaseConfigured();

  return (
    <div className="min-h-screen bg-[#040813] bg-grid-pattern flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      {/* Background lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="inline-flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 p-[1.5px] shadow-lg shadow-cyan-950/50">
            <div className="w-full h-full bg-[#050b14] rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div className="text-left">
            <div className="font-extrabold text-white text-lg tracking-tight">
              {BRAND.SHORT_NAME}
            </div>
            <div className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider font-semibold">
              BDIX Bypass™
            </div>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Admin Login
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 font-mono">
          Authorized personnel only. Supabase Auth verification.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-[#091124]/95 border border-slate-800 rounded-3xl p-7 sm:p-8 shadow-2xl backdrop-blur-md">
          {/* Error Message */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Reset Success Message */}
          {resetSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>Password reset link has been dispatched to your email. Please check your inbox.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yourdomain.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#060b17] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#060b17] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-950/60 transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Supabase Status Indicator */}
          <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>
              Database: {isConfigured ? <span className="text-emerald-400 font-bold">Online</span> : <span className="text-amber-400 font-bold">Not Configured</span>}
            </span>
            <button
              type="button"
              onClick={() => setShowConfigModal(true)}
              className="text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
            >
              <Settings className="w-3 h-3" />
              <span>Configure Supabase</span>
            </button>
          </div>
        </div>

        {/* Public Website Return */}
        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-slate-500 hover:text-cyan-400 transition-colors">
            ← Return to public website
          </Link>
        </div>
      </div>

      {/* Supabase Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full bg-[#0a1226] border border-slate-700 rounded-2xl p-6 shadow-2xl text-left">
            <h3 className="text-lg font-bold text-white mb-2">Supabase Credentials Setup</h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              আপনার Supabase প্রজেক্টের Project URL এবং Public Anon Key প্রদান করুন। এটি ব্রাউজারে সুরক্ষিতভাবে সংরক্ষিত থাকবে।
            </p>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">SUPABASE URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://your-project.supabase.co"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">PUBLIC ANON KEY</label>
                <input
                  type="text"
                  required
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-cyan-500 text-slate-950"
                >
                  সংরক্ষণ ও সংযোগ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
