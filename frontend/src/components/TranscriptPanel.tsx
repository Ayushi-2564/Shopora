import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle, RotateCcw, Zap, Play, Volume2 } from 'lucide-react';
import { ParsedVoiceCommand } from '../types';

interface TranscriptPanelProps {
  isListening: boolean;
  isProcessing: boolean;
  interimTranscript: string;
  finalTranscript: string;
  parsedCommand: ParsedVoiceCommand | null;
  errorMessage: string | null;
  audioLevel?: number;
  onRetryMic?: () => void;
  onSimulateCommand?: (cmd: string) => void;
}

export const TranscriptPanel: React.FC<TranscriptPanelProps> = ({
  isListening,
  isProcessing,
  interimTranscript,
  finalTranscript,
  parsedCommand,
  errorMessage,
  audioLevel = 0,
  onRetryMic,
  onSimulateCommand,
}) => {
  const displayText = interimTranscript || finalTranscript;

  // Responsive wave heights based on live microphone audio level
  const baseHeight = Math.max(8, Math.round((audioLevel / 100) * 36));

  return (
    <div className="w-full max-w-xl mx-auto mt-4 px-2">
      {/* Live Responsive Soundwave Visualizer */}
      {isListening && (
        <div className="flex items-center justify-center gap-1 mb-3 h-10 transition-all">
          <div
            className="w-1 bg-brand-500 rounded-full transition-all duration-75"
            style={{ height: `${Math.max(6, baseHeight * 0.7)}px` }}
          />
          <div
            className="w-1 bg-brand-500 rounded-full transition-all duration-75"
            style={{ height: `${Math.max(8, baseHeight * 1.1)}px` }}
          />
          <div
            className="w-1 bg-brand-400 rounded-full transition-all duration-75"
            style={{ height: `${Math.max(12, baseHeight * 1.4)}px` }}
          />
          <div
            className="w-1 bg-brand-600 rounded-full transition-all duration-75"
            style={{ height: `${Math.max(16, baseHeight * 1.6)}px` }}
          />
          <div
            className="w-1 bg-brand-400 rounded-full transition-all duration-75"
            style={{ height: `${Math.max(12, baseHeight * 1.3)}px` }}
          />
          <div
            className="w-1 bg-brand-500 rounded-full transition-all duration-75"
            style={{ height: `${Math.max(8, baseHeight * 0.9)}px` }}
          />
          <div
            className="w-1 bg-brand-500 rounded-full transition-all duration-75"
            style={{ height: `${Math.max(6, baseHeight * 0.6)}px` }}
          />
        </div>
      )}

      {/* Notice Banner with Quick Actions */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs shadow-sm mb-3 animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-amber-900 dark:text-amber-100">Voice Recognition Notice</div>
              <div className="mt-0.5 text-amber-700 dark:text-amber-300 leading-relaxed">
                {errorMessage}
              </div>

              {/* Action buttons to recover instantly without friction */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {onRetryMic && (
                  <button
                    onClick={onRetryMic}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold shadow-sm transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Retry Voice Input
                  </button>
                )}
                {onSimulateCommand && (
                  <button
                    onClick={() => onSimulateCommand('Add 2 bottles of milk')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 font-semibold hover:bg-amber-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 text-brand-600" /> Try "Add 2 bottles of milk"
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Transcript Bubble */}
      {(isListening || isProcessing || displayText || parsedCommand) && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50 transition-all">
          {/* Status header */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 border-b border-slate-100 dark:border-slate-700/60 pb-2">
            <div className="flex items-center gap-1.5 font-medium">
              {isListening ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="text-red-600 dark:text-red-400 font-semibold">Listening to microphone...</span>
                </>
              ) : isProcessing ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">AI Intent Extraction...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                  <span className="text-slate-700 dark:text-slate-300">Action Processed</span>
                </>
              )}
            </div>

            {parsedCommand && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                <Zap className="w-3 h-3" />
                {parsedCommand.intent}
              </span>
            )}
          </div>

          {/* Transcript Content */}
          <div className="text-sm font-medium text-slate-800 dark:text-slate-100 min-h-[1.5rem]">
            {displayText ? (
              <span className={interimTranscript ? 'text-slate-400 dark:text-slate-400 italic' : ''}>
                "{displayText}"
              </span>
            ) : isListening ? (
              <span className="text-slate-400 italic">Speak now (e.g. "Add milk", "I need 5 apples", "Find organic apples")...</span>
            ) : (
              <span className="text-slate-400">Ready for next command</span>
            )}
          </div>

          {/* Detected Intent Details */}
          {parsedCommand && (
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Action:</span>

              {parsedCommand.intent === 'ADD_ITEM' && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                  ✓ Added {parsedCommand.quantity || 1} {parsedCommand.unit || 'piece'}{' '}
                  {parsedCommand.item} ({parsedCommand.category})
                </span>
              )}

              {parsedCommand.intent === 'REMOVE_ITEM' && (
                <span className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold border border-rose-200 dark:border-rose-800">
                  ✕ Removed {parsedCommand.item}
                </span>
              )}

              {parsedCommand.intent === 'UPDATE_ITEM' && (
                <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800">
                  ↻ Quantity updated to {parsedCommand.quantity}
                </span>
              )}

              {parsedCommand.intent === 'COMPLETE_ITEM' && (
                <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-800">
                  ✓ Marked {parsedCommand.item} as purchased
                </span>
              )}

              {parsedCommand.intent === 'SEARCH_PRODUCT' && (
                <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
                  🔍 Filter: {parsedCommand.item} {parsedCommand.filters?.maxPrice ? `under ₹${parsedCommand.filters.maxPrice}` : ''}
                </span>
              )}

              {parsedCommand.intent === 'UNKNOWN' && (
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  Unknown intent - Try again
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
