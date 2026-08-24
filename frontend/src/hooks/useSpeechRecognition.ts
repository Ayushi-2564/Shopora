import { useState, useEffect, useRef, useCallback } from 'react';
import { SupportedLanguage } from '../types';

export interface UseSpeechRecognitionOptions {
  language?: SupportedLanguage;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

// BCP 47 Standard Language Codes
const LANG_CODE_MAP: Record<SupportedLanguage, string> = {
  'en-US': 'en-US',
  'hi-IN': 'hi-IN',
  'hinglish': 'hi-IN',
  'es-ES': 'es-ES',
};

export const useSpeechRecognition = (options: UseSpeechRecognitionOptions = {}) => {
  const { language = 'en-US', onResult, onError, onEnd } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isStoppingRef = useRef(false);

  // Clean audio context & streams
  const cleanupAudioStream = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (_) {}
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  // Setup real-time audio volume visualizer
  const setupAudioVisualizer = useCallback(async () => {
    try {
      if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) return;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));

        if (mediaStreamRef.current) {
          animFrameRef.current = requestAnimationFrame(updateLevel);
        }
      };

      updateLevel();
    } catch (e) {
      console.log('Audio visualizer fallback (silent mode):', e);
    }
  }, []);

  // Create or retrieve SpeechRecognition instance
  const createRecognition = useCallback(
    (langOverride?: string) => {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setIsSupported(false);
        return null;
      }

      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognition.lang = langOverride || LANG_CODE_MAP[language] || 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          isStoppingRef.current = false;
          setErrorMessage(null);
        };

        recognition.onresult = (event: any) => {
          let currentInterim = '';
          let finalTrans = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const text = result[0]?.transcript || '';
            if (result.isFinal) {
              finalTrans += text;
            } else {
              currentInterim += text;
            }
          }

          if (currentInterim) {
            setInterimTranscript(currentInterim);
            onResult?.(currentInterim, false);
          }

          if (finalTrans) {
            setTranscript(finalTrans);
            setInterimTranscript('');
            onResult?.(finalTrans, true);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('SpeechRecognition event error:', event.error);

          if (event.error === 'aborted' || isStoppingRef.current) {
            return;
          }

          let message = '';
          switch (event.error) {
            case 'not-allowed':
            case 'permission-denied':
              message = 'Microphone permission was denied. Please allow microphone access in your browser.';
              break;
            case 'no-speech':
              message = 'No speech detected. Tap the mic and speak clearly into your microphone.';
              break;
            case 'network':
              // If network error on region-specific tag, try generic 'en' or notify seamlessly
              message = 'Speech recognition network connection dropped. You can retry or click any voice command chip below.';
              break;
            case 'audio-capture':
              message = 'No working microphone found. Please check your audio input settings.';
              break;
            default:
              message = `Speech recognition status: ${event.error}`;
          }

          setErrorMessage(message);
          setIsListening(false);
          cleanupAudioStream();
          onError?.(message);
        };

        recognition.onend = () => {
          setIsListening(false);
          cleanupAudioStream();
          onEnd?.();
        };

        return recognition;
      } catch (err) {
        console.warn('Recognition creation error:', err);
        setIsSupported(false);
        return null;
      }
    },
    [language, onResult, onError, onEnd, cleanupAudioStream]
  );

  const startListening = useCallback(async () => {
    setTranscript('');
    setInterimTranscript('');
    setErrorMessage(null);
    isStoppingRef.current = false;

    // 1. Explicitly request microphone stream first (unlocks hardware in Chrome)
    await setupAudioVisualizer();

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }

      const rec = createRecognition();
      if (rec) {
        recognitionRef.current = rec;
        rec.start();
      }
    } catch (e: any) {
      console.warn('Error starting speech recognition:', e);
      if (e.name === 'InvalidStateError') {
        try {
          recognitionRef.current?.stop();
        } catch (_) {}
      }
      setErrorMessage('Please tap the microphone again to start speaking.');
      setIsListening(false);
    }
  }, [createRecognition, setupAudioVisualizer]);

  const stopListening = useCallback(() => {
    isStoppingRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    }
    setIsListening(false);
    cleanupAudioStream();
  }, [cleanupAudioStream]);

  // Clean on unmount
  useEffect(() => {
    return () => {
      isStoppingRef.current = true;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
      cleanupAudioStream();
    };
  }, [cleanupAudioStream]);

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    errorMessage,
    audioLevel,
    setErrorMessage,
    startListening,
    stopListening,
    setTranscript,
  };
};
