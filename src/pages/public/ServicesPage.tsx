import React from 'react';
import { Services } from '../../components/public/Services';
import { FeatureSection } from '../../components/public/FeatureSection';
import { Contact } from '../../components/public/Contact';
import { BRAND } from '../../lib/constants';

export const ServicesPage: React.FC = () => {
  return (
    <div className="py-10">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
          Networking Solutions
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Our Networking Services
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {BRAND.OFFICIAL_NAME} প্রদান করে অপ্টিমাইজড BDIX কানেক্টিভিটি ও স্ট্রিমিং সাপোর্ট।
        </p>
      </div>

      <Services />
      <FeatureSection />
      <Contact />
    </div>
  );
};
