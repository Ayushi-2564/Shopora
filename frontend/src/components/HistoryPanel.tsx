import React from 'react';
import { History, ShoppingBag, RotateCcw, Calendar, Check } from 'lucide-react';
import { useShoppingStore } from '../hooks/useShoppingStore';
import { IShoppingHistory } from '../types';

export const HistoryPanel: React.FC = () => {
  const { history, buyAgain, items } = useShoppingStore();

  const isInList = (productName: string) => {
    return items.some((i) => i.name.toLowerCase() === productName.toLowerCase() && !i.completed);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (_) {
      return dateStr;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <History className="w-6 h-6 text-brand-600 dark:text-brand-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Purchase & Shopping History
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review your previous shopping orders and quickly re-add items to your active list.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700">
          <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No purchase history recorded yet.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            When you complete items on your shopping list, they will automatically appear here!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.map((record) => {
            const inCart = isInList(record.productName);

            return (
              <div
                key={record.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                      {record.category}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(record.purchasedAt)}</span>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {record.productName}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Quantity: {record.quantity} {record.unit} • ₹{record.price}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Paid: ₹{record.price}
                  </span>

                  <button
                    onClick={() => buyAgain(record)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      inCart
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                        : 'bg-brand-600 hover:bg-brand-500 text-white shadow-sm'
                    }`}
                  >
                    {inCart ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> In List
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" /> Buy Again
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
