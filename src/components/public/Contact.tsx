import React from 'react';
import { useData } from '../../context/DataContext';
import { BRAND, DEFAULT_CONTACTS } from '../../lib/constants';
import { Send, Users, MessageCircle, ArrowUpRight, Shield } from 'lucide-react';

export const Contact: React.FC = () => {
  const { settings } = useData();

  const telegramPersonal = settings.telegram_url || DEFAULT_CONTACTS.TELEGRAM_PERSONAL;
  const telegramGroup = settings.telegram_group_url || DEFAULT_CONTACTS.TELEGRAM_GROUP;
  const fbMessenger = settings.facebook_url || DEFAULT_CONTACTS.FACEBOOK_MESSENGER;

  const contactChannels = [
    {
      title: 'Telegram Personal',
      subtitle: settings.telegram_username || '@joshvhai',
      description: 'সার্ভিস গ্রহণ, বিলিং ও ইনস্ট্যান্ট প্রাইভেট টেকনিক্যাল সহায়তার জন্য।',
      url: telegramPersonal,
      buttonText: 'Telegram এ মেসেজ দিন',
      icon: Send,
      color: 'text-cyan-400',
      border: 'border-cyan-500/40',
      bg: 'bg-cyan-500/10',
      buttonBg: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold',
    },
    {
      title: 'Telegram Group',
      subtitle: 'Official Community Group',
      description: 'কমিউনিটি ডিসকাশন, সার্ভিস আপডেট এবং অফিশিয়াল নোটিশের জন্য যুক্ত হন।',
      url: telegramGroup,
      buttonText: 'Telegram গ্রুপে যুক্ত হন',
      icon: Users,
      color: 'text-blue-400',
      border: 'border-blue-500/40',
      bg: 'bg-blue-500/10',
      buttonBg: 'bg-blue-600 hover:bg-blue-500 text-white font-semibold',
    },
    {
      title: 'Facebook Messenger',
      subtitle: 'Direct Messaging',
      description: 'ফেসবুকের মাধ্যমে সরাসরি যোগাযোগ ও প্রাথমিক ইনফরমেশন পেতে নক দিন।',
      url: fbMessenger,
      buttonText: 'Messenger এ যোগাযোগ করুন',
      icon: MessageCircle,
      color: 'text-indigo-400',
      border: 'border-indigo-500/40',
      bg: 'bg-indigo-500/10',
      buttonBg: 'bg-[#0084FF] hover:bg-[#0074E4] text-white font-semibold',
    },
  ];

  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#050811] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Official Channels
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Let's Connect
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {BRAND.OFFICIAL_NAME} সম্পর্কে জানতে বা সার্ভিস নিতে আমাদের সাথে যোগাযোগ করুন।
          </p>
        </div>

        {/* 3 Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {contactChannels.map((chan, idx) => {
            const Icon = chan.icon;

            return (
              <div
                key={idx}
                className="flex flex-col justify-between p-7 rounded-3xl bg-gradient-to-b from-[#091124] to-[#050a17] border border-slate-800 hover:border-slate-700 transition-all duration-300 group hover:-translate-y-1 shadow-xl shadow-black/50"
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl ${chan.bg} ${chan.border} border flex items-center justify-center mb-6`}>
                    <Icon className={`w-7 h-7 ${chan.color}`} />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">
                    {chan.title}
                  </h3>

                  <div className="text-xs font-mono text-cyan-400 font-semibold mb-3">
                    {chan.subtitle}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                    {chan.description}
                  </p>
                </div>

                <a
                  href={chan.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md active:scale-[0.98] ${chan.buttonBg}`}
                >
                  <span>{chan.buttonText}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>

        {/* Anti-Fraud Security Notice */}
        <div className="max-w-2xl mx-auto mt-12 p-4 rounded-2xl bg-[#091122]/90 border border-slate-800 flex items-center gap-3 text-left">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-white">সতর্কবার্তা:</span> শুধুমাত্র আমাদের উল্লেখিত অফিশিয়াল টেলিগ্রাম ও মেসেঞ্জার লিংকের মাধ্যমে যোগাযোগ করবেন। কোনো ফেক বা থার্ড-পার্টি পেজের সাথে লেনদেন করবেন না।
          </p>
        </div>
      </div>
    </section>
  );
};
