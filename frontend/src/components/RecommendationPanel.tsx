import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  Clock,
  Plus,
  Flame,
  Check,
  Sun,
  ShieldCheck,
  Utensils,
  Coffee,
  SunMedium,
  Moon,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { useShoppingStore } from '../hooks/useShoppingStore';
import { IRecommendation, IMealCombo } from '../types';

export const RecommendationPanel: React.FC = () => {
  const {
    recommendations,
    isLoadingRecommendations,
    addItem,
    addMealComboToList,
    items,
    fetchRecommendations,
  } = useShoppingStore();

  const [activeMealTab, setActiveMealTab] = useState<'all' | 'breakfast' | 'lunch' | 'dinner'>('all');

  const isInList = (productName: string) => {
    return items.some((i) => i.name.toLowerCase() === productName.toLowerCase() && !i.completed);
  };

  const handleAdd = (rec: IRecommendation) => {
    addItem({
      name: rec.product.name,
      category: rec.product.category,
      unit: rec.product.unit,
      quantity: 1,
      estimatedPrice: rec.product.salePrice || rec.product.price,
    });
  };

  const { replenishment, frequent, seasonal, preferencesBased, mealCombos = [] } = recommendations;

  const filteredCombos =
    activeMealTab === 'all'
      ? mealCombos
      : mealCombos.filter((c) => c.mealType === activeMealTab);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Smart Picks & Healthy Meal Combos
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Intelligent replenishment, curated dietitian-approved breakfast/lunch/dinner bundles, and seasonal recommendations.
          </p>
        </div>

        <button
          onClick={() => fetchRecommendations()}
          disabled={isLoadingRecommendations}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRecommendations ? 'animate-spin' : ''}`} />
          <span>Refresh Analysis</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: CURATED HEALTHY MEAL COMBOS (Breakfast, Lunch, Dinner) */}
      {/* ========================================================================= */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Healthy Curated Meal Combos
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                1-click grocery bundles for healthy eating throughout your day
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveMealTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeMealTab === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All Combos
            </button>
            <button
              onClick={() => setActiveMealTab('breakfast')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                activeMealTab === 'breakfast'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Coffee className="w-3 h-3 text-amber-500" /> Breakfast
            </button>
            <button
              onClick={() => setActiveMealTab('lunch')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                activeMealTab === 'lunch'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <SunMedium className="w-3 h-3 text-orange-500" /> Lunch
            </button>
            <button
              onClick={() => setActiveMealTab('dinner')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                activeMealTab === 'dinner'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Moon className="w-3 h-3 text-indigo-500" /> Dinner
            </button>
          </div>
        </div>

        {/* Combos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCombos.map((combo) => (
            <div
              key={combo.id}
              className="rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group"
            >
              {/* Photo Banner */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
                <img
                  src={combo.imageUrl}
                  alt={combo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

                {/* Badges on image */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur-md shadow-sm">
                    {combo.mealType}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-500 text-white shadow-sm">
                    {combo.calories}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="text-base font-extrabold leading-tight drop-shadow-sm">
                    {combo.title}
                  </h4>
                  <p className="text-[11px] text-slate-200 mt-0.5 truncate drop-shadow-sm">
                    {combo.tagline}
                  </p>
                </div>
              </div>

              {/* Combo Content & Item List */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                    {combo.description}
                  </p>

                  {/* Dietary Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {combo.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Items included */}
                  <div className="space-y-1.5 mb-4 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                      <Layers className="w-3 h-3" /> Includes {combo.items.length} Fresh Items:
                    </div>
                    {combo.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-200"
                      >
                        <span className="truncate pr-2">
                          • {item.quantity} {item.unit} {item.name}
                        </span>
                        <span className="font-semibold text-slate-500 dark:text-slate-400 flex-shrink-0">
                          ₹{item.estimatedPrice}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price & 1-Click Add Combo Button */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 leading-none">
                      ₹{combo.bundlePrice}
                      <span className="text-xs font-normal line-through text-slate-400">
                        ₹{combo.originalPrice}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      Save ₹{combo.originalPrice - combo.bundlePrice} Bundle
                    </span>
                  </div>

                  <button
                    onClick={() => addMealComboToList(combo)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 active:scale-95 text-white text-xs font-bold shadow-md shadow-brand-600/30 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Add Full Combo</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: REPLENISHMENT & LOW-STOCK ALERTS */}
      {/* ========================================================================= */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-amber-500" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Replenishment & Low-Stock Alerts
          </h3>
        </div>

        {replenishment.length === 0 ? (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-500">
            No items are currently due for replenishment. Your stock levels look good!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {replenishment.map((rec) => {
              const inCart = isInList(rec.product.name);
              return (
                <div
                  key={rec.product.id}
                  className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/60 to-white dark:from-slate-800 dark:to-slate-850 border border-amber-200/80 dark:border-amber-900/60 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-700 shadow-sm flex-shrink-0">
                          <img
                            src={rec.product.imageUrl || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80'}
                            alt={rec.product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {rec.product.name}
                          </h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {rec.product.brand} • {rec.product.category}
                          </span>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex-shrink-0">
                        {rec.badge || 'Running Low'}
                      </span>
                    </div>

                    <div className="mt-3 p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/70 border border-amber-100 dark:border-amber-950 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2">
                      <span className="text-amber-500 font-bold">🧠</span>
                      <span>{rec.reason}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-amber-100 dark:border-slate-700/60 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      ₹{rec.product.salePrice || rec.product.price}{' '}
                      <span className="text-[10px] font-normal text-slate-400">/ {rec.product.unit}</span>
                    </span>

                    <button
                      onClick={() => handleAdd(rec)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        inCart
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm'
                      }`}
                    >
                      {inCart ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Added to List
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" /> Add to List
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

      {/* ========================================================================= */}
      {/* SECTION 3: FRESH SEASONAL PICKS */}
      {/* ========================================================================= */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sun className="w-4 h-4 text-emerald-500" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Fresh Seasonal Recommendations
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {seasonal.slice(0, 4).map((rec) => {
            const inCart = isInList(rec.product.name);
            return (
              <div
                key={rec.product.id}
                className="rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col justify-between group"
              >
                <div className="relative h-32 w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
                  <img
                    src={rec.product.imageUrl || 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80'}
                    alt={rec.product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-sm">
                      {rec.badge || 'In Season'}
                    </span>
                  </div>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {rec.product.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {rec.product.category}
                    </p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 italic">
                      {rec.reason}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      ₹{rec.product.salePrice || rec.product.price}
                    </span>

                    <button
                      onClick={() => handleAdd(rec)}
                      className={`p-1.5 rounded-xl text-xs font-bold transition-all ${
                        inCart
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-brand-600 hover:bg-brand-500 text-white shadow-sm'
                      }`}
                    >
                      {inCart ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 4: FREQUENTLY PURCHASED ITEMS */}
      {/* ========================================================================= */}
      {frequent.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-4 h-4 text-rose-500" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Frequently Bought By You
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {frequent.map((rec) => {
              const inCart = isInList(rec.product.name);
              return (
                <div
                  key={rec.product.id}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0">
                      <img
                        src={rec.product.imageUrl || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80'}
                        alt={rec.product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {rec.product.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate">
                        ₹{rec.product.salePrice || rec.product.price} • {rec.product.category}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAdd(rec)}
                    className={`flex-shrink-0 p-2 rounded-xl text-xs font-bold transition-all ${
                      inCart
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-brand-600 text-white hover:bg-brand-500 shadow-sm'
                    }`}
                  >
                    {inCart ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: PERSONALIZED DIETARY FAVORITES */}
      {/* ========================================================================= */}
      {preferencesBased.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-purple-500" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Personalized Dietary & Brand Favorites
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {preferencesBased.map((rec) => {
              const inCart = isInList(rec.product.name);
              return (
                <div
                  key={rec.product.id}
                  className="rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col justify-between group"
                >
                  <div className="relative h-28 w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
                    <img
                      src={rec.product.imageUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80'}
                      alt={rec.product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-600 text-white shadow-sm">
                        {rec.badge}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {rec.product.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                        {rec.reason}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        ₹{rec.product.salePrice || rec.product.price}
                      </span>

                      <button
                        onClick={() => handleAdd(rec)}
                        className={`p-1.5 rounded-xl text-xs font-bold transition-all ${
                          inCart
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-purple-600 hover:bg-purple-500 text-white shadow-sm'
                        }`}
                      >
                        {inCart ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
