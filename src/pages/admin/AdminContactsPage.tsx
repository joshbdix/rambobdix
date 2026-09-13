import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../components/common/ToastContainer';
import { DEFAULT_CONTACTS } from '../../lib/constants';
import { validateHttpsUrl } from '../../lib/validation';
import { PhoneCall, Save, Send, Users, MessageCircle, ExternalLink, ShieldCheck } from 'lucide-react';

export const AdminContactsPage: React.FC = () => {
  const { settings, updateSettings } = useData();
  const { addToast } = useToast();

  const [saving, setSaving] = useState(false);

  const [telegramUrl, setTelegramUrl] = useState(settings.telegram_url || DEFAULT_CONTACTS.TELEGRAM_PERSONAL);
  const [telegramUsername, setTelegramUsername] = useState(settings.telegram_username || '@joshvhai');
  const [telegramGroupUrl, setTelegramGroupUrl] = useState(settings.telegram_group_url || DEFAULT_CONTACTS.TELEGRAM_GROUP);
  const [facebookUrl, setFacebookUrl] = useState(settings.facebook_url || DEFAULT_CONTACTS.FACEBOOK_MESSENGER);

  useEffect(() => {
    setTelegramUrl(settings.telegram_url || DEFAULT_CONTACTS.TELEGRAM_PERSONAL);
    setTelegramUsername(settings.telegram_username || '@joshvhai');
    setTelegramGroupUrl(settings.telegram_group_url || DEFAULT_CONTACTS.TELEGRAM_GROUP);
    setFacebookUrl(settings.facebook_url || DEFAULT_CONTACTS.FACEBOOK_MESSENGER);
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Protocol and security validation
    const tgCheck = validateHttpsUrl(telegramUrl, 'Telegram Personal URL');
    if (!tgCheck.isValid) {
      addToast(tgCheck.error || 'সঠিক Telegram URL প্রদান করুন।', 'error');
      return;
    }

    const tgGroupCheck = validateHttpsUrl(telegramGroupUrl, 'Telegram Group URL');
    if (!tgGroupCheck.isValid) {
      addToast(tgGroupCheck.error || 'সঠিক Telegram Group URL প্রদান করুন।', 'error');
      return;
    }

    const fbCheck = validateHttpsUrl(facebookUrl, 'Facebook URL');
    if (!fbCheck.isValid) {
      addToast(fbCheck.error || 'সঠিক Facebook URL প্রদান করুন।', 'error');
      return;
    }

    setSaving(true);
    try {
      await updateSettings({
        telegram_url: telegramUrl.trim(),
        telegram_username: telegramUsername.trim(),
        telegram_group_url: telegramGroupUrl.trim(),
        facebook_url: facebookUrl.trim(),
      });
      addToast('অফিসিয়াল যোগাযোগ চ্যানেল সফলভাবে আপডেট করা হয়েছে।', 'success');
    } catch (err: any) {
      addToast(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে।', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-cyan-400" />
          <span>Official Contact Channels</span>
        </h2>
        <p className="text-xs text-slate-400">
          ওয়েবসাইট এবং ফ্লোটিং বাটনে সংযুক্ত অফিসিয়াল টেলিগ্রাম ও মেসেঞ্জার লিংক কনফিগার করুন
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Telegram Personal */}
          <div className="bg-[#081022] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Send className="w-5 h-5" />
                </div>
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-cyan-400"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <h3 className="text-base font-bold text-white mb-1">Telegram Personal</h3>
              <p className="text-xs text-slate-400 mb-4">
                ওয়েবসাইটের প্রধান "যোগাযোগ করুন" বাটনে ব্যবহৃত লিংক
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Username Label
                  </label>
                  <input
                    type="text"
                    required
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                    placeholder="@joshvhai"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Direct URL
                  </label>
                  <input
                    type="url"
                    required
                    value={telegramUrl}
                    onChange={(e) => setTelegramUrl(e.target.value)}
                    placeholder="https://t.me/joshvhai"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Primary Service Channel</span>
            </div>
          </div>

          {/* Telegram Group */}
          <div className="bg-[#081022] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Users className="w-5 h-5" />
                </div>
                <a
                  href={telegramGroupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-blue-400"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <h3 className="text-base font-bold text-white mb-1">Telegram Community</h3>
              <p className="text-xs text-slate-400 mb-4">
                অফিসিয়াল টেলিগ্রাম গ্রুপ লিংক
              </p>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Group URL
                </label>
                <input
                  type="url"
                  required
                  value={telegramGroupUrl}
                  onChange={(e) => setTelegramGroupUrl(e.target.value)}
                  placeholder="https://t.me/josharmy007"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-blue-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Community Discussion</span>
            </div>
          </div>

          {/* Facebook Messenger */}
          <div className="bg-[#081022] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-indigo-400"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <h3 className="text-base font-bold text-white mb-1">Facebook Messenger</h3>
              <p className="text-xs text-slate-400 mb-4">
                অফিসিয়াল ফেসবুক পেজ বা মেসেঞ্জার চ্যাট লিংক
              </p>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Facebook Messenger URL
                </label>
                <input
                  type="url"
                  required
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="https://www.fb.com/joshrambo007"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-indigo-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Direct Social Chat</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>কন্টাক্ট চ্যানেল আপডেট সংরক্ষণ করুন</span>
          </button>
        </div>
      </form>
    </div>
  );
};
