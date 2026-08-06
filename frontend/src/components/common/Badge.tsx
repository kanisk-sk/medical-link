import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Priority } from '../../types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  priority?: Priority;
  variant?: 'high' | 'medium' | 'low' | 'neutral' | 'success';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  priority,
  variant = 'neutral',
  className,
  ...props
}) => {
  const getPriorityStyle = () => {
    if (priority === 'HIGH') return 'bg-brick/15 text-brick border-brick/40 font-bold animate-pulse-slow';
    if (priority === 'MEDIUM') return 'bg-warning-amber/15 text-yellow-900 border-warning-amber/40 font-semibold';
    if (priority === 'LOW') return 'bg-olive/15 text-olive-dark border-olive/40';
    return '';
  };

  const variants = {
    high: 'bg-brick/15 text-brick border-brick/40 font-bold',
    medium: 'bg-warning-amber/20 text-yellow-900 border-warning-amber/40 font-semibold',
    low: 'bg-olive/15 text-olive-dark border-olive/40',
    neutral: 'bg-parchment text-charcoal border-parchment-dark',
    success: 'bg-success-green/15 text-success-green border-success-green/40 font-semibold',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border font-serif tracking-wide uppercase shadow-2xs',
          priority ? getPriorityStyle() : variants[variant],
          className
        )
      )}
      {...props}
    >
      {priority ? `● ${priority} PRIORITY` : children}
    </span>
  );
};
