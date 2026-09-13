import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useToast } from '../../components/common/ToastContainer';
import { BRAND, DEFAULT_CONTACTS } from '../../lib/constants';
import { validateHttpsUrl } from '../../lib/validation';
import { AdminThemeSettings } from '../../components/admin/AdminThemeSettings';
import { Settings, Palette, Save, RefreshCw, Shield, FileText } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'appearance';

  const { settings, updateSettings, loading } = useData();
  const { addToast } = useToast();

  const [saving, setSaving] = useState(false);

  // Form states for Brand Copy
  const [tagline, setTagline] = useState(settings.tagline || BRAND.TAGLINE);
  const [heroTitle, setHeroTitle] = useState(settings.hero_title || BRAND.PRIMARY_STATEMENT);
  const [heroDescription, setHeroDescription] = useState(settings.hero_description || BRAND.SUPPORTING_MESSAGE);
  const [aboutText, setAboutText] = useState(settings.about_text || 'দীর্ঘ ৩ বছরের বেশি সময় ধরে JOSH RAMBO BDIX Bypass™ BDIX Bypass connectivity এবং networking experience নিয়ে কাজ করে আসছে। আমাদের লক্ষ্য হলো ব্যবহারকারীদের জন্য একটি stable, smooth এবং better streaming experience তৈরি করা।');
  const [footerText, setFooterText] = useState(settings.footer_text || BRAND.PRIMARY_STATEMENT);
  const [telegramUrl, setTelegramUrl] = useState(settings.telegram_url || DEFAULT_CONTACTS.TELEGRAM_PERSONAL);
  const [telegramUsername, setTelegramUsername] = useState(settings.telegram_username || '@joshvhai');
  const [telegramGroupUrl, setTelegramGroupUrl] = useState(settings.telegram_group_url || DEFAULT_CONTACTS.TELEGRAM_GROUP);
  const [facebookUrl, setFacebookUrl] = useState(settings.facebook_url || DEFAULT_CONTACTS.FACEBOOK_MESSENGER);

  useEffect(() => {
    setTagline(settings.tagline || BRAND.TAGLINE);
    setHeroTitle(settings.hero_title || BRAND.PRIMARY_STATEMENT);
    setHeroDescription(settings.hero_description || BRAND.SUPPORTING_MESSAGE);
    setAboutText(settings.about_text || 'দীর্ঘ ৩ বছরের বেশি সময় ধরে JOSH RAMBO BDIX Bypass™ BDIX Bypass connectivity এবং networking experience নিয়ে কাজ করে আসছে। আমাদের লক্ষ্য হলো ব্যবহারকারীদের জন্য একটি stable, smooth এবং better streaming experience তৈরি করা।');
    setFooterText(settings.footer_text || BRAND.PRIMARY_STATEMENT);
    setTelegramUrl(settings.telegram_url || DEFAULT_CONTACTS.TELEGRAM_PERSONAL);
    setTelegramUsername(settings.telegram_username || '@joshvhai');
    setTelegramGroupUrl(settings.telegram_group_url || DEFAULT_CONTACTS.TELEGRAM_GROUP);
    setFacebookUrl(settings.facebook_url || DEFAULT_CONTACTS.FACEBOOK_MESSENGER);
  }, [settings]);

  const handleSaveBrandCopy = async (e: React.FormEvent) => {
    e.preventDefault();

    if (telegramUrl) {
      const tgCheck = validateHttpsUrl(telegramUrl, 'Telegram URL');
      if (!tgCheck.isValid) {
        addToast(tgCheck.error || 'সঠিক Telegram URL দিন।', 'error');
        return;
      }
    }

    if (telegramGroupUrl) {
      const tgGroupCheck = validateHttpsUrl(telegramGroupUrl, 'Telegram Group URL');
      if (!tgGroupCheck.isValid) {
        addToast(tgGroupCheck.error || 'সঠিক Telegram Group URL দিন।', 'error');
        return;
      }
    }

    if (facebookUrl) {
      const fbCheck = validateHttpsUrl(facebookUrl, 'Facebook URL');
      if (!fbCheck.isValid) {
        addToast(fbCheck.error || 'সঠিক Facebook URL দিন।', 'error');
        return;
      }
    }

    setSaving(true);
    try {
      await updateSettings({
        tagline: tagline.trim(),
        hero_title: heroTitle.trim(),
        hero_description: heroDescription.trim(),
        about_text: aboutText.trim(),
        footer_text: footerText.trim(),
        telegram_url: telegramUrl.trim(),
        telegram_username: telegramUsername.trim(),
        telegram_group_url: telegramGroupUrl.trim(),
        facebook_url: facebookUrl.trim(),
      });
      addToast('ওয়েবসাইট সেটিংস সফলভাবে সংরক্ষিত হয়েছে।', 'success');
    } catch (err: any) {
      addToast(err.message || 'সেটিংস সংরক্ষণ ব্যর্থ হয়েছে।', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setSearchParams({ tab: 'appearance' })}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'appearance'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Appearance / Theme Settings</span>
        </button>

        <button
          type="button"
          onClick={() => setSearchParams({ tab: 'branding' })}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'branding'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Website Brand Copy</span>
        </button>
      </div>

      {/* Tab 1: Dedicated Appearance / Theme Settings */}
      {activeTab === 'appearance' && (
        <AdminThemeSettings />
      )}

      {/* Tab 2: Brand Copy Settings */}
      {activeTab === 'branding' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Settings className="w-5 h-5 text-cyan-400" />
              <span>Website Settings & Brand Copy</span>
            </h2>
            <p className="text-xs text-slate-400">
              ওয়েবসাইটের মূল ব্যবসায়িক বক্তব্য, ট্যাগলাইন এবং অফিসিয়াল টেক্সট কনফিগার করুন
            </p>
          </div>

          <form onSubmit={handleSaveBrandCopy} className="space-y-6">
            {/* Brand Rule Notice */}
            <div className="p-4 rounded-2xl bg-[#0a152e] border border-cyan-500/30 flex items-start gap-3">
              <Shield className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed text-slate-300">
                <span className="font-bold text-white uppercase tracking-wider block mb-0.5">Strict Branding Rule</span>
                অফিশিয়াল ব্র্যান্ড নাম সর্বদা <strong className="text-cyan-400 font-semibold">{BRAND.OFFICIAL_NAME}</strong> বা <strong className="text-cyan-400 font-semibold">{BRAND.SHORT_NAME}</strong> থাকবে। কোনো অবস্থাতেই "JOSH Internet" বা "A Part of Josh Internet" ব্যবহার করা যাবে না।
              </div>
            </div>

            {/* Core Content Card */}
            <div className="bg-[#081022] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono">
                Core Business Statements
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Main Brand Tagline
                </label>
                <input
                  type="text"
                  required
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Primary Business Statement (Hero Title) *
                </label>
                <input
                  type="text"
                  required
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  ডিফল্ট: "দীর্ঘ ৩ বছরের বেশি সময় সফলতার সাথে BDIX বাইপাস প্রোভাইড করে যাচ্ছি।"
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Supporting Statement (Hero Description) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={heroDescription}
                  onChange={(e) => setHeroDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  ডিফল্ট: "Bufferless experience এর জন্য JOSH RAMBO BDIX Bypass™-এর সাথে যোগাযোগ করুন।"
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  About Section Text *
                </label>
                <textarea
                  required
                  rows={3}
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Footer Statement
                </label>
                <input
                  type="text"
                  required
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Save Button Bar */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>সেটিংস সংরক্ষণ করুন (Save Settings)</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
