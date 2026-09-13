import React from 'react';
import { Clock, Network, Headphones, ShieldCheck } from 'lucide-react';

export const Stats: React.FC = () => {
  const stats = [
    {
      value: '3+',
      label: 'Years Experience',
      subtext: 'সফলতার সাথে BDIX বাইপাস সার্ভিস',
      icon: Clock,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
    },
    {
      value: 'BDIX',
      label: 'Bypass Service',
      subtext: 'স্মুথ ও অপ্টিমাইজড রাউটিং নেটওয়ার্ক',
      icon: Network,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      value: '24/7',
      label: 'Support',
      subtext: 'টেলিগ্রাম ও মেসেঞ্জারে সরাসরি সহায়তা',
      icon: Headphones,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      value: 'Stable',
      label: 'Connectivity',
      subtext: 'নির্ভরযোগ্য ও ধারাবাহিক পারফরম্যান্স',
      icon: ShieldCheck,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
  ];

  return (
    <section className="py-12 border-y border-slate-800/80 bg-[#060b18]/60 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex flex-col p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#0a1226]/80 to-[#070e1e]/60 border border-slate-800/90 hover:border-slate-700 transition-all duration-300 group hover:-translate-y-1 shadow-lg shadow-black/40"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.border} border`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 tracking-wider">0{idx + 1}</span>
                </div>

                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight group-hover:text-cyan-300 transition-colors">
                  {stat.value}
                </div>

                <div className="text-sm font-semibold text-slate-200 mt-1">
                  {stat.label}
                </div>

                <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {stat.subtext}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
