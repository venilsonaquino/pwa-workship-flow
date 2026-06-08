import React, { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@src/lib/utils';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
  isFullWidth?: boolean;
}

// ── Component ──────────────────────────────────────────────────────────────────

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      leftAdornment,
      rightAdornment,
      isFullWidth = true,
      id,
      className,
      ...rest
    },
    ref,
  ) => {
    const inputId = id ?? `input-${Math.random().toString(36).slice(2, 9)}`;
    const hasError = Boolean(errorMessage);

    return (
      <div className={cn('flex flex-col gap-1', isFullWidth ? 'w-full' : 'w-auto', className)}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-on-surface text-left">
            {label}
          </label>
        )}
        <div
          className={cn(
            'flex items-center bg-surface border border-[1.5px] rounded-lg px-2 min-h-[48px] transition-all duration-150 ease-in-out focus-within:ring-3',
            hasError
              ? 'border-error focus-within:border-error focus-within:ring-error/20'
              : 'border-border focus-within:border-primary focus-within:ring-primary/20',
          )}
        >
          {leftAdornment && (
            <span className="flex items-center text-placeholder shrink-0 mr-1">
              {leftAdornment}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={hasError}
            className="flex-1 bg-transparent text-on-surface text-base h-full border-none outline-none py-2 placeholder:text-placeholder disabled:opacity-50 disabled:cursor-not-allowed"
            {...rest}
          />
          {rightAdornment && (
            <span className="flex items-center text-placeholder shrink-0 ml-1">
              {rightAdornment}
            </span>
          )}
        </div>
        {(errorMessage || helperText) && (
          <span className={cn('text-xs text-left', hasError ? 'text-error' : 'text-placeholder')}>
            {errorMessage || helperText}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
