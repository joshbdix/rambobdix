import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { BRAND } from '../../lib/constants';
import { Menu, X, Send, Zap } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { settings } = useData();
  const { effectiveTheme } = useTheme();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Packages', path: '/packages' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const telegramUrl = settings.telegram_url || 'https://t.me/joshvhai';

  return (
    <header 
      className="sticky top-0 z-30 w-full backdrop-blur-md border-b transition-colors duration-300"
      style={{
        backgroundColor: 'var(--color-nav-bg)',
        borderColor: 'var(--color-nav-border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3.5 group focus:outline-none"
            aria-label="JOSH RAMBO BDIX Bypass Home"
          >
            {/* Custom Logo or Default Graphic */}
            {effectiveTheme.logo_url && effectiveTheme.logo_url.trim() !== '' ? (
              <img 
                src={effectiveTheme.logo_url.trim()} 
                alt={BRAND.OFFICIAL_NAME} 
                className="w-10 h-10 object-contain rounded-xl shadow-md"
              />
            ) : (
              <div 
                className="relative w-10 h-10 rounded-xl p-[1.5px] shadow-lg transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-cyan, #00e5ff))',
                  borderRadius: 'var(--radius-button)',
                }}
              >
                <div 
                  className="w-full h-full rounded-[10px] flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: 'var(--color-secondary)' }}
                >
                  <Zap className="w-5 h-5 text-cyan-400 relative z-10" />
                </div>
              </div>
            )}

            {/* Brand Title */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span 
                  className="font-extrabold text-lg sm:text-xl tracking-tight transition-colors"
                  style={{ color: 'var(--color-text)' }}
                >
                  {BRAND.SHORT_NAME}
                </span>
                <span 
                  className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border"
                  style={{
                    backgroundColor: 'var(--color-badge-bg)',
                    color: 'var(--color-badge-text)',
                    borderColor: 'var(--color-badge-border)',
                  }}
                >
                  BDIX Bypass™
                </span>
              </div>
              <span 
                className="text-[11px] font-medium tracking-wide opacity-80"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {BRAND.TAGLINE}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'border font-semibold'
                      : 'hover:opacity-100'
                  }`}
                  style={{
                    borderRadius: 'var(--radius-button)',
                    color: active ? 'var(--color-badge-text)' : 'var(--color-text-muted)',
                    backgroundColor: active ? 'var(--color-badge-bg)' : 'transparent',
                    borderColor: active ? 'var(--color-badge-border)' : 'transparent',
                  }}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="theme-btn-primary inline-flex items-center gap-2 px-5 py-2.5 font-semibold text-sm shadow-lg transition-all duration-300 active:scale-[0.98]"
              style={{
                borderRadius: 'var(--radius-button)',
              }}
            >
              <Send className="w-4 h-4" />
              <span>যোগাযোগ করুন</span>
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="theme-btn-primary inline-flex items-center gap-1.5 px-3 py-1.5 font-semibold text-xs"
              style={{ borderRadius: 'var(--radius-button)' }}
            >
              <Send className="w-3.5 h-3.5" />
              <span>টেলিগ্রাম</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border transition-colors"
              style={{
                borderColor: 'var(--color-card-border)',
                color: 'var(--color-text)',
                backgroundColor: 'var(--color-card)',
              }}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden border-b px-4 pt-3 pb-5 space-y-2 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200"
          style={{
            backgroundColor: 'var(--color-nav-bg)',
            borderColor: 'var(--color-nav-border)',
          }}
        >
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 text-sm font-medium transition-all"
                style={{
                  borderRadius: 'var(--radius-button)',
                  color: active ? 'var(--color-badge-text)' : 'var(--color-text-muted)',
                  backgroundColor: active ? 'var(--color-badge-bg)' : 'transparent',
                }}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="pt-3 border-t" style={{ borderColor: 'var(--color-card-border)' }}>
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="theme-btn-primary flex items-center justify-center gap-2 w-full py-3 font-semibold text-sm"
              style={{ borderRadius: 'var(--radius-button)' }}
            >
              <Send className="w-4 h-4" />
              <span>টেলিগ্রামে যোগাযোগ করুন</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
