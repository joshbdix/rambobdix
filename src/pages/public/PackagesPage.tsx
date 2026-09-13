import React from 'react';
import { Packages } from '../../components/public/Packages';
import { FAQ } from '../../components/public/FAQ';
import { Contact } from '../../components/public/Contact';
import { BRAND } from '../../lib/constants';

export const PackagesPage: React.FC = () => {
  return (
    <div className="py-10">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
          Flexible & Transparent
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          BDIX Bypass Packages
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          আপনার পছন্দ অনুযায়ী সেরা প্যাকেজ সিলেক্ট করুন এবং সরাসরি টেলিগ্রামে দ্রুত সার্ভিস সক্রিয় করুন।
        </p>
      </div>

      <Packages />
      <FAQ />
      <Contact />
    </div>
  );
};
