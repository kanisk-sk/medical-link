import React, { useState } from 'react';
import { VideoPanel } from '../components/consultation/VideoPanel';
import { ChatPanel } from '../components/consultation/ChatPanel';
import { CallControls } from '../components/consultation/CallControls';
import { Modal } from '../components/common/Modal';
import { useConsultationStore } from '../store/consultationStore';
import { usePatientStore } from '../store/patientStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Wifi, WifiOff, FileText, Share2, CheckCircle2, ShieldAlert } from 'lucide-react';

export const ConsultationPage: React.FC = () => {
  const navigate = useNavigate();
  const { endCall, bandwidthStatus, setBandwidthStatus } = useConsultationStore();
  const { currentRecord } = usePatientStore();

  const [showReferralModal, setShowReferralModal] = useState<boolean>(false);
  const [referralSent, setReferralSent] = useState<boolean>(false);

  const handleEndConsult = () => {
    endCall();
    navigate('/patient/prescription-view');
  };

  const toggleBandwidth = () => {
    setBandwidthStatus(bandwidthStatus === 'good' ? 'low' : 'good');
  };

  const handleConfirmReferral = () => {
    setReferralSent(true);
    setTimeout(() => {
      setReferralSent(false);
      setShowReferralModal(false);
      alert('Emergency Hospital Referral transmitted to Govt Civil Hospital!');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner with Patient Vitals Quick-Bar */}
      <div className="bg-cream-light p-4 rounded-xl border-2 border-parchment-dark shadow-vintage flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase text-olive font-bold">
            LIVE RURAL TELE-CONSULTATION SESSION • SECTOR 3
          </span>
          <h2 className="text-xl font-serif font-bold text-charcoal">
            {currentRecord?.name || 'Gurpreet Singh'} (60y, Male)
          </h2>
          <p className="text-xs font-mono text-charcoal-light">
            Vitals: SpO2 {currentRecord?.vitals?.spo2 || 88}% • BP {currentRecord?.vitals?.bloodPressureSystolic || 155}/95 • Temp {currentRecord?.vitals?.temperature || 37.8}°C
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Share2 className="w-3.5 h-3.5 text-brick" />}
            onClick={() => setShowReferralModal(true)}
          >
            Hospital Referral
          </Button>

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
                <WifiOff className="w-3.5 h-3.5 text-emergency-red" /> 2G Audio Mode
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
            Complete Consultation & Issue E-Prescription
          </Button>
        </div>
      </div>

      {/* Referral Modal */}
      {showReferralModal && (
        <Modal
          isOpen={showReferralModal}
          onClose={() => setShowReferralModal(false)}
          title="Issue Urgent Hospital Referral"
        >
          <div className="space-y-4 font-serif text-xs">
            <div className="bg-parchment p-3 rounded-lg border border-parchment-dark">
              <p className="font-bold text-denim">Target Facility: Government Civil Hospital</p>
              <p className="text-charcoal-light mt-0.5">Patient: Gurpreet Singh (60y, Male) • SpO2 88%</p>
            </div>

            {referralSent ? (
              <div className="text-center py-4 text-success-green space-y-1">
                <CheckCircle2 className="w-10 h-10 mx-auto animate-bounce" />
                <p className="font-bold text-sm">Referral Transmitted to Civil Hospital Admissions!</p>
              </div>
            ) : (
              <>
                <p className="text-charcoal-light">
                  This action will notify the trauma department and reserve an emergency bed with patient vitals pre-attached.
                </p>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setShowReferralModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="emergency" size="sm" onClick={handleConfirmReferral}>
                    Send Emergency Referral
                  </Button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
