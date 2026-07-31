import React from 'react';

export const MaintenanceHeroGraphic: React.FC = () => {
  return (
    <div className="relative w-full flex justify-center my-6">
      <div className="relative p-8 bg-surface-container/80 dark:bg-surface-container-high/30 backdrop-blur-2xl rounded-3xl shadow-2xl border border-border/40 max-w-xs sm:max-w-sm w-full flex justify-center items-center group">
        <svg
          className="w-36 h-36 sm:w-44 sm:h-44 text-primary drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="40" y="25" width="120" height="150" rx="16" className="fill-surface-container-high stroke-border" strokeWidth="3" />
          <rect x="48" y="33" width="104" height="134" rx="10" className="fill-surface-container-lowest" />
          
          <rect x="56" y="45" width="88" height="28" rx="6" className="fill-surface-container stroke-outline-variant/40" strokeWidth="1.5" />
          <circle cx="70" cy="59" r="4" className="fill-primary animate-pulse" />
          <circle cx="82" cy="59" r="4" className="fill-secondary" />
          <line x1="98" y1="55" x2="132" y2="55" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          
          <rect x="56" y="85" width="88" height="28" rx="6" className="fill-surface-container stroke-outline-variant/40" strokeWidth="1.5" />
          <circle cx="70" cy="99" r="4" className="fill-emerald-500" />
          <circle cx="82" cy="99" r="4" className="fill-primary animate-pulse" />
          <line x1="98" y1="95" x2="132" y2="95" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.6" />

          <rect x="56" y="125" width="88" height="28" rx="6" className="fill-surface-container stroke-outline-variant/40" strokeWidth="1.5" />
          <circle cx="70" cy="139" r="4" className="fill-amber-500 animate-pulse" />
          <circle cx="82" cy="139" r="4" className="fill-primary" />
          <line x1="98" y1="135" x2="132" y2="135" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        </svg>

        <div className="absolute -top-3 -right-3 bg-secondary text-on-secondary p-3.5 rounded-2xl shadow-xl transform rotate-12 flex items-center justify-center transition-transform group-hover:rotate-45">
          <span className="material-symbols-outlined text-2xl leading-none">construction</span>
        </div>

        <div className="absolute -bottom-3 -left-3 bg-primary text-on-primary p-3.5 rounded-2xl shadow-xl transform -rotate-12 flex items-center justify-center transition-transform group-hover:-rotate-45">
          <span className="material-symbols-outlined text-2xl leading-none">music_note</span>
        </div>
      </div>
    </div>
  );
};
