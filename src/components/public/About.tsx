import React from 'react';
import { useData } from '../../context/DataContext';
import { BRAND } from '../../lib/constants';
import { ShieldCheck, Zap, Headphones, Award, CheckCircle } from 'lucide-react';

export const About: React.FC = () => {
  const { settings } = useData();

  const aboutText = settings.about_text || 'দীর্ঘ ৩ বছরের বেশি সময় ধরে JOSH RAMBO BDIX Bypass™ BDIX Bypass connectivity এবং networking experience নিয়ে কাজ করে আসছে। আমাদের লক্ষ্য হলো ব্যবহারকারীদের জন্য একটি stable, smooth এবং better streaming experience তৈরি করা।';

  const pillars = [
    {
      title: 'Experience',
      titleBn: 'অভিজ্ঞতা',
      desc: 'দীর্ঘ ৩ বছরের বেশি সময় সফলতার সাথে BDIX বাইপাস ও নেটওয়ার্কিং সলিউশন প্রদানের ধারাবাহিক অভিজ্ঞতা।',
      icon: Award,
      color: 'text-cyan-400',
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-500/10',
    },
    {
      title: 'Reliability',
      titleBn: 'নির্ভরযোগ্যতা',
      desc: 'স্থায়ী ও ধারাবাহিক কানেক্টিভিটি নিশ্চিতকরণে অপ্টিমাইজড নেটওয়ার্ক পাথ নির্বাচন ও নিরবচ্ছিন্ন সার্ভিস।',
      icon: ShieldCheck,
      color: 'text-blue-400',
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Performance',
      titleBn: 'পারফরম্যান্স',
      desc: 'স্ট্রিমিং ও দৈনন্দিন ব্রাউজিংয়ে বাফারিং কমিয়ে স্মুথ অভিজ্ঞতা উপহার দেওয়ার লক্ষ্যে তৈরি আর্কিটেকচার।',
      icon: Zap,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Support',
      titleBn: 'সরাসরি সাপোর্ট',
      desc: 'অফিসিয়াল টেলিগ্রাম ও মেসেঞ্জারের মাধ্যমে সরাসরি যেকোনো কনফিগারেশন বা টেকনিক্যাল সহায়তার নিশ্চয়তা।',
      icon: Headphones,
      color: 'text-purple-400',
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/10',
    },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-[#050811] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Service Identity & Integrity
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            About {BRAND.OFFICIAL_NAME}
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed font-medium">
            {aboutText}
          </p>
        </div>

        {/* 4 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-gradient-to-b from-[#091124] to-[#060b17] border border-slate-800 hover:border-cyan-500/30 transition-all duration-300 group hover:-translate-y-1.5 shadow-xl shadow-black/40"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${pillar.bg} ${pillar.border} border`}>
                  <Icon className={`w-6 h-6 ${pillar.color}`} />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {pillar.title}
                  </h3>
                  <span className="text-xs text-slate-400">({pillar.titleBn})</span>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed">
                  {pillar.desc}
                </p>

                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-1.5 text-xs text-slate-300">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>JOSH RAMBO Verified</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
