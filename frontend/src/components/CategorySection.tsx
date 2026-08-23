import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { IShoppingItem, ProductCategory } from '../types';
import { ShoppingListItem } from './ShoppingListItem';

const CATEGORY_EMOJIS: Record<ProductCategory, string> = {
  Produce: '🍎',
  Dairy: '🥛',
  Meat: '🍗',
  Bakery: '🍞',
  Beverages: '🧃',
  Snacks: '🍿',
  Pantry: '🍚',
  Household: '🧼',
  'Personal Care': '🪥',
  Frozen: '🧊',
  Other: '📦',
};

interface CategorySectionProps {
  category: ProductCategory;
  items: IShoppingItem[];
}

export const CategorySection: React.FC<CategorySectionProps> = ({ category, items }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const emoji = CATEGORY_EMOJIS[category] || '📦';
  const categorySubtotal = items.reduce((acc, curr) => acc + (curr.estimatedPrice || 0) * (curr.quantity || 1), 0);
  const completedCount = items.filter((i) => i.completed).length;

  return (
    <div className="mb-6 last:mb-0">
      {/* Category Header */}
      <div className="flex items-center justify-between py-2 px-1 mb-2">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 text-left group"
          aria-expanded={!isCollapsed}
        >
          <span className="text-xl">{emoji}</span>
          <span className="font-bold text-base sm:text-lg text-slate-800 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {category}
          </span>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-200/70 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
          {completedCount > 0 && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              ({completedCount} done)
            </span>
          )}
          {isCollapsed ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          )}
        </button>

        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Est. ₹{categorySubtotal}
        </span>
      </div>

      {/* Items in Category */}
      {!isCollapsed && (
        <div className="space-y-2.5">
          {items.map((item) => (
            <ShoppingListItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
