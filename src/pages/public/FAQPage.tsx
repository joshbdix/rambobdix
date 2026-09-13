import React from 'react';
import { FAQ } from '../../components/public/FAQ';
import { Contact } from '../../components/public/Contact';
import { BRAND } from '../../lib/constants';

export const FAQPage: React.FC = () => {
  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
          Knowledge Base
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {BRAND.OFFICIAL_NAME} সম্পর্কিত সাধারণ জিজ্ঞাসা ও সমাধান
        </p>
      </div>

      <FAQ />
      <Contact />
    </div>
  );
};
