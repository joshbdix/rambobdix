import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Check, Send, Sparkles, Shield, AlertCircle, ArrowUpDown, Filter, Gauge, Zap } from 'lucide-react';
import { PackageItem } from '../../types';

type SortOption = 'default' | 'price_asc' | 'price_desc' | 'speed_desc' | 'name_asc';
type FilterOption = 'all' | 'budget' | 'popular' | 'high_speed';

function parseSpeed(speedStr?: string): number {
  if (!speedStr) return 0;
  const match = speedStr.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

function parsePrice(priceStr?: string): number {
  if (!priceStr) return 0;
  const num = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? 0 : num;
}

export const Packages: React.FC = () => {
  const { packages, settings, loading } = useData();
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  const telegramUrl = settings.telegram_url || 'https://t.me/joshvhai';

  // Filter and sort active packages
  const filteredAndSortedPackages = useMemo(() => {
    let result = packages.filter((p) => p.status === 'active');

    // Filter
    if (filterBy === 'budget') {
      result = result.filter((p) => parsePrice(p.price) < 100);
    } else if (filterBy === 'popular') {
      result = result.filter((p) => 
        p.badge?.toLowerCase().includes('popular') || 
        p.badge?.toLowerCase().includes('recommend') ||
        p.badge?.toLowerCase().includes('turbo') ||
        p.badge?.toLowerCase().includes('flagship')
      );
    } else if (filterBy === 'high_speed') {
      result = result.filter((p) => parseSpeed(p.internet_speed) >= 50);
    }

    // Sort
    const sorted = [...result];
    switch (sortBy) {
      case 'price_asc':
        sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        break;
      case 'price_desc':
        sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        break;
      case 'speed_desc':
        sorted.sort((a, b) => parseSpeed(b.internet_speed) - parseSpeed(a.internet_speed));
        break;
      case 'name_asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'default':
      default:
        sorted.sort((a, b) => a.sort_order - b.sort_order);
        break;
    }

    return sorted;
  }, [packages, filterBy, sortBy]);

  return (
    <section id="packages" className="py-20 lg:py-28 bg-[#050914] border-t border-slate-800/80 relative transition-colors duration-300">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Customizable Connectivity Plans
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Choose Your BDIX Bypass Package
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            সকল প্যাকেজে অন্তর্ভুক্ত রয়েছে নির্ভরযোগ্য BDIX বাইপাস ও সরাসরি টেকনিক্যাল সাপোর্ট
          </p>
        </div>

        {/* Filter and Sorting Controls */}
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#081022]/90 border border-slate-800 backdrop-blur-sm">
          {/* Quick Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center sm:justify-start">
            <span className="text-xs text-slate-400 font-semibold mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <span>ফিল্টার:</span>
            </span>
            <button
              type="button"
              onClick={() => setFilterBy('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterBy === 'all'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/60'
              }`}
            >
              সকল ({packages.filter(p => p.status === 'active').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterBy('budget')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterBy === 'budget'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/60'
              }`}
            >
              বাজেট (&lt; ৳১০০)
            </button>
            <button
              type="button"
              onClick={() => setFilterBy('popular')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterBy === 'popular'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/60'
              }`}
            >
              পপুলার &amp; ফ্ল্যাগশিপ
            </button>
            <button
              type="button"
              onClick={() => setFilterBy('high_speed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterBy === 'high_speed'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/60'
              }`}
            >
              হাই স্পিড (50+ Mbps)
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <label htmlFor="package-sort-select" className="text-xs text-slate-400 font-semibold whitespace-nowrap flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
              <span>সাজান:</span>
            </label>
            <select
              id="package-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-medium focus:border-cyan-400 focus:outline-none transition-colors cursor-pointer"
            >
              <option value="default">ডিফল্ট ক্রমানুসার (Default)</option>
              <option value="price_asc">মূল্য: কম থেকে বেশি (Price: Low to High)</option>
              <option value="price_desc">মূল্য: বেশি থেকে কম (Price: High to Low)</option>
              <option value="speed_desc">ইন্টারনেট স্পিড: সর্বোচ্চ আগে (Speed: High to Low)</option>
              <option value="name_asc">নাম: A - Z (Package Name)</option>
            </select>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 rounded-3xl bg-slate-900/60 border border-slate-800 p-8" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredAndSortedPackages.length === 0 && (
          <div className="max-w-md mx-auto text-center p-8 rounded-2xl bg-slate-900/50 border border-slate-800">
            <AlertCircle className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">কোনো প্যাকেজ পাওয়া যায়নি</h3>
            <p className="text-sm text-slate-400 mb-4">
              নির্বাচিত ফিল্টারে কোনো সক্রিয় প্যাকেজ পাওয়া যায়নি। ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।
            </p>
            <button
              type="button"
              onClick={() => { setFilterBy('all'); setSortBy('default'); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm"
            >
              ফিল্টার রিসেট করুন
            </button>
          </div>
        )}

        {/* Dynamic Package Cards */}
        {!loading && filteredAndSortedPackages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
            {filteredAndSortedPackages.map((pkg) => {
              const isPopular = pkg.badge?.toLowerCase().includes('popular') || 
                                pkg.badge?.toLowerCase().includes('recommend') || 
                                pkg.badge?.toLowerCase().includes('turbo') || 
                                pkg.badge?.toLowerCase().includes('flagship') ||
                                pkg.badge?.toLowerCase().includes('pro');

              const internetSpeed = pkg.internet_speed || '30 Mbps';
              const serviceSpeed = pkg.service_speed || '3.75 Mbps';

              return (
                <div
                  key={pkg.id}
                  className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-7 transition-all duration-300 ${
                    isPopular
                      ? 'bg-gradient-to-b from-[#0a1836] via-[#071126] to-[#040915] border-2 border-cyan-500/50 shadow-2xl shadow-cyan-950/60 -translate-y-1'
                      : 'bg-gradient-to-b from-[#080f20] to-[#050a16] border border-slate-800 hover:border-slate-700 shadow-xl'
                  }`}
                >
                  {/* Badge */}
                  {pkg.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-[11px] font-bold uppercase tracking-wider shadow-md whitespace-nowrap">
                      {pkg.badge}
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="mb-4">
                      <h3 className="text-lg font-extrabold text-white tracking-wide uppercase mb-1">
                        {pkg.name}
                      </h3>
                      {pkg.description && (
                        <p className="text-xs text-slate-400 leading-relaxed min-h-[32px]">
                          {pkg.description}
                        </p>
                      )}
                    </div>

                    {/* Prominent Separate Speed Display Matrix */}
                    <div className="mb-5 p-3 rounded-2xl bg-[#060c1c]/90 border border-cyan-500/20 shadow-inner space-y-2.5">
                      {/* Internet Speed */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                        <div className="flex items-center gap-1.5">
                          <Gauge className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Internet Speed
                            </span>
                            <span className="text-[9px] text-slate-500 leading-tight">
                              YouTube, Facebook, Browsing
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm sm:text-base font-black font-mono text-cyan-300 tracking-tight">
                            {internetSpeed}
                          </span>
                        </div>
                      </div>

                      {/* BDIX / Streaming Speed */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              BDIX / Streaming Speed
                            </span>
                            <span className="text-[9px] text-slate-500 leading-tight">
                              BDIX Dedicated Bypass
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm sm:text-base font-black font-mono text-emerald-400 tracking-tight">
                            {serviceSpeed}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price Block */}
                    <div className="flex items-baseline gap-1.5 pb-4 mb-4 border-b border-slate-800">
                      <span className="text-xl font-bold text-cyan-400">৳</span>
                      <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                        {pkg.price}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        / {pkg.duration || '24 Hours'}
                      </span>
                    </div>

                    {/* Feature Checklist */}
                    <ul className="space-y-2 mb-6">
                      {Array.isArray(pkg.features) && pkg.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2 text-xs text-slate-300">
                          <div className="w-3.5 h-3.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Action */}
                  <div className="pt-2">
                    <a
                      href={`${telegramUrl}?text=${encodeURIComponent(`আমি ${pkg.name} প্যাকেজ সম্পর্কে জানতে চাই।`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs transition-all duration-300 shadow-md ${
                        isPopular
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 shadow-cyan-500/20'
                          : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>যোগাযোগ করুন</span>
                    </a>

                    <div className="mt-2 text-center text-[10px] text-slate-400 font-mono">
                      Fast Setup via Telegram
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
