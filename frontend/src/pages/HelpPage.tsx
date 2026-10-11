import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { HelpCircle, ChevronDown, ChevronUp, ShieldCheck, Mic, WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const HelpPage: React.FC = () => {
  const { t } = useTranslation();

  const faqs = [
    {
      q: 'How does Voice Input work in Punjabi or Hindi?',
      a: 'Simply tap the large microphone button on the "Speak Symptoms" screen and speak naturally in Punjabi, Hindi, or English. SehatLink automatically converts your voice into text and extracts key medical symptoms.',
    },
    {
      q: 'Will SehatLink work when there is no internet connection in the village?',
      a: 'Yes! SehatLink is built offline-first. Your symptoms, vitals recorded by ASHA workers, and messages are saved securely on your device using IndexedDB technology. When connectivity returns, your data automatically synchronizes with the hospital server.',
    },
    {
      q: 'What is ABHA (Ayushman Bharat Health Account) linking?',
      a: 'ABHA is your digital 14-digit health ID. Linking your ABHA allows your e-prescriptions and doctor consultation summaries to be stored safely in your national health locker for future visits.',
    },
    {
      q: 'How do I find medicines at nearby Jan Aushadhi Kendras?',
      a: 'Go to the "Find Medicine" page. Type your prescribed medicine name. You will see a list and map of nearby pharmacies locally showing live stock status (In Stock / Low Stock / Out of Stock).',
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold font-serif text-brick">
          ❓ {t('actions.help')}
        </h1>
        <p className="text-xs font-serif text-charcoal-light">
          Frequently asked questions and user guide for SehatLink
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <Card
              key={idx}
              variant="paper"
              className="p-4 transition-colors cursor-pointer"
              onClick={() => setOpenIdx(isOpen ? null : idx)}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-denim flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-brick flex-shrink-0" />
                  {faq.q}
                </h3>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-charcoal-light" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-charcoal-light" />
                )}
              </div>

              {isOpen && (
                <p className="mt-3 text-xs font-serif text-charcoal leading-relaxed border-t border-parchment-dark pt-3">
                  {faq.a}
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
