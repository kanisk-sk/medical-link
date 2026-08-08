import { Language, SehatLinkRole } from './index';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface AssistantMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  emergencyFlag?: boolean;
  isStreaming?: boolean;
  model?: string;
  error?: boolean;
}

export interface QuickPrompt {
  id: string;
  label: string;
  prompt: string;
  category: 'symptoms' | 'dosage' | 'asha_intake' | 'emergency' | 'general';
  language: Language;
}

export interface VitalsContext {
  temperature?: number;
  blood_pressure?: string;
  pulse_rate?: number;
  spo2?: number;
  symptoms?: string[];
}

export interface ChatStreamEvent {
  content?: string;
  done?: boolean;
  emergency_detected?: boolean;
  notice?: string;
  execution_time_ms?: number;
  model?: string;
  error?: boolean;
}

export interface AssistantHealthStatus {
  status: 'active' | 'fallback_mode' | 'error';
  groq_api_configured: boolean;
  model: string;
  app_name: string;
  environment: string;
}

export type ThemeMode = 'vintage-light' | 'vintage-dark';

