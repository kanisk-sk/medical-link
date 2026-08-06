import { create } from 'zustand';
import { PatientRecord, SymptomEntry, Vitals, Priority, Prescription } from '../types';

interface PatientState {
  currentRecord: PatientRecord | null;
  activeSymptoms: SymptomEntry[];
  currentVitals: Vitals | null;
  triagePriority: Priority;
  patientQueue: PatientRecord[];
  activePrescription: Prescription | null;
  addSymptom: (symptom: SymptomEntry) => void;
  removeSymptom: (id: string) => void;
  clearSymptoms: () => void;
  setVitals: (vitals: Vitals) => void;
  setTriagePriority: (priority: Priority) => void;
  setRecord: (record: PatientRecord | null) => void;
  setPrescription: (rx: Prescription | null) => void;
  updateQueueStatus: (id: string, status: PatientRecord['status']) => void;
}

const mockPatients: PatientRecord[] = [
  {
    id: 'pat-101',
    name: 'Gurpreet Singh',
    age: 60,
    gender: 'Male',
    phone: '+91 98765 43210',
    village: 'Alhoran, Nabha',
    abhaId: '91-4820-1928-3741',
    priority: 'HIGH',
    status: 'waiting',
    createdAt: new Date().toISOString(),
    symptoms: [
      { id: 's1', text: 'Chest Pain (ਛਾਤੀ ' + 'ਵਿੱਚ ਦਰਦ)', category: 'cardiovascular', isRedFlag: true },
      { id: 's2', text: 'Shortness of Breath (ਸਾਹ ਫੁੱਲਦਾ)', category: 'respiratory', isRedFlag: true }
    ],
    vitals: {
      temperature: 37.8,
      bloodPressureSystolic: 155,
      bloodPressureDiastolic: 95,
      pulseRate: 104,
      spo2: 88, // low SpO2 flag
      recordedAt: '10 mins ago',
      recordedBy: 'Harpreet Kaur (ASHA)'
    },
    triageNotes: '⚠ RED FLAG: Low SpO2 (88%) and high BP with acute chest tightness.'
  },
  {
    id: 'pat-102',
    name: 'Surinder Kaur',
    age: 48,
    gender: 'Female',
    phone: '+91 98123 45678',
    village: 'Bhadson, Nabha',
    priority: 'MEDIUM',
    status: 'waiting',
    createdAt: new Date().toISOString(),
    symptoms: [
      { id: 's3', text: 'High Fever (ਬੁਖਾਰ)', category: 'general', isRedFlag: false },
      { id: 's4', text: 'Severe Joint Pain', category: 'musculoskeletal', isRedFlag: false }
    ],
    vitals: {
      temperature: 39.2,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      pulseRate: 88,
      spo2: 97,
      recordedAt: '25 mins ago',
      recordedBy: 'Harpreet Kaur (ASHA)'
    },
    triageNotes: 'High fever 39.2°C for 3 days. Suspected viral infection.'
  },
  {
    id: 'pat-103',
    name: 'Jaswir Ram',
    age: 35,
    gender: 'Male',
    phone: '+91 97654 32109',
    village: 'Rohti Chhanna, Nabha',
    priority: 'LOW',
    status: 'waiting',
    createdAt: new Date().toISOString(),
    symptoms: [
      { id: 's5', text: 'Skin Rash on Arm', category: 'dermatology', isRedFlag: false }
    ],
    vitals: {
      temperature: 36.8,
      pulseRate: 72,
      spo2: 99,
      recordedAt: '40 mins ago'
    },
    triageNotes: 'Routine skin consultation.'
  }
];

export const usePatientStore = create<PatientState>((set) => ({
  currentRecord: mockPatients[0],
  activeSymptoms: mockPatients[0].symptoms,
  currentVitals: mockPatients[0].vitals || null,
  triagePriority: 'HIGH',
  patientQueue: mockPatients,
  activePrescription: null,
  addSymptom: (symptom) =>
    set((state) => ({ activeSymptoms: [...state.activeSymptoms, symptom] })),
  removeSymptom: (id) =>
    set((state) => ({
      activeSymptoms: state.activeSymptoms.filter((s) => s.id !== id),
    })),
  clearSymptoms: () => set({ activeSymptoms: [] }),
  setVitals: (vitals) => set({ currentVitals: vitals }),
  setTriagePriority: (priority) => set({ triagePriority: priority }),
  setRecord: (currentRecord) => set({ currentRecord }),
  setPrescription: (activePrescription) => set({ activePrescription }),
  updateQueueStatus: (id, status) =>
    set((state) => ({
      patientQueue: state.patientQueue.map((p) =>
        p.id === id ? { ...p, status } : p
      ),
    })),
}));
