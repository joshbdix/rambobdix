import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../../lib/constants';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full text-center">
        <div className="text-7xl font-extrabold font-mono text-cyan-400 mb-2">404</div>
        <h1 className="text-2xl font-bold text-white mb-3">পেজটি খুঁজে পাওয়া যায়নি</h1>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          আপনি যে লিংকটি অনুসন্ধান করছেন তা পরিবর্তিত হয়েছে বা উপস্থিত নেই।
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>হোমপেজে ফিরুন</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
