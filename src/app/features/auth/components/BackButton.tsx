import React from 'react';

interface BackButtonProps {
  onClick: () => void;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick, className = 'absolute top-6 left-6 z-20' }) => {
  return (
    <div className={className}>
      <button 
        onClick={onClick}
        className="flex items-center gap-1.5 text-[#cac3d8] hover:text-[#cdbdff] transition-colors focus:outline-none group"
      >
        <span className="material-symbols-outlined text-xl transition-transform group-hover:-translate-x-0.5">
          arrow_back
        </span>
        <span className="text-xs font-semibold tracking-wider uppercase font-sans">Voltar</span>
      </button>
    </div>
  );
};

export default BackButton;
