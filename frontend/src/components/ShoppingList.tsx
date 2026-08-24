import React, { useState } from 'react';
import { Plus, Trash2, Filter, CheckCircle2, ListPlus, ArrowRight, Zap, ShoppingBag } from 'lucide-react';
import { useShoppingStore } from '../hooks/useShoppingStore';
import { ProductCategory } from '../types';
import { CategorySection } from './CategorySection';
import { EmptyState } from './EmptyState';
import { LoadingState } from './LoadingState';

export const ShoppingList: React.FC = () => {
  const {
    items,
    isLoadingList,
    addItem,
    setClearConfirmOpen,
    openOrderCheckout,
  } = useShoppingStore();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickName, setQuickName] = useState('');
  const [quickQty, setQuickQty] = useState(1);
  const [quickUnit, setQuickUnit] = useState('piece');

  const activePendingItems = items.filter((i) => !i.completed);
  const activeTotal = activePendingItems.reduce(
    (sum, item) => sum + item.estimatedPrice * item.quantity,
    0
  );

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim()) return;
    await addItem({
      name: quickName.trim(),
      quantity: quickQty,
      unit: quickUnit,
    });
    setQuickName('');
    setQuickQty(1);
    setIsQuickAddOpen(false);
  };

  if (isLoadingList && items.length === 0) {
    return <LoadingState message="Loading your shopping list..." />;
  }

  // Filter items
  let filteredItems = items;
  if (filterCategory !== 'all') {
    filteredItems = filteredItems.filter((i) => i.category === filterCategory);
  }
  if (filterStatus === 'pending') {
    filteredItems = filteredItems.filter((i) => !i.completed);
  } else if (filterStatus === 'completed') {
    filteredItems = filteredItems.filter((i) => i.completed);
  }

  // Group items by category
  const categoriesPresent = Array.from(new Set(filteredItems.map((i) => i.category))) as ProductCategory[];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 space-y-6">
      {/* ========================================================================= */}
      {/* PROMINENT PLACE ORDER / CHECKOUT CALLOUT BANNER */}
      {/* ========================================================================= */}
      {activePendingItems.length > 0 && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-brand-600 via-emerald-600 to-teal-600 text-white shadow-xl shadow-brand-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all animate-in fade-in">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner flex-shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
                  Ready to Order?
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/25 text-white backdrop-blur-sm">
                  ⚡ 25 Min Express
                </span>
              </div>
              <p className="text-xs text-brand-100 mt-0.5">
                {activePendingItems.length} items • Estimated Total: <span className="font-extrabold text-white text-sm">₹{activeTotal}</span>
              </p>
            </div>
          </div>

          <button
            onClick={openOrderCheckout}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 active:scale-95 text-brand-900 text-xs sm:text-sm font-extrabold shadow-lg transition-all flex items-center justify-center gap-2 flex-shrink-0 group"
          >
            <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
            <span>Place Order (₹{activeTotal})</span>
            <ArrowRight className="w-4 h-4 text-brand-600 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* Action and Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs font-medium px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="all">All Categories</option>
            <option value="Dairy">Dairy</option>
            <option value="Produce">Produce</option>
            <option value="Bakery">Bakery</option>
            <option value="Beverages">Beverages</option>
            <option value="Snacks">Snacks</option>
            <option value="Pantry">Pantry</option>
            <option value="Meat">Meat & Eggs</option>
            <option value="Personal Care">Personal Care</option>
            <option value="Household">Household</option>
            <option value="Frozen">Frozen</option>
            <option value="Other">Other</option>
          </select>

          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-900 p-0.5 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filterStatus === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              All ({items.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filterStatus === 'pending'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              To Buy ({activePendingItems.length})
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filterStatus === 'completed'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Done ({items.filter((i) => i.completed).length})
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manual Add</span>
          </button>

          {items.length > 0 && (
            <button
              onClick={() => setClearConfirmOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear List</span>
            </button>
          )}
        </div>
      </div>

      {/* Inline Quick Add Form */}
      {isQuickAddOpen && (
        <form
          onSubmit={handleQuickAdd}
          className="p-4 rounded-2xl bg-brand-50/60 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-900/60 shadow-sm animate-in slide-in-from-top-3 duration-150"
        >
          <div className="text-xs font-bold text-brand-900 dark:text-brand-300 mb-2 flex items-center gap-1.5">
            <ListPlus className="w-4 h-4" /> Quick Add Item to Shopping List
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              required
              placeholder="e.g. Organic Almond Milk"
              value={quickName}
              onChange={(e) => setQuickName(e.target.value)}
              className="flex-1 min-w-[180px] text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <input
              type="number"
              min="1"
              value={quickQty}
              onChange={(e) => setQuickQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
            <select
              value={quickUnit}
              onChange={(e) => setQuickUnit(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              <option value="piece">pieces</option>
              <option value="kg">kg</option>
              <option value="g">grams</option>
              <option value="litre">litres</option>
              <option value="bottle">bottles</option>
              <option value="packet">packets</option>
              <option value="box">boxes</option>
              <option value="dozen">dozen</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-sm"
            >
              Add Item
            </button>
            <button
              type="button"
              onClick={() => setIsQuickAddOpen(false)}
              className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Categorized List or Empty State */}
      {items.length === 0 ? (
        <EmptyState />
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700">
          <CheckCircle2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            No items matching active filter criteria.
          </p>
          <button
            onClick={() => {
              setFilterCategory('all');
              setFilterStatus('all');
            }}
            className="mt-2 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {categoriesPresent.map((category) => {
            const categoryItems = filteredItems.filter((i) => i.category === category);
            return <CategorySection key={category} category={category} items={categoryItems} />;
          })}
        </div>
      )}
    </div>
  );
};
