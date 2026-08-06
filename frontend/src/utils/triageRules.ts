import { SymptomEntry, Vitals, Priority } from '../types';

// Keyword dictionary for symptom extraction & red-flag detection
const RED_FLAG_KEYWORDS = [
  // Chest pain
  'chest pain', 'ਛਾਤੀ ਵਿੱਚ ਦਰਦ', 'छाती में दर्द', 'heart pain', 'dil da dard',
  // Shortness of breath / Difficulty breathing
  'shortness of breath', 'difficulty breathing', 'ਸਾਹ ਫੁੱਲਦਾ', 'सांस फूलना', 'saah phulda', 'saans phulna',
  // Unconsciousness / Fainting
  'unconscious', 'fainted', 'ਬੇਹੋਸ਼', 'बेहोश', 'chakkar',
  // Severe bleeding
  'bleeding', 'ਖੂਨ', 'खून', 'blood',
  // Severe sudden head pain / Stroke symptoms
  'paralysis', 'lakwa', 'ਲਕਵਾ', 'लकवा', 'sudden weakness'
];

export interface TriageEvaluation {
  priority: Priority;
  isRedFlag: boolean;
  alerts: string[];
  extractedSymptoms: SymptomEntry[];
}

export function evaluateTriage(
  rawSpeech: string,
  vitals?: Vitals | null
): TriageEvaluation {
  const alerts: string[] = [];
  const extractedSymptoms: SymptomEntry[] = [];
  const text = rawSpeech.toLowerCase();

  let isRedFlag = false;

  // 1. Check speech text against red-flag keywords
  RED_FLAG_KEYWORDS.forEach((keyword, index) => {
    if (text.includes(keyword.toLowerCase())) {
      isRedFlag = true;
      alerts.push(`Critical Symptom detected: "${keyword}"`);
      extractedSymptoms.push({
        id: `ext-${index}`,
        text: keyword,
        category: 'emergency',
        isRedFlag: true
      });
    }
  });

  // 2. Extract common non-emergency symptoms if mentioned
  if (text.includes('fever') || text.includes('ਬੁਖਾਰ') || text.includes('बुखार')) {
    extractedSymptoms.push({
      id: 'ext-fever',
      text: 'Fever (ਬੁਖਾਰ)',
      category: 'general',
      isRedFlag: false
    });
  }
  if (text.includes('cough') || text.includes('ਖੰਘ') || text.includes('खांसी')) {
    extractedSymptoms.push({
      id: 'ext-cough',
      text: 'Cough (ਖੰਘ)',
      category: 'respiratory',
      isRedFlag: false
    });
  }
  if (text.includes('headache') || text.includes('ਸਿਰ ਦਰਦ') || text.includes('सिर दर्द')) {
    extractedSymptoms.push({
      id: 'ext-headache',
      text: 'Headache (ਸਿਰ ਦਰਦ)',
      category: 'neurological',
      isRedFlag: false
    });
  }

  // 3. Evaluate Vitals against Clinical Emergency Rules
  if (vitals) {
    if (vitals.spo2 && vitals.spo2 < 90) {
      isRedFlag = true;
      alerts.push(`CRITICAL: Hypoxia detected (SpO2: ${vitals.spo2}% < 90%)`);
    }
    if (vitals.bloodPressureSystolic && vitals.bloodPressureSystolic > 160) {
      isRedFlag = true;
      alerts.push(`CRITICAL: Hypertensive crisis (Systolic BP: ${vitals.bloodPressureSystolic} mmHg)`);
    }
    if (vitals.temperature && vitals.temperature > 39.5) {
      alerts.push(`High Hyperpyrexia (Temperature: ${vitals.temperature}°C)`);
    }
  }

  // 4. Calculate Final Priority
  let priority: Priority = 'LOW';
  if (isRedFlag || alerts.length >= 2) {
    priority = 'HIGH';
  } else if (extractedSymptoms.length > 0 || (vitals && vitals.temperature && vitals.temperature > 38)) {
    priority = 'MEDIUM';
  }

  // Fallback if no symptoms parsed yet but text present
  if (extractedSymptoms.length === 0 && rawSpeech.trim().length > 0) {
    extractedSymptoms.push({
      id: 'ext-custom',
      text: rawSpeech.trim(),
      category: 'user_input',
      isRedFlag: false
    });
  }

  return {
    priority,
    isRedFlag,
    alerts,
    extractedSymptoms
  };
}
