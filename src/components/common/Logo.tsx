import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showSubtitle = true }) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';
  const isXl = size === 'xl';

  const iconDim = isSm ? 'w-7 h-7' : isLg ? 'w-12 h-12' : isXl ? 'w-16 h-16' : 'w-9 h-9';
  const titleSize = isSm ? 'text-base' : isLg ? 'text-2xl' : isXl ? 'text-3xl' : 'text-lg';

  return (
    <div className="flex items-center gap-3 select-none">
      <div className={`relative ${iconDim} rounded-xl bg-gradient-to-br from-emerald-400/20 via-cyan-500/10 to-transparent p-1.5 border border-emerald-500/30 shadow-glow-emerald flex items-center justify-center flex-shrink-0 group`}>
        {/* Glowing Tree + Financial Growth Bar Charts in Trunk */}
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]"
        >
          {/* Tree Canopy Circles & Branches */}
          <circle cx="24" cy="14" r="8" fill="#10B981" fillOpacity="0.25" stroke="#10B981" strokeWidth="2" />
          <circle cx="17" cy="18" r="6" fill="#22D3EE" fillOpacity="0.2" stroke="#22D3EE" strokeWidth="1.8" />
          <circle cx="31" cy="18" r="6" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="1.8" />
          
          {/* Tree Canopy Leaves / Branch Network */}
          <path d="M24 10V28" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M24 17L18 13" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" />
          <path d="M24 19L30 14" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
          <path d="M24 23L16 20" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" />
          <path d="M24 24L32 21" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />

          {/* Growth Bar Chart In Trunk & Roots */}
          <rect x="17" y="34" width="3" height="8" rx="1.5" fill="#22D3EE" />
          <rect x="22.5" y="30" width="3" height="12" rx="1.5" fill="#10B981" />
          <rect x="28" y="26" width="3" height="16" rx="1.5" fill="#34D399" />

          {/* Upward Growth Arrow */}
          <path d="M15 36L24 27L33 30" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className={`font-black tracking-wider leading-tight text-white uppercase ${titleSize}`}>
          FINANCE <span className="text-emerald-400">LEGACY</span>
        </span>
        {showSubtitle && (
          <span className="text-[10px] tracking-widest text-cyan-300/80 font-medium uppercase">
            Recover What Matters
          </span>
        )}
      </div>
    </div>
  );
};

