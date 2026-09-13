import React from 'react';
import { useData } from '../../context/DataContext';
import { 
  CheckCircle2, 
  Send, 
  ShieldCheck, 
  Activity, 
  Radio, 
  Layers 
} from 'lucide-react';

export const FeatureSection: React.FC = () => {
  const { settings } = useData();
  const telegramUrl = settings.telegram_url || 'https://t.me/joshvhai';

  const featurePoints = [
    {
      title: 'Stable Connection',
      titleBn: 'ধারাবাহিক ও স্থায়ী সংযোগ',
      desc: 'সারাদিন স্মুথ এবং নিরবচ্ছিন্ন অনলাইন অ্যাক্টিভিটির জন্য অপ্টিমাইজড নেটওয়ার্ক পাথওয়ে।',
    },
    {
      title: 'Better Streaming Experience',
      titleBn: 'উন্নত স্ট্রিমিং অভিজ্ঞতা',
      desc: 'হাই-ডেফিনিশন ভিডিও ও অনলাইন মিডিয়া স্ট্রিমিংয়ে লোডিং টাইম ও ল্যাগ যথাসম্ভব কমায়।',
    },
    {
      title: 'Reduced Buffering',
      titleBn: 'বাফারিং হ্রাসকরণ',
      desc: 'ক্যাশড রাউটিং ও লোকাল ব্যান্ডউইথ প্রোটোকলের মাধ্যমে বাফারিং সমস্যা দূরীকরণে কার্যকর।',
    },
    {
      title: 'Optimized Routing',
      titleBn: 'স্মার্ট ও অপ্টিমাইজড রাউটিং',
      desc: 'ইন্টারনেট ট্রাফিককে সবচেয়ে নিকটবর্তী ও দ্রুততম নোডের মধ্য দিয়ে পরিচালনা করা হয়।',
    },
    {
      title: 'Reliable Performance',
      titleBn: 'নির্ভরযোগ্য পারফরম্যান্স',
      desc: 'পিক আওয়ারেও নেটওয়ার্কের ধারাবাহিক স্পিড ও স্টেবল রেসপন্স টাইম বজায় থাকে।',
    },
    {
      title: 'Dedicated Support',
      titleBn: 'ডেডিকেটেড টেকনিক্যাল সাপোর্ট',
      desc: 'যেকোনো কনফিগারেশন সংক্রান্ত সাহায্য বা অনুসন্ধানে টেলিগ্রামে দ্রুত সাপোর্ট পাওয়া যায়।',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#050811] relative overflow-hidden">
      {/* Visual lighting lines */}
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & Context */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Radio className="w-3.5 h-3.5" />
              <span>Next-Gen BDIX Architecture</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Experience Better Connectivity
            </h2>

            <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed">
              JOSH RAMBO BDIX Bypass™ টেকনোলজি আপনার ইন্টারনেট কানেকশনকে লোকাল BDIX এবং অপ্টিমাইজড রুটের সাথে সিঙ্ক করে একটি স্টেবল ও কম বাফারিংযুক্ত ডিজিটাল অভিজ্ঞতা উপহার দেয়।
            </p>

            <div className="p-5 rounded-2xl bg-[#091224] border border-slate-800 mb-8 w-full">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">৩+ বছরের প্রমাণিত সেবা</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                কোনো ভুয়া বা অবাস্তব প্রতিশ্রুতি নয়; প্রকৃত অপ্টিমাইজেশন ও নির্ভরযোগ্য নেটওয়ার্কিং নিয়ে আমরা গ্রাহকদের সাথে আছি।
              </p>
            </div>

            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-950/50 transition-all active:scale-[0.98]"
            >
              <Send className="w-4 h-4" />
              <span>সার্ভিস সম্পর্কিত তথ্য জানুন</span>
            </a>
          </div>

          {/* Right Column: 6 Feature Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featurePoints.map((feat, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#091122]/90 to-[#060b17]/90 border border-slate-800 hover:border-cyan-500/30 transition-all duration-300 hover:translate-x-1"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-wide">
                      {feat.title}
                    </h3>
                    <div className="text-xs text-cyan-400/90 font-medium mb-1.5">
                      {feat.titleBn}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
