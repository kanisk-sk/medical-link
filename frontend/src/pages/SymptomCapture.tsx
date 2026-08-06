import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VoiceInput } from '../components/voice/VoiceInput';
import { TranscriptionDisplay } from '../components/voice/TranscriptionDisplay';
import { SymptomCard } from '../components/triage/SymptomCard';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useVoice } from '../hooks/useVoice';
import { usePatientStore } from '../store/patientStore';
import { useAuthStore } from '../store/authStore';
import { evaluateTriage } from '../utils/triageRules';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Volume2, Plus, Sparkles } from 'lucide-react';

export const SymptomCapture: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useAuthStore();
  const { activeSymptoms, addSymptom, removeSymptom, setTriagePriority } = usePatientStore();

  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    hasSupport,
  } = useVoice(language);

  const [manualInput, setManualInput] = useState('');

  const fullText = (transcript + ' ' + interimTranscript + ' ' + manualInput).trim();

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    addSymptom({
      id: 'sym-' + Date.now(),
      text: manualInput.trim(),
      category: 'general',
      isRedFlag: false,
    });
    setManualInput('');
  };

  const handleProceedToTriage = () => {
    const evaluation = evaluateTriage(fullText, null);
    setTriagePriority(evaluation.priority);

    // Merge evaluated extracted symptoms if any new ones found
    evaluation.extractedSymptoms.forEach((ext) => {
      if (!activeSymptoms.some((s) => s.text.toLowerCase() === ext.text.toLowerCase())) {
        addSymptom(ext);
      }
    });

    navigate('/triage');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold font-serif text-brick">
          🎤 {t('symptoms.title')}
        </h1>
        <p className="text-xs font-serif text-charcoal-light">
          {t('symptoms.instruction')}
        </p>
      </div>

      <Card variant="paper" className="p-6">
        {/* Voice Microphone Component */}
        <VoiceInput
          isListening={isListening}
          onStart={startListening}
          onStop={stopListening}
          onReset={resetTranscript}
        />

        {/* Realtime Live Speech Transcription Box */}
        <TranscriptionDisplay
          transcript={transcript}
          interimTranscript={interimTranscript}
        />

        {/* Manual Text Fallback Input */}
        <form onSubmit={handleManualAdd} className="mt-4 flex gap-2">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder={t('symptoms.manualPlaceholder')}
            className="flex-1 bg-warm-white border border-parchment-dark rounded-lg px-3 py-2.5 text-sm text-charcoal focus:outline-none focus:border-denim"
          />
          <Button type="submit" variant="outline" size="md" icon={<Plus className="w-4 h-4" />}>
            Add
          </Button>
        </form>

        {/* Confirmed / Active Symptoms List */}
        <div className="mt-6 space-y-3 border-t border-parchment-dark pt-4">
          <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-olive flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brick" />
            Extracted Symptom Checklist:
          </h4>

          {activeSymptoms.length === 0 ? (
            <p className="text-xs font-serif italic text-charcoal-light">
              No symptoms recorded yet. Speak above or type manually.
            </p>
          ) : (
            <div className="space-y-2">
              {activeSymptoms.map((symptom) => (
                <SymptomCard
                  key={symptom.id}
                  symptom={symptom}
                  onRemove={removeSymptom}
                />
              ))}
            </div>
          )}
        </div>

        {/* Continue Button */}
        <div className="mt-6">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon={<ArrowRight className="w-5 h-5" />}
            onClick={handleProceedToTriage}
          >
            {t('symptoms.confirmPrompt')}
          </Button>
        </div>
      </Card>
    </div>
  );
};
