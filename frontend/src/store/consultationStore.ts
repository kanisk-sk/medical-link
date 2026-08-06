import { create } from 'zustand';

export type CallMode = 'video' | 'audio' | 'async';

interface ConsultationMessage {
  id: string;
  sender: 'doctor' | 'patient' | 'asha';
  senderName: string;
  text?: string;
  audioUrl?: string;
  imageUrl?: string;
  timestamp: string;
}

interface ConsultationState {
  activeCall: boolean;
  callMode: CallMode;
  isMuted: boolean;
  isVideoOff: boolean;
  bandwidthStatus: 'good' | 'low' | 'offline';
  messages: ConsultationMessage[];
  doctorNotes: string;
  startCall: (mode?: CallMode) => void;
  endCall: () => void;
  setCallMode: (mode: CallMode) => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  setBandwidthStatus: (status: 'good' | 'low' | 'offline') => void;
  addMessage: (msg: ConsultationMessage) => void;
  setDoctorNotes: (notes: string) => void;
}

export const useConsultationStore = create<ConsultationState>((set) => ({
  activeCall: false,
  callMode: 'video',
  isMuted: false,
  isVideoOff: false,
  bandwidthStatus: 'good',
  messages: [
    {
      id: 'm1',
      sender: 'asha',
      senderName: 'Harpreet Kaur (ASHA)',
      text: 'Doctor Sahab, patient has acute chest discomfort. SpO2 measured at 88%. Vitals attached.',
      timestamp: '10:14 AM'
    },
    {
      id: 'm2',
      sender: 'doctor',
      senderName: 'Dr. Amanpreet Singh',
      text: 'Sat Sri Akal Gurpreet ji. I am reviewing your vitals. Please stay calm while I start the consultation.',
      timestamp: '10:15 AM'
    }
  ],
  doctorNotes: 'Patient presents with acute precordial pain, dyspnea. SpO2 88%. Suspected acute coronary syndrome / angina. Advised sublingual nitroglycerin, oxygen, immediate hospital transport.',
  startCall: (mode = 'video') => set({ activeCall: true, callMode: mode }),
  endCall: () => set({ activeCall: false }),
  setCallMode: (callMode) => set({ callMode }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  toggleVideo: () => set((state) => ({ isVideoOff: !state.isVideoOff })),
  setBandwidthStatus: (bandwidthStatus) => set({ bandwidthStatus }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  setDoctorNotes: (doctorNotes) => set({ doctorNotes }),
}));
