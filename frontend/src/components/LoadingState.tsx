import React from 'react';

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading list...' }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-4 animate-pulse">
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-48 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-700" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32" />
                <div className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded w-20" />
              </div>
            </div>
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-16" />
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-slate-400 mt-4">{message}</p>
    </div>
  );
};
