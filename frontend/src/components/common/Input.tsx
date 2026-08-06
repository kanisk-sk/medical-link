import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-charcoal mb-1 font-serif">
            {label}
          </label>
        )}
        <div className="relative rounded-md shadow-sm">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal-light">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={twMerge(
              clsx(
                'block w-full rounded-lg bg-warm-white border border-parchment-dark px-3 py-2.5 text-charcoal text-base placeholder-charcoal-light/60 transition-colors duration-150 focus:border-denim focus:outline-none focus:ring-2 focus:ring-denim/20 disabled:bg-parchment/40 disabled:cursor-not-allowed min-h-[44px]',
                leftIcon && 'pl-10',
                rightIcon && 'pr-10',
                error && 'border-brick text-brick focus:border-brick focus:ring-brick/20',
                className
              )
            )}
            aria-invalid={!!error}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-charcoal-light">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-brick font-medium">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-charcoal-light">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
