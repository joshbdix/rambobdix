import React from 'react';
import { useData } from '../../context/DataContext';
import { 
  Network, 
  PlayCircle, 
  Cpu, 
  ShieldCheck, 
  Headphones, 
  Settings2, 
  Zap, 
  Server,
  ArrowUpRight
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Network,
  PlayCircle,
  Cpu,
  ShieldCheck,
  Headphones,
  Settings2,
  Zap,
  Server,
};

export const Services: React.FC = () => {
  const { services, settings } = useData();

  const activeServices = services.filter((s) => s.status === 'active');
  const telegramUrl = settings.telegram_url || 'https://t.me/joshvhai';

  return (
    <section id="services" className="py-20 lg:py-28 bg-[#060b18]/70 border-y border-slate-800/70 relative">
      {/* Background network grid accent */}
      <div className="absolute inset-0 bg-dots-pattern opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Core Networking Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Professional Networking Services
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            JOSH RAMBO BDIX Bypass™ এর বিশেষায়িত ফিচার ও অপ্টিমাইজড সার্ভিসসমূহ
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeServices.map((service, idx) => {
            const IconComponent = iconMap[service.icon] || Network;

            return (
              <div
                key={service.id || idx}
                className="relative p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#0a1428]/90 to-[#070d1c]/90 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 transition-colors">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-mono">BDIX Optimized</span>
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>যোগাযোগ</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
