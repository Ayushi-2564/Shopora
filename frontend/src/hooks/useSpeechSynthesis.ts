import { useCallback, useRef } from 'react';
import { SupportedLanguage } from '../types';

export const useSpeechSynthesis = (enabled = true, language: SupportedLanguage = 'en-US') => {
  const synthRef = useRef<SpeechSynthesis | null>(
    typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null
  );

  const speak = useCallback(
    (text: string) => {
      if (!enabled || !synthRef.current || !text) return;

      try {
        // Cancel any pending speech
        synthRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // Choose appropriate language code
        if (language === 'hi-IN') {
          utterance.lang = 'hi-IN';
        } else if (language === 'es-ES') {
          utterance.lang = 'es-ES';
        } else {
          utterance.lang = 'en-US';
        }

        synthRef.current.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis error:', err);
      }
    },
    [enabled, language]
  );

  const stop = useCallback(() => {
    if (synthRef.current) {
      try {
        synthRef.current.cancel();
      } catch (_) {}
    }
  }, []);

  return { speak, stop };
};
