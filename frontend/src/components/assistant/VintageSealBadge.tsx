import React from 'react';

interface VintageSealBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VintageSealBadge: React.FC<VintageSealBadgeProps> = ({ size = 'md', className = '' }) => {
  const dimensionMap = {
    sm: 'w-8 h-8 text-[9px]',
    md: 'w-11 h-11 text-[10px]',
    lg: 'w-14 h-14 text-[12px]'
  };

  const iconDimensionMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-7 h-7'
  };

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${dimensionMap[size]} ${className}`}>
      {/* Outer Serrated Vintage Stamp Ring */}
      <div className="absolute inset-0 rounded-full border-2 border-dashed border-vintage-gold/80 animate-spin-slow" />
      <div className="absolute inset-1 rounded-full border border-double border-denim bg-cream-light shadow-pressed flex items-center justify-center" />
      
      {/* Medical Cross & Stethoscope Icon in Vintage Style */}
      <svg
        className={`relative z-10 ${iconDimensionMap[size]} text-brick drop-shadow-sm`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h5v5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z" />
        <circle cx="12" cy="12" r="9" className="text-olive stroke-[1.5]" />
      </svg>
    </div>
  );
};
