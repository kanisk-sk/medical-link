import Dexie, { Table } from 'dexie';
import { PatientRecord, Vitals, Prescription, SymptomEntry } from '../types';

export interface LocalAppointment {
  id: string;
  patientName: string;
  phone: string;
  village: string;
  doctorId?: string;
  doctorName?: string;
  date: string;
  timeSlot: string;
  symptoms: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  synced: boolean;
}

export interface LocalVitalsRecord {
  id: string;
  patientId: string;
  patientName: string;
  village: string;
  temperature?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  pulseRate?: number;
  spo2?: number;
  bloodSugar?: number;
  weight?: number;
  voiceNoteUrl?: string;
  imageUrl?: string;
  recordedBy: string;
  recordedAt: string;
  synced: boolean;
}

export interface LocalOfflineQueue {
  id: string;
  action: 'register_patient' | 'record_vitals' | 'book_appointment' | 'create_prescription' | 'reserve_medicine';
  payload: any;
  createdAt: string;
  synced: boolean;
}

export class SehatLinkOfflineDB extends Dexie {
  patients!: Table<PatientRecord, string>;
  appointments!: Table<LocalAppointment, string>;
  vitalsRecords!: Table<LocalVitalsRecord, string>;
  prescriptions!: Table<Prescription, string>;
  syncQueue!: Table<LocalOfflineQueue, string>;

  constructor() {
    super('SehatLinkRuralDB');
    this.version(1).stores({
      patients: 'id, name, phone, village, priority, status, createdAt',
      appointments: 'id, patientName, date, status, synced',
      vitalsRecords: 'id, patientId, recordedBy, recordedAt, synced',
      prescriptions: 'id, consultationId, patientId, issuedAt',
      syncQueue: 'id, action, createdAt, synced'
    });
  }
}

export const offlineDb = new SehatLinkOfflineDB();

// Helper to seed initial sample patient data into Dexie if empty
export async function initOfflineData() {
  try {
    const count = await offlineDb.patients.count();
    if (count === 0) {
      await offlineDb.patients.bulkAdd([
        {
          id: 'pat-101',
          name: 'Gurpreet Singh',
          age: 60,
          gender: 'Male',
          phone: '+91 98765 43210',
          village: 'Alhoran',
          abhaId: '91-4820-1928-3741',
          priority: 'HIGH',
          status: 'waiting',
          createdAt: new Date().toISOString(),
          symptoms: [
            { id: 's1', text: 'Chest Pain (ਛਾਤੀ ਵਿੱਚ ਦਰਦ)', category: 'cardiovascular', isRedFlag: true },
            { id: 's2', text: 'Shortness of Breath (ਸਾਹ ਫੁੱਲਦਾ)', category: 'respiratory', isRedFlag: true }
          ],
          vitals: {
            temperature: 37.8,
            bloodPressureSystolic: 155,
            bloodPressureDiastolic: 95,
            pulseRate: 104,
            spo2: 88,
            recordedAt: '10 mins ago',
            recordedBy: 'Harpreet Kaur (ASHA)'
          },
          triageNotes: '⚠ RED FLAG: Low SpO2 (88%) and elevated BP with chest discomfort.'
        },
        {
          id: 'pat-102',
          name: 'Surinder Kaur',
          age: 48,
          gender: 'Female',
          phone: '+91 98123 45678',
          village: 'Bhadson',
          abhaId: '91-3341-9982-1102',
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
          village: 'Rohti Chhanna',
          abhaId: '91-1029-3847-5610',
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
          triageNotes: 'Routine dermatological review.'
        }
      ]);
    }
  } catch (err) {
    console.warn('Dexie DB Init Notice:', err);
  }
}
