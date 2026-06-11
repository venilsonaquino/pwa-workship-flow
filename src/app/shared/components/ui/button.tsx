import React from 'react';
import { cn } from '@src/lib/utils';

// ── Variant Types ──────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isFullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconOnly?: boolean;
}

// ── Variant Styles ─────────────────────────────────────────────────────────────

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'vivid-gradient text-white soft-shadow hover:opacity-90',
  secondary: 'bg-primary-container/10 text-primary hover:bg-primary-container/20',
  outline: 'border-[1.5px] border-outline-variant text-on-surface bg-transparent hover:bg-surface-variant/20',
  ghost: 'bg-transparent text-primary hover:bg-primary/5',
  danger: 'bg-error text-white hover:brightness-110 hover:shadow-md',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'py-2 px-5 text-label-sm min-h-[36px]',
  md: 'py-3 px-8 text-label-lg min-h-[44px]',
  lg: 'py-4 px-10 text-label-lg min-h-[52px]',
};

const iconSizeClasses: Record<ButtonSize, string> = {
  sm: 'p-2 w-[36px] h-[36px] text-label-sm',
  md: 'p-3 w-[44px] h-[44px] text-label-lg',
  lg: 'p-4 w-[52px] h-[52px] text-label-lg',
};

// ── Component ──────────────────────────────────────────────────────────────────

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isFullWidth = false,
  leftIcon,
  rightIcon,
  iconOnly = false,
  children,
  disabled,
  className,
  ...rest
}) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 border-none rounded-full font-semibold font-sans cursor-pointer transition-all duration-150 ease-in-out select-none -webkit-user-select-none touch-manipulation whitespace-nowrap active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        iconOnly ? iconSizeClasses[size] : sizeClasses[size],
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
          {!iconOnly && children}
          {iconOnly && children}
          {rightIcon && <span className="flex items-center">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;

