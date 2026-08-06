import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Mic, Stethoscope, Pill, FileText, UserCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUser } from '@clerk/react';
import { useAuthStore } from '../../store/authStore';

export const BottomNav: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const selectedRole = useAuthStore((state) => state.getSelectedRole(user?.id ?? null));

  const navItems =
    selectedRole === 'doctor'
      ? [
          { to: '/doctor/dashboard', icon: Home, label: 'Dashboard' },
          { to: '/doctor/consultation', icon: Stethoscope, label: t('actions.startConsultation') },
          { to: '/pharmacy/dashboard', icon: Pill, label: t('actions.findMedicine') },
          { to: '/patient/prescription-view', icon: FileText, label: t('actions.myPrescription') },
        ]
      : selectedRole === 'health_worker'
        ? [
            { to: '/worker/dashboard', icon: UserCheck, label: t('actions.recordVitals') },
            { to: '/patient/triage', icon: Stethoscope, label: t('triage.title') },
            { to: '/pharmacy/dashboard', icon: Pill, label: t('actions.findMedicine') },
            { to: '/patient/home', icon: Home, label: t('actions.speakSymptoms').split(' ')[0] || 'Home' },
          ]
        : selectedRole === 'pharmacist'
          ? [
              { to: '/pharmacy/dashboard', icon: Pill, label: t('actions.findMedicine') },
              { to: '/patient/prescription-view', icon: FileText, label: t('actions.myPrescription') },
              { to: '/patient/home', icon: Home, label: t('actions.speakSymptoms').split(' ')[0] || 'Home' },
            ]
          : selectedRole === 'admin'
            ? [
                { to: '/admin/dashboard', icon: Home, label: t('actions.adminDashboard') },
                { to: '/patient/home', icon: UserCheck, label: 'Users' },
              ]
            : [
                { to: '/patient/home', icon: Home, label: t('actions.speakSymptoms').split(' ')[0] || 'Home' },
                { to: '/patient/symptom-capture', icon: Mic, label: t('actions.speakSymptoms') },
                { to: '/patient/consultation', icon: Stethoscope, label: t('actions.talkToDoctor') },
                { to: '/pharmacy/dashboard', icon: Pill, label: t('actions.findMedicine') },
                { to: '/patient/prescription-view', icon: FileText, label: t('actions.myPrescription') },
              ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-cream-light/95 backdrop-blur-md border-t-2 border-parchment-dark shadow-lg md:hidden">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full py-1 text-[11px] font-medium transition-colors ${
                isActive
                  ? 'text-brick font-bold'
                  : 'text-charcoal-light hover:text-charcoal'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                <span className="truncate max-w-[64px]">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
