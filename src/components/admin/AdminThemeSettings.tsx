import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastContainer';
import { 
  ThemeSettings, 
  ThemePreset, 
  ButtonStyle, 
  BorderRadiusStyle, 
  AnimationIntensity, 
  FontFamilyOption,
  THEME_PRESETS_MAP,
  DEFAULT_THEME_JOSH_DARK
} from '../../types/theme';
import { BRAND } from '../../lib/constants';
import { 
  Palette, 
  Save, 
  RotateCcw, 
  Eye, 
  Check, 
  Sparkles, 
  Sun, 
  Moon, 
  Zap, 
  Image as ImageIcon, 
  Type, 
  Sliders, 
  Layers, 
  ShieldAlert, 
  RefreshCw,
  Send,
  AlertCircle
} from 'lucide-react';

export const AdminThemeSettings: React.FC = () => {
  const { theme, effectiveTheme, updateTheme, setPreview, resetToDefault } = useTheme();
  const { isAdmin, isSuperAdmin, isEditor } = useAuth();
  const { addToast } = useToast();

  const canEdit = isAdmin || isSuperAdmin;

  // Form state initialized with currently active theme
  const [formData, setFormData] = useState<ThemeSettings>(theme);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Keep form data in sync if global theme loads from database
  useEffect(() => {
    setFormData(theme);
  }, [theme]);

  // Handle Preset selection
  const handleSelectPreset = (presetKey: ThemePreset) => {
    if (!canEdit) return;
    const preset = THEME_PRESETS_MAP[presetKey];
    const updated: ThemeSettings = {
      ...formData,
      preset: presetKey,
      primary_color: preset.primary_color,
      secondary_color: preset.secondary_color,
      accent_color: preset.accent_color,
      background_color: preset.background_color,
      text_color: preset.text_color,
      button_color: preset.button_color || preset.accent_color,
      button_style: preset.button_style,
      glow_effects: preset.glow_effects,
      border_radius: preset.border_radius,
    };
    setFormData(updated);
    // Instant Live Preview on screen
    setPreview(updated);
    addToast(`${presetKey.toUpperCase().replace('_', ' ')} প্রিসেট প্রিভিউ চালু হয়েছে।`, 'info');
  };

  // Update a single form field
  const handleChange = <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => {
    if (!canEdit) return;
    const updated = {
      ...formData,
      [key]: value,
    };
    setFormData(updated);
    // Real-time preview update
    setPreview(updated);
  };

  // Save changes to Supabase & localStorage
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) {
      addToast('শুধুমাত্র Admin বা Super Admin থিম সেটিংস পরিবর্তন করতে পারেন।', 'error');
      return;
    }

    setSaving(true);
    try {
      await updateTheme(formData);
      addToast('থিম সেটিংস সফলভাবে সংরক্ষিত ও কার্যকর হয়েছে!', 'success');
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'থিম সেটিংস সংরক্ষণে সমস্যা হয়েছে।', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Revert preview back to saved theme
  const handleRevertPreview = () => {
    setPreview(null);
    setFormData(theme);
    addToast('প্রিভিউ বাতিল করে সংরক্ষিত থিমে ফিরে যাওয়া হয়েছে।', 'info');
  };

  // Reset to default JOSH DARK
  const handleConfirmReset = async () => {
    if (!canEdit) return;
    setResetting(true);
    try {
      await resetToDefault();
      setFormData(DEFAULT_THEME_JOSH_DARK);
      setShowResetConfirm(false);
      addToast('থিম ডিফল্ট JOSH DARK-এ রিসেট করা হয়েছে।', 'success');
    } catch (err: any) {
      addToast(err.message || 'রিসেট করতে ব্যর্থ হয়েছে।', 'error');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-cyan-400" />
            <span>Appearance & Theme Settings</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            পাবলিক ওয়েবসাইট ও ইন্টারফেসের প্রিসেট থিম, কালার প্যালেট, টাইপোগ্রাফি এবং অ্যানিমেশন নিয়ন্ত্রণ করুন
          </p>
        </div>

        {/* Action button bar */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleRevertPreview}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all"
            title="প্রিভিউ বাতিল করুন"
          >
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Preview</span>
          </button>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            disabled={!canEdit || resetting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 text-xs font-semibold transition-all disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to JOSH DARK</span>
          </button>
        </div>
      </div>

      {/* Editor Warning Banner if role is Editor */}
      {!canEdit && (
        <div className="p-4 rounded-2xl bg-amber-950/50 border border-amber-500/40 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200">
            <strong className="font-bold block text-white mb-0.5">Read-Only Mode</strong>
            আপনার অ্যাকাউন্ট রোল হলো <strong className="uppercase font-mono text-amber-300">Editor</strong>। শুধুমাত্র Admin এবং Super Admin থিম কনফিগারেশন পরিবর্তন ও সংরক্ষণ করতে পারেন।
          </div>
        </div>
      )}

      {/* 1. Theme Presets Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span>1. Official Theme Presets</span>
          </h3>
          <span className="text-[11px] text-slate-400">
            বর্তমানে সক্রিয়: <strong className="text-white uppercase font-mono">{formData.preset.replace('_', ' ')}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Preset 1: JOSH DARK (Default) */}
          <div
            onClick={() => handleSelectPreset('josh_dark')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 relative overflow-hidden group ${
              formData.preset === 'josh_dark'
                ? 'bg-[#081022] border-cyan-400 shadow-lg shadow-cyan-950/60 ring-2 ring-cyan-500/30'
                : 'bg-[#060b18] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-cyan-400" />
                <span className="font-extrabold text-sm text-white">JOSH DARK</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Default
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              ডিপ নেভি ব্যাকগ্রাউন্ড (#050811), ইলেকট্রিক ব্লু ও সায়ান অ্যাকসেন্ট। প্রিমিয়াম নেটওয়ার্কিং ও আইএসপি স্টাইল।
            </p>

            {/* Color Swatch Preview */}
            <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/80">
              <div className="w-5 h-5 rounded-full bg-[#050811] border border-slate-700" title="Background: #050811" />
              <div className="w-5 h-5 rounded-full bg-[#0a1931]" title="Primary: #0a1931" />
              <div className="w-5 h-5 rounded-full bg-[#2563eb]" title="Accent: Electric Blue" />
              <div className="w-5 h-5 rounded-full bg-[#00e5ff]" title="Cyan Accent" />
              <div className="w-5 h-5 rounded-full bg-white" title="Text: White" />
            </div>
            {formData.preset === 'josh_dark' && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
          </div>

          {/* Preset 2: JOSH LIGHT */}
          <div
            onClick={() => handleSelectPreset('josh_light')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 relative overflow-hidden group ${
              formData.preset === 'josh_light'
                ? 'bg-slate-900 border-blue-400 shadow-lg shadow-blue-950/60 ring-2 ring-blue-500/30'
                : 'bg-[#060b18] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="font-extrabold text-sm text-white">JOSH LIGHT</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Corporate
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              সফট হোয়াইট ব্যাকগ্রাউন্ড (#f8fafc), ডার্ক নেভি টেক্সট ও নীল অ্যাকসেন্ট। ক্লিন কর্পোরেট লুক।
            </p>

            {/* Color Swatch Preview */}
            <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/80">
              <div className="w-5 h-5 rounded-full bg-[#f8fafc] border border-slate-300" title="Background: #f8fafc" />
              <div className="w-5 h-5 rounded-full bg-[#0b1528]" title="Primary: Dark Navy" />
              <div className="w-5 h-5 rounded-full bg-[#2563eb]" title="Accent: Blue" />
              <div className="w-5 h-5 rounded-full bg-[#ffffff] border border-slate-300" title="Card: White" />
              <div className="w-5 h-5 rounded-full bg-[#0f172a]" title="Text: Dark Navy" />
            </div>
            {formData.preset === 'josh_light' && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-400 flex items-center justify-center text-slate-950">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
          </div>

          {/* Preset 3: JOSH NEON */}
          <div
            onClick={() => handleSelectPreset('josh_neon')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 relative overflow-hidden group ${
              formData.preset === 'josh_neon'
                ? 'bg-[#040814] border-cyan-400 shadow-lg shadow-cyan-950/60 ring-2 ring-cyan-500/30'
                : 'bg-[#060b18] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-300" />
                <span className="font-extrabold text-sm text-white">JOSH NEON</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Modern Tech
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              ডিপ ব্ল্যাক (#030712), ইলেকট্রিক ব্লু, ভাইব্রেন্ট সায়ান ও নিয়ন্ত্রিত গ্রীন অ্যাকসেন্ট। প্রফেশনাল নেটওয়ার্কিং লুক।
            </p>

            {/* Color Swatch Preview */}
            <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/80">
              <div className="w-5 h-5 rounded-full bg-[#030712] border border-cyan-500/30" title="Background: #030712" />
              <div className="w-5 h-5 rounded-full bg-[#1d4ed8]" title="Primary: Electric Blue" />
              <div className="w-5 h-5 rounded-full bg-[#00f0ff]" title="Accent: Cyan" />
              <div className="w-5 h-5 rounded-full bg-[#10b981]" title="Secondary: Emerald" />
              <div className="w-5 h-5 rounded-full bg-white" title="Text: White" />
            </div>
            {formData.preset === 'josh_neon' && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Interactive Live Preview Card */}
      <div className="bg-[#081022] border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
              Live Theme Preview (রিয়েল-টাইম প্রিভিউ)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            পরিবর্তনসমূহ সাথে সাথে নিচের সিমুলেশনে দেখা যাচ্ছে
          </span>
        </div>

        {/* Mock Public UI Component within Container */}
        <div 
          className="rounded-2xl p-6 border transition-all duration-300"
          style={{
            backgroundColor: formData.background_color,
            borderColor: formData.preset === 'josh_light' ? '#e2e8f0' : 'rgba(51, 65, 85, 0.7)',
            color: formData.text_color,
          }}
        >
          {/* Mock Navbar Snippet */}
          <div 
            className="flex items-center justify-between pb-4 border-b mb-6"
            style={{ borderColor: formData.preset === 'josh_light' ? '#e2e8f0' : 'rgba(51, 65, 85, 0.5)' }}
          >
            <div className="flex items-center gap-2.5">
              {formData.logo_url ? (
                <img src={formData.logo_url} alt="Logo Preview" className="w-8 h-8 rounded-lg object-contain" />
              ) : (
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow"
                  style={{ backgroundColor: formData.primary_color }}
                >
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-extrabold text-sm" style={{ color: formData.text_color }}>
                  {BRAND.SHORT_NAME}
                </span>
                <span className="text-[9px] opacity-70" style={{ color: formData.text_color }}>
                  {BRAND.TAGLINE}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs opacity-80">
              <span className="hidden sm:inline">Services</span>
              <span className="hidden sm:inline">Packages</span>
              <span className="px-2.5 py-1 rounded-lg font-semibold" style={{ backgroundColor: formData.primary_color, color: '#ffffff' }}>
                Contact
              </span>
            </div>
          </div>

          {/* Mock Hero Snippet */}
          <div className="space-y-4 max-w-xl">
            <div 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: formData.preset === 'josh_light' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(0, 229, 255, 0.1)',
                color: formData.accent_color,
              }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{BRAND.CATEGORY} • 0% Packet Loss</span>
            </div>

            <h4 className="text-xl sm:text-2xl font-black leading-tight" style={{ color: formData.text_color }}>
              {BRAND.OFFICIAL_NAME}
            </h4>

            <p className="text-xs sm:text-sm opacity-80 leading-relaxed" style={{ color: formData.text_color }}>
              দীর্ঘ ৩ বছরের বেশি সময় ধরে JOSH RAMBO BDIX Bypass™ BDIX Bypass connectivity এবং bufferless streaming experience প্রদান করে আসছে।
            </p>

            {/* Mock Buttons with Active Button Style and Radius */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                className="px-5 py-2.5 text-xs font-bold transition-all shadow-md"
                style={{
                  backgroundColor: formData.button_style === 'outline' ? 'transparent' : (formData.button_color || formData.accent_color),
                  color: formData.button_style === 'outline' ? formData.accent_color : '#ffffff',
                  border: formData.button_style === 'outline' ? `2px solid ${formData.accent_color}` : '1px solid transparent',
                  background: formData.button_style === 'gradient' ? `linear-gradient(135deg, ${formData.accent_color}, #00f0ff)` : undefined,
                  borderRadius: formData.border_radius === 'sharp' ? '4px' : formData.border_radius === 'rounded' ? '9999px' : '12px',
                }}
              >
                <span>যোগাযোগ করুন (Primary CTA)</span>
              </button>

              <button
                type="button"
                className="px-4 py-2.5 text-xs font-semibold border opacity-80 hover:opacity-100 transition-all"
                style={{
                  backgroundColor: formData.preset === 'josh_light' ? '#f1f5f9' : '#0a1428',
                  color: formData.text_color,
                  borderColor: formData.preset === 'josh_light' ? '#cbd5e1' : '#334155',
                  borderRadius: formData.border_radius === 'sharp' ? '4px' : formData.border_radius === 'rounded' ? '9999px' : '12px',
                }}
              >
                <span>প্যাকেজ দেখুন (Secondary)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* 3. Custom Palette & Colors */}
        <div className="bg-[#081022] border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              <span>2. Color Palette Customization</span>
            </h3>
            <span className="text-[11px] text-slate-400">রিয়েল-টাইম কালার টোকেন</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Primary Color */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Primary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  disabled={!canEdit}
                  value={formData.primary_color}
                  onChange={(e) => handleChange('primary_color', e.target.value)}
                  className="w-9 h-9 rounded-lg border border-slate-700 bg-transparent cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  disabled={!canEdit}
                  value={formData.primary_color}
                  onChange={(e) => handleChange('primary_color', e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white"
                />
              </div>
            </div>

            {/* Secondary Color */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Secondary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  disabled={!canEdit}
                  value={formData.secondary_color}
                  onChange={(e) => handleChange('secondary_color', e.target.value)}
                  className="w-9 h-9 rounded-lg border border-slate-700 bg-transparent cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  disabled={!canEdit}
                  value={formData.secondary_color}
                  onChange={(e) => handleChange('secondary_color', e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white"
                />
              </div>
            </div>

            {/* Accent Color */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  disabled={!canEdit}
                  value={formData.accent_color}
                  onChange={(e) => handleChange('accent_color', e.target.value)}
                  className="w-9 h-9 rounded-lg border border-slate-700 bg-transparent cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  disabled={!canEdit}
                  value={formData.accent_color}
                  onChange={(e) => handleChange('accent_color', e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white"
                />
              </div>
            </div>

            {/* Button Color */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Button Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  disabled={!canEdit}
                  value={formData.button_color || formData.accent_color}
                  onChange={(e) => handleChange('button_color', e.target.value)}
                  className="w-9 h-9 rounded-lg border border-slate-700 bg-transparent cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  disabled={!canEdit}
                  value={formData.button_color || formData.accent_color}
                  onChange={(e) => handleChange('button_color', e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white"
                />
              </div>
            </div>

            {/* Background Color */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  disabled={!canEdit}
                  value={formData.background_color}
                  onChange={(e) => handleChange('background_color', e.target.value)}
                  className="w-9 h-9 rounded-lg border border-slate-700 bg-transparent cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  disabled={!canEdit}
                  value={formData.background_color}
                  onChange={(e) => handleChange('background_color', e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Logo & Favicon Settings */}
        <div className="bg-[#081022] border border-slate-800 rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            <span>3. Brand Logo & Favicon Assets</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo URL */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Logo Asset URL (Secure/Public URL)
              </label>
              <input
                type="url"
                disabled={!canEdit}
                placeholder="https://example.com/logo.png"
                value={formData.logo_url}
                onChange={(e) => handleChange('logo_url', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400">
                খালি রাখলে অফিশিয়াল ভেক্টর আইকন ব্যবহৃত হবে। Supabase Storage বা পাবলিক HTTPS লিঙ্ক দিন।
              </p>
              {formData.logo_url && (
                <div className="flex items-center gap-3 p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400">Logo Preview:</span>
                  <img src={formData.logo_url} alt="Logo" className="h-8 max-w-[120px] object-contain" />
                </div>
              )}
            </div>

            {/* Favicon URL */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Favicon Asset URL (.ico / .svg / .png)
              </label>
              <input
                type="url"
                disabled={!canEdit}
                placeholder="https://example.com/favicon.ico"
                value={formData.favicon_url}
                onChange={(e) => handleChange('favicon_url', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400">
                ব্রাউজার ট্যাবের আইকন আপডেট হবে। নিরাপদ পাবলিক অ্যাসেট পাথ ব্যবহার করুন।
              </p>
              {formData.favicon_url && (
                <div className="flex items-center gap-3 p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400">Favicon Preview:</span>
                  <img src={formData.favicon_url} alt="Favicon" className="w-5 h-5 object-contain" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 5. Typography Settings */}
        <div className="bg-[#081022] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
            <Type className="w-4 h-4" />
            <span>4. Typography (ফন্ট সিলেকশন)</span>
          </h3>
          <p className="text-xs text-slate-400">
            বাংলা ও ইংরেজি হরফের সুন্দর রেন্ডারিং নিশ্চিত করতে ফন্ট কম্বিনেশন বেছে নিন:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'Inter + Hind Siliguri', label: 'Inter + Hind Siliguri', desc: 'Default (Bangla + Latin Optimized)' },
              { id: 'Inter', label: 'Inter', desc: 'Clean Modern Geometric' },
              { id: 'Hind Siliguri', label: 'Hind Siliguri', desc: 'Bengali Native Typographic Scale' },
            ].map((f) => (
              <label
                key={f.id}
                className={`flex flex-col p-3.5 rounded-xl border cursor-pointer transition-all ${
                  formData.font_family === f.id
                    ? 'bg-slate-900 border-cyan-400 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white">{f.label}</span>
                  <input
                    type="radio"
                    name="font_family"
                    disabled={!canEdit}
                    value={f.id}
                    checked={formData.font_family === f.id}
                    onChange={() => handleChange('font_family', f.id as FontFamilyOption)}
                    className="text-cyan-500 focus:ring-cyan-400"
                  />
                </div>
                <span className="text-[11px] text-slate-500">{f.desc}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 6. Button Style & Border Radius */}
        <div className="bg-[#081022] border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            <span>5. Controls & Styling (Button & Border Radius)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Button Style */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                Button Style (বাটন স্টাইল)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['solid', 'outline', 'gradient'] as ButtonStyle[]).map((style) => (
                  <button
                    key={style}
                    type="button"
                    disabled={!canEdit}
                    onClick={() => handleChange('button_style', style)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                      formData.button_style === style
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400">
                ডিফল্ট: <strong>Solid</strong>. JOSH NEON-এ Gradient অত্যন্ত আধুনিক দেখায়।
              </p>
            </div>

            {/* Border Radius */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                Border Radius (কর্নারের রাউন্ডনেস)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['sharp', 'medium', 'rounded'] as BorderRadiusStyle[]).map((radius) => (
                  <button
                    key={radius}
                    type="button"
                    disabled={!canEdit}
                    onClick={() => handleChange('border_radius', radius)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                      formData.border_radius === radius
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {radius}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400">
                ডিফল্ট: <strong>Medium (12px/16px)</strong>. Sharp = 4px, Rounded = পিল/24px।
              </p>
            </div>
          </div>

          {/* Animation Intensity */}
          <div className="pt-3 border-t border-slate-800/80 space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              Animation Intensity (অ্যানিমেশন স্পিড ও মাত্রা)
            </label>
            <div className="grid grid-cols-3 gap-3 max-w-md">
              {(['low', 'medium', 'high'] as AnimationIntensity[]).map((intensity) => (
                <button
                  key={intensity}
                  type="button"
                  disabled={!canEdit}
                  onClick={() => handleChange('animation_intensity', intensity)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                    formData.animation_intensity === intensity
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {intensity}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400">
              ব্রাউজারের <code>prefers-reduced-motion</code> সেটিং সক্রিয় থাকলে সিস্টেম স্বয়ংক্রিয়ভাবে অ্যানিমেশন বন্ধ রাখবে।
            </p>
          </div>
        </div>

        {/* 7. Visual Settings Toggles */}
        <div className="bg-[#081022] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>6. Visual Elements & Toggles</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Network Animation */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div>
                <span className="block text-xs font-bold text-white">Network Animation</span>
                <span className="text-[10px] text-slate-400">ম্যাপ ও নেটওয়ার্ক পালস ইফেক্ট</span>
              </div>
              <button
                type="button"
                disabled={!canEdit}
                onClick={() => handleChange('network_animation', !formData.network_animation)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.network_animation ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.network_animation ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Background Grid */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div>
                <span className="block text-xs font-bold text-white">Background Grid</span>
                <span className="text-[10px] text-slate-400">হালকা সাবটেল গ্রিড প্যাটার্ন</span>
              </div>
              <button
                type="button"
                disabled={!canEdit}
                onClick={() => handleChange('background_grid', !formData.background_grid)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.background_grid ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.background_grid ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Glow Effects */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div>
                <span className="block text-xs font-bold text-white">Glow Effects</span>
                <span className="text-[10px] text-slate-400">অ্যাম্বিয়েন্ট গ্লো ও শ্যাডো</span>
              </div>
              <button
                type="button"
                disabled={!canEdit}
                onClick={() => handleChange('glow_effects', !formData.glow_effects)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.glow_effects ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.glow_effects ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Page Animations */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div>
                <span className="block text-xs font-bold text-white">Page Animations</span>
                <span className="text-[10px] text-slate-400">পেজ ট্রানজিশন ও ফেড-ইন</span>
              </div>
              <button
                type="button"
                disabled={!canEdit}
                onClick={() => handleChange('page_animations', !formData.page_animations)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.page_animations ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.page_animations ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Announcement Bar */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div>
                <span className="block text-xs font-bold text-white">Announcement Bar</span>
                <span className="text-[10px] text-slate-400">ওয়েবসাইটের শীর্ষ নোটিশ বার</span>
              </div>
              <button
                type="button"
                disabled={!canEdit}
                onClick={() => handleChange('announcement_enabled', !formData.announcement_enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.announcement_enabled ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.announcement_enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Floating Contact Button */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div>
                <span className="block text-xs font-bold text-white">Floating Contact Button</span>
                <span className="text-[10px] text-slate-400">নিচে ডানে ফ্লোটিং কুইক চ্যাট বাটন</span>
              </div>
              <button
                type="button"
                disabled={!canEdit}
                onClick={() => handleChange('floating_contact_enabled', !formData.floating_contact_enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.floating_contact_enabled ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.floating_contact_enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={!canEdit || saving}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Theme Changes (থিম পরিবর্তন সংরক্ষণ)</span>
          </button>
        </div>
      </form>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-w-md w-full rounded-2xl bg-[#081022] border border-rose-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-extrabold text-base text-white">
                Reset to Default Theme (JOSH DARK)?
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              আপনি কি নিশ্চিত যে সকল কাস্টমাইজেশন মুছে ডিফল্ট <strong>JOSH DARK</strong> থিমে ফিরে যেতে চান? এটি ওয়েবসাইটের কালার প্যালেট, বাটন স্টাইল ও ফন্ট সেটিংস স্ট্যান্ডার্ড মোডে ফিরিয়ে নেবে।
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                disabled={resetting}
                onClick={handleConfirmReset}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all disabled:opacity-50"
              >
                {resetting ? 'রিসেট হচ্ছে...' : 'হ্যাঁ, JOSH DARK-এ রিসেট করুন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
