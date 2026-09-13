import React from 'react';
import { Contact } from '../../components/public/Contact';
import { Stats } from '../../components/public/Stats';
import { BRAND } from '../../lib/constants';

export const ContactPage: React.FC = () => {
  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
          Direct Channels
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Contact {BRAND.SHORT_NAME}
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {BRAND.OFFICIAL_NAME} সম্পর্কে যেকোনো প্রশ্ন বা সেবার জন্য সরাসরি আমাদের অফিসিয়াল মাধ্যমে যোগাযোগ করুন।
        </p>
      </div>

      <Contact />
      <Stats />
    </div>
  );
};
