import React from 'react';
import { motion } from 'framer-motion';
import { HeartPulse } from 'lucide-react';
import { StethoscopeLogo } from '../common/StethoscopeLogo';

export const AuthLoading: React.FC<{ message?: string }> = ({
  message = 'Checking your secure session...',
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="max-w-sm w-full text-center space-y-5">
        <StethoscopeLogo size={72} animate={true} />
        <div className="space-y-2">
          <p className="text-lg font-serif font-bold text-denim">SehatLink</p>
          <p className="text-sm font-serif text-charcoal-light">{message}</p>
        </div>
        <div className="flex items-center justify-center gap-2 text-brick">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <HeartPulse className="w-6 h-6" />
          </motion.div>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-brick/60 to-transparent" />
        </div>
      </div>
    </div>
  );
};