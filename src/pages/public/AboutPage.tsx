import React from 'react';
import { About } from '../../components/public/About';
import { Stats } from '../../components/public/Stats';
import { Contact } from '../../components/public/Contact';
import { BRAND } from '../../lib/constants';
import { ShieldCheck, Network, Award, Zap } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-10">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
          Brand & Service Heritage
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          About {BRAND.OFFICIAL_NAME}
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {BRAND.PRIMARY_STATEMENT} Faster Bangladesh Together.
        </p>
      </div>

      <Stats />
      <About />

      {/* Network Philosophy */}
      <section className="py-16 bg-[#060c1c]/50 border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#09142e] to-[#060c1a] border border-cyan-500/20 shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              আমাদের লক্ষ্য ও দৃষ্টিভঙ্গি
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
              আমরা কোনো অবাস্তব গ্যারান্টি বা অতিরিক্ত প্রতিশ্রুতি দেই না। দীর্ঘ ৩ বছরের বেশি সময় ধরে আমাদের একমাত্র লক্ষ্য ছিল বাংলাদেশের ইন্টারনেট ব্যবহারকারীদের BDIX ট্রাফিকের সর্বোত্তম ব্যবহার নিশ্চিত করা এবং স্ট্রিমিং চলাকালীন অনাকাঙ্ক্ষিত বাফারিং হ্রাস করা।
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>প্রকৃত ও নির্ভরযোগ্য অপ্টিমাইজেশন</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Network className="w-5 h-5 text-cyan-400 shrink-0" />
                <span>স্মার্ট পাথওয়ে রাউটিং ও ক্যাশিং সাপোর্ট</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-blue-400 shrink-0" />
                <span>৩+ বছরের ধারাবাহিক সেবা</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Zap className="w-5 h-5 text-purple-400 shrink-0" />
                <span>সহজ ও দ্রুত কনফিগারেশন সাপোর্ট</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Contact />
    </div>
  );
};
