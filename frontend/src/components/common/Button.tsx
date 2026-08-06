import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'emergency' | 'ghost' | 'olive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-sm border';

  const variants = {
    primary: 'bg-brick hover:bg-brick-dark text-white border-brick-dark focus:ring-brick focus:ring-offset-cream',
    secondary: 'bg-denim hover:bg-denim-dark text-white border-denim-dark focus:ring-denim focus:ring-offset-cream',
    olive: 'bg-olive hover:bg-olive-dark text-white border-olive-dark focus:ring-olive focus:ring-offset-cream',
    outline: 'bg-transparent border-denim text-denim hover:bg-denim/10 focus:ring-denim',
    emergency: 'bg-emergency-red hover:bg-red-800 text-white font-bold tracking-wider uppercase border-red-900 focus:ring-emergency-red animate-pulse-slow',
    ghost: 'bg-transparent border-transparent text-charcoal hover:bg-parchment/60 focus:ring-charcoal',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 min-h-[36px] min-w-[36px]',
    md: 'text-sm px-4 py-2.5 min-h-[44px]',
    lg: 'text-base px-6 py-3.5 min-h-[52px]',
    xl: 'text-lg px-8 py-4 min-h-[60px] text-lg font-semibold',
  };

  return (
    <button
      className={twMerge(
        clsx(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )
      )}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="mr-2 text-current">{icon}</span>}
      {children}
    </button>
  );
};
