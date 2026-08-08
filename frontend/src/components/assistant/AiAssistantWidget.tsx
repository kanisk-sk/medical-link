import React from 'react';
import { useAiAssistant } from '../../hooks/useAiAssistant';
import { AiAssistantFAB } from './AiAssistantFAB';
import { AiAssistantChatWindow } from './AiAssistantChatWindow';

export const AiAssistantWidget: React.FC = () => {
  const {
    isOpen,
    setIsOpen,
    toggleOpen,
    isStreaming,
    messages,
    quickPrompts,
    inputText,
    setInputText,
    isOffline,
    themeMode,
    toggleTheme,
    isListening,
    toggleListening,
    speakMessage,
    currentlySpeakingId,
    isSpeaking,
    sendMessage,
    clearChat,
    userRole,
    userLanguage,
    groqConfigured
  } = useAiAssistant();

  return (
    <>
      <AiAssistantFAB
        isOpen={isOpen}
        onClick={toggleOpen}
        isStreaming={isStreaming}
        themeMode={themeMode}
        userLanguage={userLanguage}
      />

      <AiAssistantChatWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        quickPrompts={quickPrompts}
        inputText={inputText}
        setInputText={setInputText}
        onSend={(text) => sendMessage(text)}
        isStreaming={isStreaming}
        isOffline={isOffline}
        themeMode={themeMode}
        onToggleTheme={toggleTheme}
        isListening={isListening}
        onToggleListening={toggleListening}
        onSpeak={speakMessage}
        currentlySpeakingId={currentlySpeakingId}
        isSpeaking={isSpeaking}
        onClearChat={clearChat}
        userRole={userRole}
        userLanguage={userLanguage}
        groqConfigured={groqConfigured}
      />
    </>
  );
};
