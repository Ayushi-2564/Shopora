import React, { useState } from 'react';
import { Sparkles, CornerDownLeft, Volume2, Mic, Play } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useShoppingStore } from '../hooks/useShoppingStore';
import { VoiceButton } from './VoiceButton';
import { TranscriptPanel } from './TranscriptPanel';

const SAMPLE_COMMANDS = [
  'Add 2 bottles of milk',
  '2 bottle milk order karo',
  'Ek packet brown bread chahiye',
  'Add two boxes of nan khatai',
  'Find organic apples under 200',
  'Place my order',
];

export const VoiceAssistant: React.FC = () => {
  const {
    preferences,
    processVoiceTranscript,
    activeVoiceParsed,
    setVoiceProcessingState,
    voiceProcessingState,
  } = useShoppingStore();

  const [manualInput, setManualInput] = useState('');
  const { speak } = useSpeechSynthesis(preferences.enableTTS, preferences.language);

  // Hook for speech recognition
  const {
    isListening,
    interimTranscript,
    transcript,
    errorMessage,
    audioLevel,
    setErrorMessage,
    startListening,
    stopListening,
    setTranscript,
  } = useSpeechRecognition({
    language: preferences.language,
    onResult: (text, isFinal) => {
      if (isFinal && text.trim()) {
        handleFinalTranscript(text);
      }
    },
    onError: (err) => {
      setVoiceProcessingState('error', err);
    },
  });

  const handleFinalTranscript = async (text: string) => {
    setVoiceProcessingState('processing', 'Parsing intent with NLP...');
    setErrorMessage(null);
    const parsed = await processVoiceTranscript(text);
    if (parsed && parsed.spokenFeedback && preferences.enableTTS) {
      speak(parsed.spokenFeedback);
    }
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
      setVoiceProcessingState('idle');
    } else {
      setErrorMessage(null);
      startListening();
      setVoiceProcessingState('listening', 'Listening to your voice...');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    setTranscript(manualInput);
    handleFinalTranscript(manualInput);
    setManualInput('');
  };

  const handleSampleClick = (cmd: string) => {
    setTranscript(cmd);
    handleFinalTranscript(cmd);
  };

  return (
    <div className="w-full bg-gradient-to-b from-brand-50/50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 py-8 px-4 transition-colors">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Main Badge & Title */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100/80 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/80 text-brand-800 dark:text-brand-300 text-xs font-semibold mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span>Multilingual Voice AI Enabled</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Your Shopping List, <span className="bg-gradient-to-r from-brand-600 to-emerald-500 bg-clip-text text-transparent">Just One Voice Away.</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-lg">
          Add items, update quantities, filter organic products, or ask for smart replenishment with natural speech.
        </p>

        {/* Central Voice Button */}
        <div className="my-6">
          <VoiceButton
            isListening={isListening}
            isProcessing={voiceProcessingState === 'processing'}
            onToggle={handleMicToggle}
          />
        </div>

        {/* Live Transcript & Intent Panel */}
        <TranscriptPanel
          isListening={isListening}
          isProcessing={voiceProcessingState === 'processing'}
          interimTranscript={interimTranscript}
          finalTranscript={transcript}
          parsedCommand={activeVoiceParsed}
          errorMessage={errorMessage}
          audioLevel={audioLevel}
          onRetryMic={handleMicToggle}
          onSimulateCommand={handleSampleClick}
        />

        {/* Sample Voice Commands / Interactive Fast Chips */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 max-w-2xl">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 mr-1 flex items-center gap-1">
            <Mic className="w-3 h-3 text-brand-600" /> Quick voice presets:
          </span>
          {SAMPLE_COMMANDS.map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleSampleClick(cmd)}
              title={`Simulate saying "${cmd}"`}
              className="px-2.5 py-1 text-xs rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-all shadow-sm hover:shadow active:scale-95 flex items-center gap-1"
            >
              <Play className="w-2.5 h-2.5 text-brand-500" />
              "{cmd}"
            </button>
          ))}
        </div>

        {/* Fallback Manual Text Input for Desktop or Silent Environments */}
        <form onSubmit={handleManualSubmit} className="mt-4 w-full max-w-md relative flex items-center">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Or type a voice command..."
            className="w-full pl-3.5 pr-10 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors shadow-sm"
          />
          <button
            type="submit"
            disabled={!manualInput.trim()}
            className="absolute right-1.5 p-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="Submit command"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
