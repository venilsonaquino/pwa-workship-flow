import React from 'react';
import { cn } from '@src/lib/utils';

// ── Variant Types ──────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isFullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// ── Variant Styles ─────────────────────────────────────────────────────────────

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary-variant hover:shadow-md',
  secondary: 'bg-surface-variant text-on-surface border border-border hover:bg-surface hover:shadow-sm',
  ghost: 'bg-transparent text-primary hover:bg-surface-variant',
  danger: 'bg-error text-white hover:brightness-110 hover:shadow-md',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'py-1 px-2 text-sm min-h-[36px]',
  md: 'py-2 px-4 text-base min-h-[44px]',
  lg: 'py-4 px-6 text-lg min-h-[52px]',
};

// ── Component ──────────────────────────────────────────────────────────────────

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isFullWidth = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className,
  ...rest
}) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-1 border-none rounded-lg font-semibold font-sans cursor-pointer transition-all duration-150 ease-in-out select-none -webkit-user-select-none touch-manipulation whitespace-nowrap active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        isFullWidth ? 'w-full' : 'w-auto',
        isLoading && 'cursor-wait pointer-events-none opacity-75',
        className
      )}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <span
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin-fast"
          aria-hidden="true"
        />
      ) : (
        <>
          {leftIcon && <span className="flex items-center">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex items-center">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
