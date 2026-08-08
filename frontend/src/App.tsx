import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Splash } from './pages/Splash';
import { Onboarding } from './pages/Onboarding';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { PatientHome } from './pages/PatientHome';
import { SymptomCapture } from './pages/SymptomCapture';
import { AssistedIntake } from './pages/AssistedIntake';
import { TriagePage } from './pages/TriagePage';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { ConsultationPage } from './pages/ConsultationPage';
import { PrescriptionView } from './pages/PrescriptionView';
import { PharmacyPage } from './pages/PharmacyPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { HelpPage } from './pages/HelpPage';
import { SettingsPage } from './pages/SettingsPage';
import { AiAssistantWidget } from './components/assistant/AiAssistantWidget';

export const App: React.FC = () => {
  const protectedPage = (element: React.ReactNode) => (
    <ProtectedRoute>
      <AppShell>{element}</AppShell>
    </ProtectedRoute>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/select-role" element={<RoleSelectionPage />} />
        <Route path="/onboarding" element={protectedPage(<Onboarding />)} />
        <Route path="/help" element={<HelpPage />} />

        <Route path="/patient/home" element={protectedPage(<PatientHome />)} />
        <Route path="/patient/symptom-capture" element={protectedPage(<SymptomCapture />)} />
        <Route path="/patient/triage" element={protectedPage(<TriagePage />)} />
        <Route path="/patient/consultation" element={protectedPage(<ConsultationPage />)} />
        <Route path="/patient/prescription-view" element={protectedPage(<PrescriptionView />)} />
        <Route path="/patient/emergency" element={protectedPage(<EmergencyPage />)} />
        <Route path="/patient/settings" element={protectedPage(<SettingsPage />)} />

        <Route path="/doctor/dashboard" element={protectedPage(<DoctorDashboard />)} />
        <Route path="/doctor/consultation" element={protectedPage(<ConsultationPage />)} />

        <Route path="/worker/dashboard" element={protectedPage(<AssistedIntake />)} />

        <Route path="/pharmacy/dashboard" element={protectedPage(<PharmacyPage />)} />

        <Route path="/admin/dashboard" element={protectedPage(<AdminDashboard />)} />

        <Route path="/home" element={<Navigate to="/patient/home" replace />} />
        <Route path="/symptom-capture" element={<Navigate to="/patient/symptom-capture" replace />} />
        <Route path="/assisted-intake" element={<Navigate to="/worker/dashboard" replace />} />
        <Route path="/triage" element={<Navigate to="/patient/triage" replace />} />
        <Route path="/doctor-dashboard" element={<Navigate to="/doctor/dashboard" replace />} />
        <Route path="/consultation" element={<Navigate to="/patient/consultation" replace />} />
        <Route path="/prescription-view" element={<Navigate to="/patient/prescription-view" replace />} />
        <Route path="/pharmacy" element={<Navigate to="/pharmacy/dashboard" replace />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/emergency" element={<Navigate to="/patient/emergency" replace />} />
        <Route path="/settings" element={<Navigate to="/patient/settings" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AiAssistantWidget />
    </Router>
  );
};

export default App;

