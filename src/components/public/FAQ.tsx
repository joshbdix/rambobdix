import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ChevronDown, HelpCircle, Send } from 'lucide-react';

export const FAQ: React.FC = () => {
  const { faqs, settings, loading } = useData();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const activeFaqs = faqs
    .filter((f) => f.status === 'active')
    .sort((a, b) => a.sort_order - b.sort_order);

  const telegramUrl = settings.telegram_url || 'https://t.me/joshvhai';

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-[#060b18]/80 border-t border-slate-800/80 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Common Queries</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            BDIX Bypass এবং আমাদের সার্ভিস সম্পর্কে সাধারণত জিজ্ঞাসিত প্রশ্নের উত্তর
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-16 rounded-2xl bg-slate-900/60 border border-slate-800" />
            ))}
          </div>
        )}

        {/* FAQ Accordion List */}
        {!loading && activeFaqs.length > 0 && (
          <div className="space-y-4">
            {activeFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-[#0a1428] border-cyan-500/40 shadow-xl shadow-cyan-950/30'
                      : 'bg-[#080e1e]/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(idx)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base sm:text-lg font-bold text-white pr-4">
                      {faq.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? 'bg-cyan-500 text-slate-950 rotate-180'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-800/60 pt-4 animate-in fade-in duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Support Callout */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 to-cyan-950/30 border border-cyan-500/20 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-white mb-1">
              আরো কিছু জানার আছে?
            </h4>
            <p className="text-xs text-slate-300">
              আমাদের সাপোর্ট টিম সরাসরি টেলিগ্রামে আপনাকে সহায়তা করতে প্রস্তুত।
            </p>
          </div>
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shrink-0 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>সরাসরি মেসেজ দিন</span>
          </a>
        </div>
      </div>
    </section>
  );
};
