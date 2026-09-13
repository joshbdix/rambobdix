import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { DEFAULT_CONTACTS } from '../../lib/constants';
import { MessageSquare, X, Send, Users, MessageCircle } from 'lucide-react';

export const FloatingContact: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useData();

  const telegramUrl = settings.telegram_url || DEFAULT_CONTACTS.TELEGRAM_PERSONAL;
  const telegramGroup = settings.telegram_group_url || DEFAULT_CONTACTS.TELEGRAM_GROUP;
  const fbMessenger = settings.facebook_url || DEFAULT_CONTACTS.FACEBOOK_MESSENGER;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Floating Menu Popover */}
      {isOpen && (
        <div className="mb-3 w-64 rounded-2xl bg-[#091224]/95 border border-cyan-500/30 p-3 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="text-[11px] font-mono text-cyan-400 font-semibold px-2 py-1 uppercase tracking-wider border-b border-slate-800/80 mb-2">
            Quick Connect
          </div>

          <div className="space-y-1.5">
            {/* Telegram Personal */}
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 hover:bg-cyan-500/10 hover:border-cyan-500/30 border border-transparent transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Send className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                  Telegram Chat
                </div>
                <div className="text-[10px] text-slate-400">ব্যক্তিগত সাপোর্ট</div>
              </div>
            </a>

            {/* Telegram Group */}
            <a
              href={telegramGroup}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 hover:bg-blue-500/10 hover:border-blue-500/30 border border-transparent transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                  Telegram Group
                </div>
                <div className="text-[10px] text-slate-400">কমিউনিটি ডিসকাশন</div>
              </div>
            </a>

            {/* Messenger */}
            <a
              href={fbMessenger}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 hover:bg-indigo-500/10 hover:border-indigo-500/30 border border-transparent transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                  Messenger
                </div>
                <div className="text-[10px] text-slate-400">ফেসবুক মেসেজ</div>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Contact Channels"
        className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 flex items-center justify-center shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 active:scale-95 group focus:outline-none"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-slate-950" />
        ) : (
          <div className="relative">
            <MessageSquare className="w-6 h-6 text-slate-950" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#050811] animate-pulse" />
          </div>
        )}
      </button>
    </div>
  );
};
