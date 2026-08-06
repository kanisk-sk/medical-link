import React from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, WifiOff, Volume2 } from 'lucide-react';
import { useConsultationStore, CallMode } from '../../store/consultationStore';
import { Button } from '../common/Button';

interface CallControlsProps {
  onEndCall: () => void;
}

export const CallControls: React.FC<CallControlsProps> = ({ onEndCall }) => {
  const {
    callMode,
    isMuted,
    isVideoOff,
    bandwidthStatus,
    toggleMute,
    toggleVideo,
    setCallMode,
  } = useConsultationStore();

  return (
    <div className="bg-denim text-white p-4 rounded-xl border-2 border-denim-dark shadow-vintage flex flex-wrap items-center justify-between gap-3">
      {/* Mode Status Pill */}
      <div className="flex items-center space-x-2">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-cream/20 text-cream">
          MODE: {callMode.toUpperCase()}
        </span>
        {bandwidthStatus === 'low' && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-warning-amber text-yellow-950 font-bold animate-pulse">
            <WifiOff className="w-3 h-3 mr-1" /> Low Bandwidth
          </span>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center space-x-3 mx-auto sm:mx-0">
        <button
          onClick={toggleMute}
          className={`p-3 rounded-full transition-colors ${
            isMuted ? 'bg-brick text-white' : 'bg-white/20 hover:bg-white/30 text-white'
          }`}
          title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {callMode === 'video' && (
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full transition-colors ${
              isVideoOff ? 'bg-brick text-white' : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
            title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>
        )}

        <button
          onClick={() => setCallMode(callMode === 'video' ? 'audio' : 'video')}
          className="text-xs px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 font-serif"
        >
          Switch to {callMode === 'video' ? 'Audio' : 'Video'}
        </button>

        <button
          onClick={onEndCall}
          className="p-3 rounded-full bg-emergency-red hover:bg-red-800 text-white transition-colors"
          title="End Consultation Call"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
