import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useApp } from './AppContext';

interface VoiceContextType {
  isVoiceActive: boolean;
  toggleVoice: () => void;
  startListening: () => void;
  stopListening: () => void;
  isMuted: boolean;
  toggleMute: () => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setOrbState } = useApp();
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback(() => {
    setIsVoiceActive(true);
    setOrbState('LISTENING');

    // Web Speech API fallback for local ambient speech detection
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => {
          setOrbState('LISTENING');
        };

        recognition.onresult = () => {
          setOrbState('THINKING');
        };

        recognition.onerror = () => {
          setOrbState('IDLE');
        };

        recognition.onend = () => {
          if (isVoiceActive) {
            setOrbState('IDLE');
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.warn('SpeechRecognition error:', err);
      }
    }
  }, [isVoiceActive, setOrbState]);

  const stopListening = useCallback(() => {
    setIsVoiceActive(false);
    setOrbState('IDLE');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
  }, [setOrbState]);

  const toggleVoice = useCallback(() => {
    if (isVoiceActive) {
      stopListening();
    } else {
      startListening();
    }
  }, [isVoiceActive, startListening, stopListening]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return (
    <VoiceContext.Provider
      value={{
        isVoiceActive,
        toggleVoice,
        startListening,
        stopListening,
        isMuted,
        toggleMute,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) throw new Error('useVoice must be used within a VoiceProvider');
  return context;
};
