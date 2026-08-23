import React from 'react';
import { Sparkles, X, Plus, Check, ArrowRight } from 'lucide-react';
import { useShoppingStore } from '../hooks/useShoppingStore';
import { IProduct } from '../types';

export const SubstituteModal: React.FC = () => {
  const {
    isSubstituteModalOpen,
    closeSubstituteModal,
    selectedProductForSubstitutes,
    substitutesList,
    addItem,
    items,
  } = useShoppingStore();

  if (!isSubstituteModalOpen || !selectedProductForSubstitutes) return null;

  const isInList = (productName: string) => {
    return items.some((i) => i.name.toLowerCase() === productName.toLowerCase() && !i.completed);
  };

  const handleAddSubstitute = (sub: IProduct) => {
    addItem({
      name: sub.name,
      category: sub.category,
      unit: sub.unit,
      quantity: 1,
      estimatedPrice: sub.salePrice || sub.price,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Suggested Alternatives & Substitutes
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                For: <span className="font-semibold text-slate-700 dark:text-slate-200">{selectedProductForSubstitutes.name}</span>
              </p>
            </div>
          </div>

          <button
            onClick={closeSubstituteModal}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Original Product Notice */}
        <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-xl">{selectedProductForSubstitutes.imageIcon || '📦'}</span>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">
                {selectedProductForSubstitutes.name}
              </div>
              <div className="text-slate-500">
                ₹{selectedProductForSubstitutes.salePrice || selectedProductForSubstitutes.price} • {selectedProductForSubstitutes.brand}
              </div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            Original Pick
          </span>
        </div>

        {/* Substitute list */}
        <div className="mt-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Recommended Replacements
          </div>

          {substitutesList.length === 0 ? (
            <div className="p-4 rounded-xl text-center text-xs text-slate-500">
              Finding close alternatives in {selectedProductForSubstitutes.category}...
            </div>
          ) : (
            substitutesList.map((sub) => {
              const inCart = isInList(sub.name);
              const priceDiff = (sub.salePrice || sub.price) - (selectedProductForSubstitutes.salePrice || selectedProductForSubstitutes.price);

              return (
                <div
                  key={sub.id}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800/90 shadow-sm hover:border-brand-300 dark:hover:border-brand-700 flex items-center justify-between gap-3 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center shadow-sm">
                      {sub.imageUrl ? (
                        <img
                          src={sub.imageUrl}
                          alt={sub.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-2xl">{sub.imageIcon || '🌱'}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {sub.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          ₹{sub.salePrice || sub.price}
                        </span>
                        {priceDiff !== 0 && (
                          <span
                            className={`text-[10px] font-semibold ${
                              priceDiff < 0 ? 'text-emerald-600' : 'text-slate-400'
                            }`}
                          >
                            ({priceDiff < 0 ? `-₹${Math.abs(priceDiff)} cheaper` : `+₹${priceDiff}`})
                          </span>
                        )}
                        <span>• {sub.brand}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddSubstitute(sub)}
                    className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      inCart
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                        : 'bg-brand-600 hover:bg-brand-500 text-white shadow-sm'
                    }`}
                  >
                    {inCart ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Added
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" /> Add
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={closeSubstituteModal}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
