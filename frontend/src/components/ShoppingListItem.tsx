import React, { useState } from 'react';
import { Check, Trash2, Plus, Minus, Edit3, Save, X } from 'lucide-react';
import { IShoppingItem } from '../types';
import { useShoppingStore } from '../hooks/useShoppingStore';

export const ShoppingListItem: React.FC<{ item: IShoppingItem }> = ({ item }) => {
  const { toggleComplete, updateItem, deleteItem } = useShoppingStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editQuantity, setEditQuantity] = useState(item.quantity);
  const [editUnit, setEditUnit] = useState(item.unit);

  const handleSaveEdit = async () => {
    if (!editName.trim()) return;
    await updateItem(item.id, {
      name: editName,
      quantity: editQuantity,
      unit: editUnit,
    });
    setIsEditing(false);
  };

  const handleIncrement = () => {
    updateItem(item.id, { quantity: item.quantity + 1 });
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateItem(item.id, { quantity: item.quantity - 1 });
    }
  };

  return (
    <div
      className={`group relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 ${
        item.completed
          ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-60'
          : 'bg-white dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700/80 hover:border-brand-300 dark:hover:border-brand-700 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Left side: Checkbox & Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
        {/* Accessible Checkbox */}
        <button
          onClick={() => toggleComplete(item.id)}
          aria-label={item.completed ? `Mark ${item.name} as incomplete` : `Mark ${item.name} as purchased`}
          className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
            item.completed
              ? 'bg-brand-600 border-brand-600 text-white'
              : 'border-slate-300 dark:border-slate-600 hover:border-brand-500 bg-white dark:bg-slate-900'
          }`}
        >
          {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Item Details */}
        {isEditing ? (
          <div className="flex flex-wrap items-center gap-1.5 flex-1">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="text-xs sm:text-sm font-semibold px-2 py-1 rounded-lg border border-brand-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
            <input
              type="number"
              value={editQuantity}
              onChange={(e) => setEditQuantity(Math.max(1, parseFloat(e.target.value) || 1))}
              className="w-16 text-xs font-semibold px-2 py-1 rounded-lg border border-brand-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
            <input
              type="text"
              value={editUnit}
              onChange={(e) => setEditUnit(e.target.value)}
              className="w-20 text-xs font-semibold px-2 py-1 rounded-lg border border-brand-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
            <button
              onClick={handleSaveEdit}
              className="p-1 rounded-lg bg-brand-600 text-white hover:bg-brand-500"
              aria-label="Save changes"
            >
              <Save className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="p-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              aria-label="Cancel editing"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className={`text-sm sm:text-base font-semibold truncate ${
                  item.completed
                    ? 'line-through text-slate-400 dark:text-slate-500'
                    : 'text-slate-900 dark:text-slate-100'
                }`}
              >
                {item.name}
              </span>
              {item.notes && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200/50 dark:border-emerald-900">
                  {item.notes}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {item.quantity} {item.unit}
              </span>
              {item.brand && <span>• {item.brand}</span>}
              {item.estimatedPrice > 0 && (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  • ₹{item.estimatedPrice * item.quantity}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right side: Quick Quantity Controls & Actions */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        {!isEditing && !item.completed && (
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-700/60 p-0.5 border border-slate-200 dark:border-slate-700">
            <button
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
              aria-label={`Decrease quantity of ${item.name}`}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2 text-xs font-bold text-slate-800 dark:text-slate-200 min-w-[1.25rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrement}
              aria-label={`Increase quantity of ${item.name}`}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Edit Button */}
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            aria-label={`Edit ${item.name}`}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Delete Button */}
        <button
          onClick={() => deleteItem(item.id)}
          aria-label={`Remove ${item.name} from list`}
          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
