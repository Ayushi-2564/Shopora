import React, { useState, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  Plus,
  Sparkles,
  HelpCircle,
  Tag,
  Check,
} from 'lucide-react';
import { useShoppingStore } from '../hooks/useShoppingStore';
import { IProduct, ProductCategory } from '../types';

export const ProductSearch: React.FC = () => {
  const {
    products,
    searchResults,
    searchCatalog,
    addItem,
    openSubstituteModal,
    items,
    searchQuery,
  } = useShoppingStore();

  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [organicOnly, setOrganicOnly] = useState<boolean>(false);
  const [dietaryFilter, setDietaryFilter] = useState<string>('none');
  const [onSaleOnly, setOnSaleOnly] = useState<boolean>(false);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchCatalog(localQuery, {
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        maxPrice: maxPrice < 1000 ? maxPrice : undefined,
        organic: organicOnly,
        dietary: dietaryFilter !== 'none' ? dietaryFilter : undefined,
        onSale: onSaleOnly,
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [localQuery, selectedCategory, maxPrice, organicOnly, dietaryFilter, onSaleOnly]);

  const isInList = (productName: string) => {
    return items.some((i) => i.name.toLowerCase() === productName.toLowerCase() && !i.completed);
  };

  const handleAddProduct = (p: IProduct) => {
    addItem({
      name: p.name,
      category: p.category,
      unit: p.unit,
      quantity: 1,
      estimatedPrice: p.salePrice || p.price,
    });
  };

  const displayedProducts = searchResults.length > 0 ? searchResults : products;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Header & Search Bar */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🔍</span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Product Catalog & Voice Search
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Search over 50+ items or use voice commands like "Find organic apples under 200"
        </p>

        {/* Search Input Box */}
        <div className="mt-4 relative flex items-center">
          <Search className="w-5 h-5 absolute left-4 text-slate-400" />
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search by product name, brand, or tag (e.g. Colgate, Almond Milk, Brown Bread)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
          />
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Category Pill buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Category:
          </span>
          {['all', 'Dairy', 'Produce', 'Bakery', 'Beverages', 'Snacks', 'Pantry', 'Meat', 'Personal Care', 'Household', 'Frozen'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-sm font-semibold'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* Secondary Filters: Price, Organic, Sale */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-700">
          {/* Price Range Slider */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Under: ₹{maxPrice}
            </span>
            <input
              type="range"
              min="50"
              max="1000"
              step="25"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
              className="w-24 accent-brand-600"
            />
          </div>

          {/* Organic Filter */}
          <button
            onClick={() => setOrganicOnly(!organicOnly)}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
              organicOnly
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            🌿 Organic
          </button>

          {/* On Sale */}
          <button
            onClick={() => setOnSaleOnly(!onSaleOnly)}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
              onSaleOnly
                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            🏷️ On Sale
          </button>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedProducts.map((product) => {
          const inCart = isInList(product.name);
          const hasSubstitutes = product.substituteIds && product.substituteIds.length > 0;

          return (
            <div
              key={product.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-brand-300 dark:hover:border-brand-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-2xl">{product.imageIcon || '📦'}</span>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {product.onSale && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                        <Tag className="w-3 h-3" /> Sale
                      </span>
                    )}
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                      {product.category}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {product.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {product.brand} {product.size ? `• ${product.size}` : ''}
                  </p>

                  {/* Dietary & Characteristic Tags */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.dietaryTags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400 capitalize"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Add to List Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    ₹{product.salePrice || product.price}
                    {product.salePrice && (
                      <span className="text-xs font-normal line-through text-slate-400">
                        ₹{product.price}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">per {product.unit}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Substitute Options */}
                  {hasSubstitutes && (
                    <button
                      onClick={() => openSubstituteModal(product)}
                      title="View healthy or dietary alternatives"
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                    </button>
                  )}

                  {/* Add Button */}
                  <button
                    onClick={() => handleAddProduct(product)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      inCart
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
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
              </div>
            </div>
          );
        })}
      </div>

      {displayedProducts.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700">
          <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No products found matching your search.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Try adjusting your search terms, price filter, or clear category filters.
          </p>
        </div>
      )}
    </div>
  );
};
