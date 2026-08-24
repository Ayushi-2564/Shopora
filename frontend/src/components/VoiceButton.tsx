import React from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  isListening,
  isProcessing,
  onToggle,
  disabled = false,
}) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer Pulse Rings when Listening */}
      {isListening && (
        <>
          <div className="absolute w-28 h-28 rounded-full bg-brand-500/20 animate-ping" />
          <div className="absolute w-36 h-36 rounded-full bg-emerald-500/15 animate-pulse-slow" />
        </>
      )}

      {/* Main Mic Button */}
      <button
        onClick={onToggle}
        disabled={disabled || isProcessing}
        aria-label={
          isListening
            ? 'Stop voice input'
            : isProcessing
            ? 'Processing voice command'
            : 'Start voice input'
        }
        aria-pressed={isListening}
        className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center gap-1 shadow-2xl transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-brand-500/40 ${
          isListening
            ? 'bg-gradient-to-tr from-red-500 to-rose-600 text-white shadow-red-500/40 scale-105 ring-4 ring-rose-300 dark:ring-rose-900'
            : isProcessing
            ? 'bg-gradient-to-tr from-amber-500 to-amber-600 text-white shadow-amber-500/30'
            : 'bg-gradient-to-tr from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-white shadow-brand-600/40 hover:shadow-brand-500/50 hover:scale-105'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {isProcessing ? (
          <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin" />
        ) : isListening ? (
          <MicOff className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
        ) : (
          <Mic className="w-8 h-8 sm:w-10 sm:h-10" />
        )}
        <span className="text-[10px] sm:text-xs font-bold tracking-tight uppercase">
          {isProcessing ? 'Thinking' : isListening ? 'Listening' : 'Tap to Speak'}
        </span>
      </button>
    </div>
  );
};
