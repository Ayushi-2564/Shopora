import React from 'react';
import { ShoppingBag, CheckCircle, Layers, IndianRupee } from 'lucide-react';
import { useShoppingStore } from '../hooks/useShoppingStore';

export const StatsCards: React.FC = () => {
  const { stats, preferences } = useShoppingStore();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-6xl mx-auto px-4 sm:px-6 my-6">
      {/* Total Items */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-none">
            {stats.totalItems}
          </div>
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
            Total Items
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-none">
            {stats.categoriesCount}
          </div>
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
            Categories
          </div>
        </div>
      </div>

      {/* Completed Items */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
          <CheckCircle className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-none">
            {stats.completedItems}
          </div>
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
            Completed
          </div>
        </div>
      </div>

      {/* Estimated Total Budget */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
          <IndianRupee className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-none">
            ₹{stats.estimatedTotal}
          </div>
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <span>Estimated</span>
            {preferences.budget > 0 && (
              <span className={`text-[10px] ${stats.estimatedTotal > preferences.budget ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                / ₹{preferences.budget}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
