import React, { useState } from 'react';

interface InputGroupProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'placeholder'> {
  id: string;
  label: string;
  placeholder?: string;
  icon?: string;
  isPassword?: boolean;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  id,
  label,
  placeholder,
  icon,
  isPassword = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-1.5 group w-full">
      <label 
        className="text-[12px] font-semibold tracking-wide text-[#cac3d8] group-focus-within:text-[#cdbdff] transition-colors uppercase" 
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#cac3d8]/50 group-focus-within:text-[#cdbdff] transition-colors text-xl font-normal">
            {icon}
          </span>
        )}
        <input 
          id={id}
          placeholder={placeholder}
          type={isPassword ? (showPassword ? 'text' : 'password') : props.type}
          className={`w-full bg-[#131313]/50 border border-white/10 rounded-lg py-3 pr-4 text-base text-[#e5e2e1] placeholder:text-[#cac3d8]/30 focus:outline-none focus:border-[#cdbdff] focus:ring-1 focus:ring-[#cdbdff] focus:bg-[#0e0e0e] transition-all ${
            icon ? 'pl-12' : 'pl-4'
          } ${isPassword ? 'pr-12' : ''} ${className}`}
          {...props}
        />
        {isPassword && (
          <button 
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#cac3d8]/50 hover:text-[#e5e2e1] transition-colors focus:outline-none" 
          >
            <span className="material-symbols-outlined text-xl font-normal">
              {showPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default InputGroup;
