import React from 'react';
import { useConsultationStore } from '../../store/consultationStore';
import { User, Volume2, WifiOff, Stethoscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const VideoPanel: React.FC = () => {
  const { callMode, isVideoOff, bandwidthStatus } = useConsultationStore();

  const showVideo = callMode === 'video' && !isVideoOff && bandwidthStatus !== 'low';

  return (
    <div className="relative w-full aspect-video bg-charcoal-dark rounded-xl border-2 border-denim overflow-hidden shadow-vintage flex items-center justify-center">
      <AnimatePresence mode="wait">
        {showVideo ? (
          <motion.div
            key="video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/80 via-black/20 to-transparent"
          >
            {/* Simulated Live Doctor Stream Frame */}
            <div className="text-center text-white/90 p-6">
              <div className="w-24 h-24 rounded-full bg-denim/80 border-4 border-cream flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Stethoscope className="w-12 h-12 text-cream" />
              </div>
              <h3 className="text-xl font-serif font-bold">Dr. Amanpreet Singh</h3>
              <p className="text-xs font-mono text-cream-light/80">Civil Hospital, Rural • MD Medicine</p>
              <div className="mt-3 inline-flex items-center space-x-2 bg-black/40 px-3 py-1 rounded-full text-xs font-mono text-green-400 border border-green-500/30">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                <span>WebRTC Live Stream (720p)</span>
              </div>
            </div>

            {/* Self PIP View (Patient) */}
            <div className="absolute bottom-4 right-4 w-28 h-20 md:w-36 md:h-24 rounded-lg bg-charcoal border-2 border-parchment-dark shadow-md flex flex-col items-center justify-center text-white/80 p-2">
              <User className="w-6 h-6 mb-1 text-cream" />
              <span className="text-[10px] font-serif font-bold">Gurpreet Singh</span>
              <span className="text-[9px] font-mono text-olive-light">(Self View)</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="audio-mode"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-cream p-6 text-center space-y-4"
          >
            {bandwidthStatus === 'low' && (
              <div className="bg-warning-amber/20 border border-warning-amber text-warning-amber px-4 py-2 rounded-lg text-xs font-serif mb-2 flex items-center space-x-2">
                <WifiOff className="w-4 h-4 animate-bounce" />
                <span>Video paused due to low bandwidth. Seamlessly switched to Audio mode.</span>
              </div>
            )}

            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-brick text-white flex items-center justify-center shadow-vintage animate-pulse">
                <Volume2 className="w-12 h-12" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full border-2 border-brick/40"
              />
            </div>

            <div>
              <h3 className="text-xl font-serif font-bold text-cream">Audio Consultation Active</h3>
              <p className="text-xs font-mono text-cream-light/70 mt-1">
                Connected with Dr. Amanpreet Singh • Clear Low-Bandwidth Audio Channel
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
