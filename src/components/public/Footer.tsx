import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { BRAND, DEFAULT_CONTACTS } from '../../lib/constants';
import { Zap, Send, Users, MessageCircle, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings } = useData();
  const { effectiveTheme } = useTheme();

  const telegramUrl = settings.telegram_url || DEFAULT_CONTACTS.TELEGRAM_PERSONAL;
  const telegramGroup = settings.telegram_group_url || DEFAULT_CONTACTS.TELEGRAM_GROUP;
  const fbMessenger = settings.facebook_url || DEFAULT_CONTACTS.FACEBOOK_MESSENGER;
  const footerStatement = settings.footer_text || BRAND.PRIMARY_STATEMENT;

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Packages', path: '/packages' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <footer 
      className="border-t pt-16 pb-12 text-sm relative z-20 transition-colors duration-300"
      style={{
        backgroundColor: 'var(--color-card)',
        borderColor: 'var(--color-card-border)',
        color: 'var(--color-text-muted)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b"
          style={{ borderColor: 'var(--color-card-border)' }}
        >
          {/* Brand & Primary Statement */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              {effectiveTheme.logo_url && effectiveTheme.logo_url.trim() !== '' ? (
                <img 
                  src={effectiveTheme.logo_url.trim()} 
                  alt={BRAND.OFFICIAL_NAME} 
                  className="w-9 h-9 object-contain rounded-xl shadow-md"
                />
              ) : (
                <div 
                  className="w-9 h-9 rounded-xl p-[1.5px] shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-cyan, #00e5ff))',
                    borderRadius: 'var(--radius-button)',
                  }}
                >
                  <div 
                    className="w-full h-full rounded-[10px] flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-secondary)' }}
                  >
                    <Zap className="w-4 h-4 text-cyan-400" />
                  </div>
                </div>
              )}

              <div className="flex flex-col text-left">
                <span 
                  className="font-extrabold text-lg tracking-tight transition-colors"
                  style={{ color: 'var(--color-text)' }}
                >
                  {BRAND.SHORT_NAME}
                </span>
                <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider font-semibold">
                  BDIX Bypass™
                </span>
              </div>
            </Link>

            <div 
              className="text-xs font-semibold uppercase tracking-wider mb-2 font-mono"
              style={{ color: 'var(--color-text)' }}
            >
              {BRAND.TAGLINE}
            </div>

            <p className="text-sm leading-relaxed max-w-sm mb-6 opacity-80" style={{ color: 'var(--color-text-muted)' }}>
              "{footerStatement}"
            </p>

            <div 
              className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg border"
              style={{
                backgroundColor: 'var(--color-badge-bg)',
                color: 'var(--color-badge-text)',
                borderColor: 'var(--color-badge-border)',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>BDIX Bypass Routing Active</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h4 
              className="text-xs font-bold font-mono uppercase tracking-wider mb-4"
              style={{ color: 'var(--color-text)' }}
            >
              Website Pages
            </h4>
            <ul className="space-y-2.5 text-sm">
              {links.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-cyan-400 transition-colors inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Contacts */}
          <div className="lg:col-span-4">
            <h4 
              className="text-xs font-bold font-mono uppercase tracking-wider mb-4"
              style={{ color: 'var(--color-text)' }}
            >
              Official Communication
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-cyan-400 transition-colors group"
                  style={{ color: 'var(--color-text)' }}
                >
                  <Send className="w-4 h-4 text-cyan-400" />
                  <span>Telegram Personal</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href={telegramGroup}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-blue-400 transition-colors group"
                  style={{ color: 'var(--color-text)' }}
                >
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>Telegram Group</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href={fbMessenger}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-indigo-400 transition-colors group"
                  style={{ color: 'var(--color-text)' }}
                >
                  <MessageCircle className="w-4 h-4 text-indigo-400" />
                  <span>Facebook Messenger</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div 
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-80"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <p>{BRAND.COPYRIGHT}</p>
          <div className="flex items-center gap-4">
            <span>Official Brand: {BRAND.OFFICIAL_NAME}</span>
            <span>•</span>
            <span>{BRAND.TAGLINE}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
