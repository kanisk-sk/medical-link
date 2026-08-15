export type SehatLinkRole = 'patient' | 'doctor' | 'health_worker' | 'pharmacist' | 'admin';

export type UserRole = SehatLinkRole;

export type Language = 'en' | 'ta' | 'pa' | 'hi';

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: SehatLinkRole;
  language: Language;
  abhaId?: string;
  age?: number;
  gender?: string;
  village?: string;
}

export interface AppProfile {
  id: string;
  name: string;
  phone: string;
  role?: SehatLinkRole;
  language: Language;
  abhaId?: string;
  age?: number;
  gender?: string;
  village?: string;
}

export interface Vitals {
  temperature?: number; // in Celsius
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  pulseRate?: number; // bpm
  spo2?: number; // percentage
  respiratoryRate?: number;
  weight?: number; // kg
  recordedAt: string;
  recordedBy?: string; // ASHA worker name/ID
}

export interface SymptomEntry {
  id: string;
  text: string;
  category: string;
  duration?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  isRedFlag?: boolean;
}

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  village: string;
  abhaId?: string;
  symptoms: SymptomEntry[];
  vitals?: Vitals;
  priority: Priority;
  triageNotes?: string;
  createdAt: string;
  status: 'waiting' | 'in_consultation' | 'completed' | 'referred_emergency';
}

export interface PrescriptionMedication {
  name: string;
  dosage: string;
  frequency: string; // e.g. "1-0-1 after food"
  durationDays: number;
  instructions?: string;
  inStock?: boolean;
}

export interface Prescription {
  id: string;
  consultationId: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  doctorLicense: string;
  diagnosis: string;
  medications: PrescriptionMedication[];
  followUpDate?: string;
  qrCodeData: string;
  issuedAt: string;
  isSigned: boolean;
}

export interface PharmacyItem {
  id: string;
  name: string;
  genericName: string;
  category: string;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  quantity: number;
  priceInINR: number;
  pharmacyName: string;
  pharmacyAddress: string;
  distanceKm: number;
  contactNumber: string;
}

export interface EmergencyCase {
  id: string;
  patientName: string;
  village: string;
  lat: number;
  lng: number;
  symptoms: string[];
  vitalsAlerts: string[];
  dispatchedAmbulance?: string;
  status: 'pending' | 'dispatched' | 'resolved';
  timestamp: string;
}

export interface OfflineQueueItem {
  id: string;
  action: 'submit_symptoms' | 'record_vitals' | 'create_prescription' | 'reserve_medicine';
  payload: any;
  createdAt: string;
  synced: boolean;
}
