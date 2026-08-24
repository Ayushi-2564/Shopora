import React from 'react';
import { ShoppingCart, Mic } from 'lucide-react';
import { useShoppingStore } from '../hooks/useShoppingStore';

export const EmptyState: React.FC = () => {
  const { processVoiceTranscript } = useShoppingStore();

  const handlePrompt = (prompt: string) => {
    processVoiceTranscript(prompt);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 max-w-md mx-auto my-8 shadow-sm">
      <div className="w-16 h-16 rounded-3xl bg-brand-50 dark:bg-brand-950/60 border border-brand-100 dark:border-brand-900/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4 shadow-inner">
        <ShoppingCart className="w-8 h-8" />
      </div>

      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
        Your Shopping List is Empty
      </h3>

      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-xs">
        Tap the microphone above or click any prompt below to populate your list instantly.
      </p>

      <div className="mt-6 flex flex-col gap-2 w-full">
        <button
          onClick={() => handlePrompt('Add 2 bottles of milk')}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/40 hover:border-brand-300 dark:hover:border-brand-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition-all text-left group"
        >
          <span className="flex items-center gap-2">
            <Mic className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            "Add 2 bottles of milk"
          </span>
          <span className="text-[10px] uppercase font-bold text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">
            + Add
          </span>
        </button>

        <button
          onClick={() => handlePrompt('I need 5 apples and brown bread')}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/40 hover:border-brand-300 dark:hover:border-brand-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition-all text-left group"
        >
          <span className="flex items-center gap-2">
            <Mic className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            "I need 5 apples and brown bread"
          </span>
          <span className="text-[10px] uppercase font-bold text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">
            + Add
          </span>
        </button>
      </div>
    </div>
  );
};
