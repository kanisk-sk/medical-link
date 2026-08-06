import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'paper' | 'ornate' | 'pressed';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hoverEffect = true,
  className,
  ...props
}) => {
  const baseStyles = 'rounded-xl border transition-all duration-200 overflow-hidden';
  
  const variants = {
    default: 'bg-cream-light border-parchment-dark shadow-vintage text-charcoal',
    paper: 'vintage-paper-texture border-parchment-dark shadow-vintage text-charcoal',
    ornate: 'bg-cream-light border-2 border-denim shadow-vintage-lg relative before:absolute before:inset-1 before:border before:border-olive/40 before:pointer-events-none p-2',
    pressed: 'bg-parchment/70 border-parchment-dark shadow-pressed text-charcoal',
  };

  return (
    <div
      className={twMerge(
        clsx(
          baseStyles,
          variants[variant],
          hoverEffect && 'hover:-translate-y-0.5 hover:shadow-vintage-lg',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
