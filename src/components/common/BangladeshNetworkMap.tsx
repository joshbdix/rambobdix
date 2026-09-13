import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Server, Zap, Shield, Activity } from 'lucide-react';

export const BangladeshNetworkMap: React.FC = () => {
  const { effectiveTheme } = useTheme();
  const animateNetwork = effectiveTheme.network_animation;

  return (
    <div 
      className="relative w-full max-w-lg mx-auto p-6 shadow-2xl overflow-hidden group transition-all duration-300"
      style={{
        backgroundColor: 'var(--color-card)',
        borderColor: 'var(--color-card-border)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: 'var(--radius-card)',
      }}
    >
      {/* Ambient background glow if enabled */}
      {effectiveTheme.glow_effects && (
        <>
          <div 
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
            style={{ backgroundColor: 'var(--color-accent)' }}
          />
          <div 
            className="absolute bottom-10 right-10 w-48 h-48 rounded-full blur-2xl pointer-events-none opacity-15"
            style={{ backgroundColor: 'var(--color-accent-cyan, #00e5ff)' }}
          />
        </>
      )}

      {/* Header status bar */}
      <div 
        className="flex items-center justify-between pb-4 border-b mb-5 relative z-10"
        style={{ borderColor: 'var(--color-card-border)' }}
      >
        <div className="flex items-center gap-2.5">
          <div className={`w-2.5 h-2.5 rounded-full bg-emerald-400 ${animateNetwork ? 'animate-pulse' : ''} shadow-[0_0_8px_#10B981]`} />
          <span className="text-xs font-mono tracking-wider uppercase text-emerald-400 font-semibold">
            BDIX Bypass Active
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono opacity-80" style={{ color: 'var(--color-text-muted)' }}>
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" />
            0% Packet Loss
          </span>
          <span className="opacity-40">|</span>
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-blue-400" />
            Optimized
          </span>
        </div>
      </div>

      {/* SVG Map and Network Mesh */}
      <div className="relative w-full h-[360px] flex items-center justify-center">
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full drop-shadow-md select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="fiberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0066FF" stopOpacity="0.3" />
            </linearGradient>
            <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="1" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
            </radialGradient>
            <filter id="glowFilter">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Bangladesh stylized polygon outline */}
          <path
            d="M200 45 L 245 40 L 290 85 L 345 105 L 375 140 L 395 185 L 360 215 L 385 240 L 415 295 L 400 370 L 365 425 L 340 405 L 305 440 L 265 435 L 235 450 L 195 445 L 180 400 L 145 375 L 160 305 L 125 260 L 140 185 L 185 140 L 170 85 Z"
            fill="rgba(8, 24, 48, 0.3)"
            stroke="rgba(0, 229, 255, 0.3)"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />

          {/* Connected Network Links / Fiber Backbone */}
          <line x1="255" y1="235" x2="360" y2="345" stroke="url(#fiberGrad)" strokeWidth="2.5" />
          <line x1="255" y1="235" x2="345" y2="145" stroke="url(#fiberGrad)" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="255" y1="235" x2="175" y2="205" stroke="url(#fiberGrad)" strokeWidth="2" />
          <line x1="255" y1="235" x2="205" y2="340" stroke="url(#fiberGrad)" strokeWidth="2" strokeDasharray="4 2" />
          <line x1="255" y1="235" x2="260" y2="360" stroke="url(#fiberGrad)" strokeWidth="1.5" />
          <line x1="255" y1="235" x2="190" y2="95" stroke="url(#fiberGrad)" strokeWidth="2" />
          <line x1="255" y1="235" x2="265" y2="160" stroke="url(#fiberGrad)" strokeWidth="1.5" strokeDasharray="2 2" />

          {/* Pulsing Data Flow Particles along paths (if animation enabled) */}
          {animateNetwork && (
            <>
              <circle cx="255" cy="235" r="3" fill="#00FF88">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="310" cy="290" r="2.5" fill="#00E5FF" filter="url(#glowFilter)">
                <animate attributeName="cx" values="255;360" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="cy" values="235;345" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <circle cx="215" cy="220" r="2" fill="#00E5FF">
                <animate attributeName="cx" values="255;175" dur="2.8s" repeatCount="indefinite" />
                <animate attributeName="cy" values="235;205" dur="2.8s" repeatCount="indefinite" />
              </circle>
            </>
          )}

          {/* Regional Nodes */}
          <g transform="translate(190, 95)">
            <circle r="4" fill="#0066FF" />
            <circle r="8" fill="none" stroke="rgba(0, 102, 255, 0.4)" strokeWidth="1" />
            <text x="10" y="3" fill="#94a3b8" fontSize="10" fontFamily="monospace">Rangpur</text>
          </g>

          <g transform="translate(265, 160)">
            <circle r="3.5" fill="#0066FF" />
            <text x="8" y="3" fill="#94a3b8" fontSize="9" fontFamily="monospace">Mymensingh</text>
          </g>

          <g transform="translate(345, 145)">
            <circle r="4" fill="#0066FF" />
            <circle r="9" fill="none" stroke="rgba(0, 229, 255, 0.4)" strokeWidth="1" />
            <text x="12" y="4" fill="#94a3b8" fontSize="10" fontFamily="monospace">Sylhet</text>
          </g>

          <g transform="translate(175, 205)">
            <circle r="4" fill="#0066FF" />
            <circle r="9" fill="none" stroke="rgba(0, 229, 255, 0.4)" strokeWidth="1" />
            <text x="-58" y="4" fill="#94a3b8" fontSize="10" fontFamily="monospace">Rajshahi</text>
          </g>

          <g transform="translate(205, 340)">
            <circle r="4" fill="#0066FF" />
            <circle r="9" fill="none" stroke="rgba(0, 102, 255, 0.4)" strokeWidth="1" />
            <text x="-48" y="4" fill="#94a3b8" fontSize="10" fontFamily="monospace">Khulna</text>
          </g>

          <g transform="translate(260, 360)">
            <circle r="3.5" fill="#0066FF" />
            <text x="8" y="4" fill="#94a3b8" fontSize="9" fontFamily="monospace">Barishal</text>
          </g>

          {/* Chattogram Gateway Node */}
          <g transform="translate(360, 345)">
            <circle r="6" fill="#00E5FF" filter="url(#glowFilter)" />
            <circle r="14" fill="none" stroke="#00E5FF" strokeWidth="1" strokeDasharray="2 2">
              {animateNetwork && (
                <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="10s" repeatCount="indefinite" />
              )}
            </circle>
            <text x="16" y="4" fill="#38bdf8" fontSize="11" fontWeight="600" fontFamily="monospace">Chattogram</text>
          </g>

          {/* DHAKA CENTRAL HUB */}
          <g transform="translate(255, 235)">
            {animateNetwork && (
              <circle r="26" fill="url(#hubGlow)" opacity="0.4">
                <animate attributeName="r" values="20;32;20" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite" />
              </circle>
            )}
            <circle r="10" fill="#0066FF" stroke="#00E5FF" strokeWidth="2.5" filter="url(#glowFilter)" />
            <circle r="4" fill="#00FF88" />
            <text x="15" y="-12" fill="#00E5FF" fontSize="12" fontWeight="700" fontFamily="monospace">
              DHAKA (BDIX CORE)
            </text>
            <text x="15" y="2" fill="#94a3b8" fontSize="9" fontFamily="monospace">
              JOSH RAMBO Gateway
            </text>
          </g>
        </svg>

        {/* Floating Mini Overlay Badges */}
        <div 
          className="absolute top-4 right-4 rounded-xl px-3 py-2 shadow-lg backdrop-blur-md border"
          style={{
            backgroundColor: 'var(--color-card-muted)',
            borderColor: 'var(--color-card-border)',
            borderRadius: 'var(--radius-base)',
          }}
        >
          <div className="text-[10px] opacity-70" style={{ color: 'var(--color-text-muted)' }}>BDIX ROUTING</div>
          <div className="text-xs font-semibold text-cyan-400 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Low Latency Path
          </div>
        </div>

        <div 
          className="absolute bottom-4 left-4 rounded-xl px-3 py-2 shadow-lg backdrop-blur-md border"
          style={{
            backgroundColor: 'var(--color-card-muted)',
            borderColor: 'var(--color-card-border)',
            borderRadius: 'var(--radius-base)',
          }}
        >
          <div className="text-[10px] opacity-70" style={{ color: 'var(--color-text-muted)' }}>SERVICE RECORD</div>
          <div className="text-xs font-semibold text-emerald-400 font-mono flex items-center gap-1">
            <Shield className="w-3 h-3 text-emerald-400" />
            3+ Years Experience
          </div>
        </div>
      </div>

      {/* Footer server telemetry cards */}
      <div 
        className="grid grid-cols-3 gap-2 pt-4 border-t mt-2 text-center"
        style={{ borderColor: 'var(--color-card-border)' }}
      >
        <div 
          className="rounded-xl p-2 border"
          style={{
            backgroundColor: 'var(--color-card-muted)',
            borderColor: 'var(--color-card-border)',
            borderRadius: 'var(--radius-base)',
          }}
        >
          <div className="text-[11px] opacity-70" style={{ color: 'var(--color-text-muted)' }}>Infrastructure</div>
          <div className="text-xs font-bold flex items-center justify-center gap-1 mt-0.5" style={{ color: 'var(--color-text)' }}>
            <Server className="w-3 h-3 text-cyan-400" />
            Dedicated
          </div>
        </div>

        <div 
          className="rounded-xl p-2 border"
          style={{
            backgroundColor: 'var(--color-card-muted)',
            borderColor: 'var(--color-card-border)',
            borderRadius: 'var(--radius-base)',
          }}
        >
          <div className="text-[11px] opacity-70" style={{ color: 'var(--color-text-muted)' }}>Connectivity</div>
          <div className="text-xs font-bold text-emerald-400 mt-0.5">
            Bufferless Focus
          </div>
        </div>

        <div 
          className="rounded-xl p-2 border"
          style={{
            backgroundColor: 'var(--color-card-muted)',
            borderColor: 'var(--color-card-border)',
            borderRadius: 'var(--radius-base)',
          }}
        >
          <div className="text-[11px] opacity-70" style={{ color: 'var(--color-text-muted)' }}>Target</div>
          <div className="text-xs font-bold text-cyan-400 mt-0.5">
            Bangladesh
          </div>
        </div>
      </div>
    </div>
  );
};
