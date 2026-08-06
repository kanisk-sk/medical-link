import React from 'react';
import { VideoPanel } from '../components/consultation/VideoPanel';
import { ChatPanel } from '../components/consultation/ChatPanel';
import { CallControls } from '../components/consultation/CallControls';
import { useConsultationStore } from '../store/consultationStore';
import { usePatientStore } from '../store/patientStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Wifi, WifiOff, FileText } from 'lucide-react';

export const ConsultationPage: React.FC = () => {
  const navigate = useNavigate();
  const { endCall, bandwidthStatus, setBandwidthStatus } = useConsultationStore();
  const { currentRecord } = usePatientStore();

  const handleEndConsult = () => {
    endCall();
    navigate('/prescription-view');
  };

  const toggleBandwidth = () => {
    setBandwidthStatus(bandwidthStatus === 'good' ? 'low' : 'good');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner with Patient Vitals Quick-Bar */}
      <div className="bg-cream-light p-4 rounded-xl border-2 border-parchment-dark shadow-vintage flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase text-olive font-bold">
            LIVE TELE-CONSULTATION SESSION
          </span>
          <h2 className="text-xl font-serif font-bold text-charcoal">
            {currentRecord?.name || 'Gurpreet Singh'} (60y, Male)
          </h2>
          <p className="text-xs font-mono text-charcoal-light">
            Vitals: SpO2 {currentRecord?.vitals?.spo2 || 88}% • BP {currentRecord?.vitals?.bloodPressureSystolic || 155}/95 • Temp {currentRecord?.vitals?.temperature || 37.8}°C
          </p>
        </div>

        {/* Demo Trigger to Simulate Bandwidth Drop */}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleBandwidth}
            className={`text-xs px-3 py-1.5 rounded-lg border font-mono transition-colors ${
              bandwidthStatus === 'low'
                ? 'bg-warning-amber text-yellow-950 border-warning-amber font-bold'
                : 'bg-parchment text-charcoal border-parchment-dark'
            }`}
            title="Simulate 2G/3G low bandwidth network condition"
          >
            {bandwidthStatus === 'low' ? (
              <span className="flex items-center gap-1">
                <WifiOff className="w-3.5 h-3.5" /> 2G Mode (Video Auto-Paused)
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5 text-success-green" /> 4G Good Bandwidth
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Video Stream & Chat Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <VideoPanel />
          <CallControls onEndCall={handleEndConsult} />
        </div>

        <div className="lg:col-span-5 space-y-4">
          <ChatPanel />

          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon={<FileText className="w-5 h-5" />}
            onClick={handleEndConsult}
          >
            Complete Consultation & View Prescription
          </Button>
        </div>
      </div>
    </div>
  );
};
