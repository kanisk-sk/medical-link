import React, { useState } from 'react';
import { useConsultationStore } from '../../store/consultationStore';
import { Send, Mic, Paperclip } from 'lucide-react';

export const ChatPanel: React.FC = () => {
  const { messages, addMessage } = useConsultationStore();
  const [text, setText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    addMessage({
      id: 'm-' + Date.now(),
      sender: 'patient',
      senderName: 'Gurpreet (Patient)',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setText('');
  };

  return (
    <div className="flex flex-col h-[400px] bg-cream-light rounded-xl border-2 border-parchment-dark shadow-vintage overflow-hidden">
      {/* Panel Header */}
      <div className="bg-parchment px-4 py-2.5 border-b border-parchment-dark flex items-center justify-between">
        <h4 className="text-xs font-serif font-bold text-denim uppercase tracking-wider">
          Consultation Chat & Voice Notes
        </h4>
        <span className="text-[10px] font-mono bg-olive/10 text-olive px-2 py-0.5 rounded border border-olive/20">
          Encrypted (DPDP 2023 Compliant)
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans">
        {messages.map((msg) => {
          const isPatient = msg.sender === 'patient' || msg.sender === 'asha';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isPatient ? 'items-end' : 'items-start'}`}
            >
              <span className="text-[10px] font-mono text-charcoal-light mb-1 px-1">
                {msg.senderName} • {msg.timestamp}
              </span>
              <div
                className={`max-w-[85%] px-4 py-2.5 rounded-xl text-sm shadow-2xs ${
                  isPatient
                    ? 'bg-brick text-white rounded-br-none'
                    : 'bg-denim text-white rounded-bl-none'
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input Form */}
      <form onSubmit={handleSend} className="p-2.5 bg-parchment/60 border-t border-parchment-dark flex items-center space-x-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message or voice note response..."
          className="flex-1 bg-warm-white border border-parchment-dark rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-denim"
        />
        <button
          type="submit"
          className="p-2.5 bg-brick hover:bg-brick-dark text-white rounded-lg transition-colors shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
