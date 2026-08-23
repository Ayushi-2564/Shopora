import React, { useState } from 'react';
import { Settings, X, Check, Globe, Utensils, Tag, IndianRupee, Volume2 } from 'lucide-react';
import { useShoppingStore } from '../hooks/useShoppingStore';
import { ProductCategory, SupportedLanguage } from '../types';

export const PreferencesModal: React.FC = () => {
  const {
    isPreferencesOpen,
    setPreferencesOpen,
    preferences,
    updatePreferences,
  } = useShoppingStore();

  const [dietary, setDietary] = useState(preferences.dietaryPreference);
  const [budget, setBudget] = useState(preferences.budget);
  const [enableTTS, setEnableTTS] = useState(preferences.enableTTS);
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>(preferences.favoriteCategories);

  if (!isPreferencesOpen) return null;

  const categoriesList: ProductCategory[] = [
    'Dairy',
    'Produce',
    'Bakery',
    'Beverages',
    'Snacks',
    'Pantry',
    'Meat',
    'Personal Care',
    'Household',
    'Frozen',
  ];

  const handleToggleCategory = (cat: ProductCategory) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSave = async () => {
    await updatePreferences({
      dietaryPreference: dietary,
      budget,
      enableTTS,
      favoriteCategories: selectedCategories,
    });
    setPreferencesOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-900 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Shopping Preferences & Settings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personalize recommendations, dietary tags, and voice responses.
              </p>
            </div>
          </div>

          <button
            onClick={() => setPreferencesOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
            aria-label="Close preferences"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-5">
          {/* 1. Dietary Preference */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
              <Utensils className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              Dietary Preference
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'none', label: 'No Preference' },
                { id: 'vegetarian', label: 'Vegetarian' },
                { id: 'vegan', label: 'Vegan' },
                { id: 'gluten-free', label: 'Gluten-Free' },
              ].map((diet) => (
                <button
                  key={diet.id}
                  type="button"
                  onClick={() => setDietary(diet.id as any)}
                  className={`p-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                    dietary === diet.id
                      ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-700 dark:text-brand-300 ring-2 ring-brand-500/20'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {diet.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Monthly Budget Goal */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
              <IndianRupee className="w-3.5 h-3.5 text-amber-500" />
              Target Shopping Budget: ₹{budget}
            </label>
            <input
              type="range"
              min="500"
              max="10000"
              step="100"
              value={budget}
              onChange={(e) => setBudget(parseInt(e.target.value, 10))}
              className="w-full accent-brand-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹500</span>
              <span>₹5,000</span>
              <span>₹10,000</span>
            </div>
          </div>

          {/* 3. Favorite Categories */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
              <Tag className="w-3.5 h-3.5 text-purple-500" />
              Favorite Categories (Influences Smart Picks)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categoriesList.map((cat) => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleToggleCategory(cat)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-400 text-purple-700 dark:text-purple-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Spoken Voice Feedback (TTS) */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Spoken Audio Confirmations
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Read aloud confirmation after every voice command
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEnableTTS(!enableTTS)}
              aria-label="Toggle spoken audio feedback"
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                enableTTS ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  enableTTS ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
          <button
            onClick={() => setPreferencesOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/30 transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
