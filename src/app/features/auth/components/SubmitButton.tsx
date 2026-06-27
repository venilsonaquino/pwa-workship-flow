import React from 'react';

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <div className="w-full">
      <button 
        className={`w-full bg-gradient-to-r from-primary-container to-inverse-primary text-white font-semibold text-sm py-4 px-6 rounded-full shadow-[0_4px_14px_0_rgba(124,77,255,0.39)] hover:shadow-[0_6px_20px_rgba(124,77,255,0.5)] hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98] active:translate-y-0 flex items-center justify-center gap-2 group ${className}`}
        {...props}
      >
        {children}
      </button>
    </div>
  );
};

export default SubmitButton;
