import React from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useShoppingStore } from '../hooks/useShoppingStore';

export const ConfirmationToast: React.FC = () => {
  const { toasts, dismissToast } = useShoppingStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />;
        let borderClass = 'border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900';

        if (toast.type === 'error') {
          icon = <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />;
          borderClass = 'border-rose-200 dark:border-rose-800 bg-white dark:bg-slate-900';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />;
          borderClass = 'border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-900';
        } else if (toast.type === 'info') {
          icon = <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />;
          borderClass = 'border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-2xl border shadow-xl shadow-slate-200/50 dark:shadow-slate-950/70 transition-all transform animate-in slide-in-from-bottom-5 duration-200 ${borderClass}`}
          >
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5">{icon}</div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {toast.message}
                </div>
                {toast.subMessage && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {toast.subMessage}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
              aria-label="Dismiss toast notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
