import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { BRAND } from '../../lib/constants';
import { BangladeshNetworkMap } from '../common/BangladeshNetworkMap';
import { Send, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Hero: React.FC = () => {
  const { settings } = useData();
  const { effectiveTheme } = useTheme();

  const telegramUrl = settings.telegram_url || 'https://t.me/joshvhai';
  const heroTitle = settings.hero_title || BRAND.PRIMARY_STATEMENT;
  const heroDescription = settings.hero_description || BRAND.SUPPORTING_MESSAGE;

  return (
    <section 
      className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-grid-pattern transition-colors duration-300"
      style={{
        backgroundColor: 'var(--color-background)',
      }}
    >
      {/* Ambient background light gradients (hidden if glow_effects is false) */}
      {effectiveTheme.glow_effects && (
        <>
          <div 
            className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-20"
            style={{ backgroundColor: 'var(--color-accent)' }}
          />
          <div 
            className="absolute top-1/3 right-10 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-15"
            style={{ backgroundColor: 'var(--color-accent-cyan, #00e5ff)' }}
          />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Top Brand Category Pill */}
            <div 
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-semibold mb-6 shadow-sm"
              style={{
                backgroundColor: 'var(--color-badge-bg)',
                color: 'var(--color-badge-text)',
                borderColor: 'var(--color-badge-border)',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{BRAND.CATEGORY}</span>
              <span className="opacity-50">•</span>
              <span className="opacity-90">{BRAND.TAGLINE}</span>
            </div>

            {/* Official Brand Headline */}
            <div className="mb-4">
              <span 
                className="block text-base sm:text-lg font-mono font-bold tracking-wider uppercase mb-1"
                style={{ color: 'var(--color-accent)' }}
              >
                {BRAND.SHORT_NAME}
              </span>
              <h1 
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight"
                style={{ color: 'var(--color-text)' }}
              >
                {BRAND.OFFICIAL_NAME}
              </h1>
            </div>

            {/* Main Business Statement Heading */}
            <div 
              className="relative mb-6 p-4 sm:p-5 border-l-4 shadow-sm"
              style={{
                backgroundColor: 'var(--color-card-muted)',
                borderColor: 'var(--color-accent)',
                borderRadius: 'var(--radius-card)',
              }}
            >
              <p 
                className="text-xl sm:text-2xl font-bold leading-relaxed"
                style={{ color: 'var(--color-text)' }}
              >
                "{heroTitle}"
              </p>
            </div>

            {/* Supporting Text */}
            <p 
              className="text-base sm:text-lg mb-8 max-w-2xl leading-relaxed"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {heroDescription}
            </p>

            {/* Key Service Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 w-full max-w-lg text-xs sm:text-sm font-medium">
              <div 
                className="flex items-center gap-2 px-3 py-2 border"
                style={{
                  backgroundColor: 'var(--color-card)',
                  borderColor: 'var(--color-card-border)',
                  color: 'var(--color-text)',
                  borderRadius: 'var(--radius-base)',
                }}
              >
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Bufferless Focus</span>
              </div>
              <div 
                className="flex items-center gap-2 px-3 py-2 border"
                style={{
                  backgroundColor: 'var(--color-card)',
                  borderColor: 'var(--color-card-border)',
                  color: 'var(--color-text)',
                  borderRadius: 'var(--radius-base)',
                }}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>3+ Years Experience</span>
              </div>
              <div 
                className="flex items-center gap-2 px-3 py-2 border col-span-2 sm:col-span-1"
                style={{
                  backgroundColor: 'var(--color-card)',
                  borderColor: 'var(--color-card-border)',
                  color: 'var(--color-text)',
                  borderRadius: 'var(--radius-base)',
                }}
              >
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>24/7 Support</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="theme-btn-primary inline-flex items-center justify-center gap-2.5 px-8 py-4 font-bold text-base shadow-xl transition-all duration-300 active:scale-[0.98]"
              >
                <Send className="w-5 h-5" />
                <span>যোগাযোগ করুন</span>
              </a>

              <Link
                to="/services"
                className="theme-btn-secondary inline-flex items-center justify-center gap-2 px-7 py-4 font-medium text-base transition-all duration-300 active:scale-[0.98]"
              >
                <span>সার্ভিস দেখুন</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </Link>
            </div>
          </div>

          {/* Right Column: Premium Bangladesh Network Visual */}
          <div className="lg:col-span-5 relative">
            <BangladeshNetworkMap />
          </div>
        </div>
      </div>
    </section>
  );
};
