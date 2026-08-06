import React from 'react';
import { StethoscopeLogo } from './StethoscopeLogo';

export const LoadingSpinner: React.FC<{ label?: string }> = ({ label = 'Loading SehatLink...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <StethoscopeLogo size={64} animate={true} />
      <p className="text-sm font-serif text-charcoal-light font-medium animate-pulse">{label}</p>
    </div>
  );
};
