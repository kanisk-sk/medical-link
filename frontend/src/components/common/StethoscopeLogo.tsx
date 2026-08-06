import React from 'react';
import { motion } from 'framer-motion';

interface StethoscopeLogoProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

export const StethoscopeLogo: React.FC<StethoscopeLogoProps> = ({
  className = '',
  size = 48,
  animate = true
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-brick drop-shadow-md"
      >
        {/* Earpieces */}
        <circle cx="30" cy="20" r="4" fill="#324A66" />
        <circle cx="70" cy="20" r="4" fill="#324A66" />
        
        {/* Metal Tubing */}
        <path
          d="M 30 24 V 38 C 30 50 40 58 50 58 C 60 58 70 50 70 38 V 24"
          stroke="#324A66"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Flexible Rubber Hose */}
        <path
          d="M 50 58 V 72 C 50 82 65 82 65 74"
          stroke="#A14C41"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Chestpiece / Diaphragm */}
        <motion.circle
          cx="65"
          cy="74"
          r="10"
          fill="#707B67"
          stroke="#324A66"
          strokeWidth="3"
          animate={
            animate
              ? {
                  scale: [1, 1.15, 1, 1.25, 1],
                }
              : {}
          }
          transition={{
            duration: 2.2,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
        />

        {/* Inner Heartpulse Ring */}
        <motion.circle
          cx="65"
          cy="74"
          r="4"
          fill="#F5EBD8"
          animate={
            animate
              ? {
                  opacity: [0.4, 1, 0.4],
                }
              : {}
          }
          transition={{
            duration: 1.1,
            repeat: Infinity,
          }}
        />
      </svg>
    </div>
  );
};
