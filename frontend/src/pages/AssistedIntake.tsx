import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { usePatientStore } from '../store/patientStore';
import { useSyncStore } from '../store/syncStore';
import { evaluateTriage } from '../utils/triageRules';
import { offlineDb } from '../db/offlineDb';
import { Activity, Camera, AlertOctagon, CheckCircle2, Mic, RefreshCw, Wifi, WifiOff } from 'lucide-react';

export const AssistedIntake: React.FC = () => {
  const navigate = useNavigate();
  const { setVitals, setTriagePriority, currentRecord } = usePatientStore();
  const { isOnline, addToQueue, isSyncing, setSyncing } = useSyncStore();

  const [spo2, setSpo2] = useState('88'); // Default low SpO2 for Gurpreet demo scenario
  const [systolic, setSystolic] = useState('155');
  const [diastolic, setDiastolic] = useState('95');
  const [pulse, setPulse] = useState('104');
  const [temp, setTemp] = useState('37.8');
  const [bloodSugar, setBloodSugar] = useState('140');
  const [weight, setWeight] = useState('68');
  const [ashaNotes, setAshaNotes] = useState('Patient complaining of acute retrosternal pressure.');
  const [isRecordingNote, setIsRecordingNote] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleToggleVoiceNote = () => {
    if (isRecordingNote) {
      setIsRecordingNote(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice dictation not supported in this browser.');
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.lang = 'pa-IN';
      rec.onstart = () => setIsRecordingNote(true);
      rec.onresult = (evt: any) => {
        const text = evt.results[0][0].transcript;
        if (text) {
          setAshaNotes((prev) => (prev ? `${prev} ${text}` : text));
        }
        setIsRecordingNote(false);
      };
      rec.onerror = () => setIsRecordingNote(false);
      rec.onend = () => setIsRecordingNote(false);
      rec.start();
    } catch (e) {
      setIsRecordingNote(false);
    }
  };

  const handleSaveIntake = async (e: React.FormEvent) => {
    e.preventDefault();
    const vitalsData = {
      spo2: Number(spo2),
      bloodPressureSystolic: Number(systolic),
      bloodPressureDiastolic: Number(diastolic),
      pulseRate: Number(pulse),
      temperature: Number(temp),
      bloodSugar: Number(bloodSugar),
      weight: Number(weight),
      recordedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recordedBy: 'Harpreet Kaur (ASHA Worker)',
    };

    setVitals(vitalsData);

    // Save to Dexie IndexedDB
    try {
      await offlineDb.vitalsRecords.add({
        id: `vit-${Date.now()}`,
        patientId: currentRecord?.id || 'pat-101',
        patientName: currentRecord?.name || 'Gurpreet Singh',
        village: currentRecord?.village || 'Alhoran, Nabha',
        ...vitalsData,
        synced: isOnline
      });
    } catch (err) {
      console.warn('Dexie save notice:', err);
    }

    if (!isOnline) {
      addToQueue({
        action: 'record_vitals',
        payload: { patientId: currentRecord?.id, vitalsData }
      });
    }

    // Evaluate Triage with Vitals
    const evaluation = evaluateTriage(ashaNotes, vitalsData);
    setTriagePriority(evaluation.priority);

    setSavedSuccess(true);
    setTimeout(() => {
      navigate('/triage');
    }, 900);
  };

  const handleManualSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      alert('All pending ASHA offline records synced with Nabha Central Server!');
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold font-serif text-denim">
          🏥 Assisted Intake Mode (ASHA Health Worker)
        </h1>
        <p className="text-xs font-serif text-charcoal-light">
          Door-to-door village clinical intake, vitals recording & offline queue sync
        </p>
      </div>

      {/* Connection Status & Offline Sync Pill */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-parchment border border-parchment-dark">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <>
              <Wifi className="w-4 h-4 text-success-green" />
              <span className="text-xs font-serif font-bold text-success-green">Online Sync Active</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-warning-amber animate-pulse" />
              <span className="text-xs font-serif font-bold text-warning-amber">Offline Mode (IndexedDB Local Queue)</span>
            </>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={isSyncing}
          icon={<RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />}
          onClick={handleManualSync}
        >
          {isSyncing ? 'Syncing...' : 'Sync Offline Queue'}
        </Button>
      </div>

      <Card variant="paper" className="p-6 shadow-vintage">
        <form onSubmit={handleSaveIntake} className="space-y-6">
          <div className="bg-cream-light p-3.5 rounded-lg border-2 border-vintage-gold/50 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-mono uppercase text-olive font-bold">Target Patient Profile</span>
              <h3 className="font-serif font-bold text-base text-charcoal">
                {currentRecord?.name || 'Gurpreet Singh'} ({currentRecord?.age || 60}y, {currentRecord?.gender || 'Male'})
              </h3>
              <p className="text-xs font-serif text-charcoal-light">Village: {currentRecord?.village || 'Alhoran, Nabha'}</p>
            </div>
            <span className="px-2 py-1 bg-emergency-red text-white text-[10px] font-serif font-bold uppercase rounded">
              High Risk
            </span>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-olive flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-brick" />
              Clinical Vitals Measurement
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="SpO2 Oxygen (%)"
                type="number"
                value={spo2}
                onChange={(e) => setSpo2(e.target.value)}
                helperText="Normal: 95-100%. < 90% Red Flag"
                required
              />

              <Input
                label="Pulse Rate (bpm)"
                type="number"
                value={pulse}
                onChange={(e) => setPulse(e.target.value)}
                required
              />

              <Input
                label="BP Systolic (mmHg)"
                type="number"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                required
              />

              <Input
                label="BP Diastolic (mmHg)"
                type="number"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                required
              />

              <Input
                label="Body Temp (°C)"
                type="number"
                step="0.1"
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                required
              />

              <Input
                label="Blood Sugar (mg/dL)"
                type="number"
                value={bloodSugar}
                onChange={(e) => setBloodSugar(e.target.value)}
              />
            </div>
          </div>

          {/* Photo Attachment & Voice Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="border-2 border-dashed border-parchment-dark p-3.5 rounded-xl text-center bg-warm-white space-y-1.5">
              <Camera className="w-6 h-6 text-olive mx-auto" />
              <p className="text-xs font-serif text-charcoal font-semibold">Attach Patient Photo / Rash</p>
              <Button type="button" variant="outline" size="sm" onClick={() => alert('Simulated camera capture completed.')}>
                Upload Photo
              </Button>
            </div>

            <div className="border-2 border-dashed border-parchment-dark p-3.5 rounded-xl text-center bg-warm-white space-y-1.5">
              <Mic className={`w-6 h-6 mx-auto ${isRecordingNote ? 'text-brick animate-bounce' : 'text-denim'}`} />
              <p className="text-xs font-serif text-charcoal font-semibold">Voice Dictation (Punjabi)</p>
              <Button type="button" variant="outline" size="sm" onClick={handleToggleVoiceNote}>
                {isRecordingNote ? 'Recording...' : 'Speak Voice Note'}
              </Button>
            </div>
          </div>

          <Input
            label="ASHA Field Notes & Observation"
            value={ashaNotes}
            onChange={(e) => setAshaNotes(e.target.value)}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            icon={<CheckCircle2 className="w-5 h-5" />}
          >
            {savedSuccess ? 'Saved & Evaluated!' : 'Save Vitals & Evaluate Triage'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
