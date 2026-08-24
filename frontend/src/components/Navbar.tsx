import React from 'react';
import {
  ShoppingCart,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Settings,
  RotateCcw,
  Sparkles,
  Search,
  History,
  ListOrdered,
} from 'lucide-react';
import { useShoppingStore } from '../hooks/useShoppingStore';
import { LanguageSelector } from './LanguageSelector';

export const Navbar: React.FC = () => {
  const {
    stats,
    darkMode,
    toggleDarkMode,
    preferences,
    toggleTTS,
    setPreferencesOpen,
    resetDemoData,
    activeTab,
    setActiveTab,
  } = useShoppingStore();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                Shop<span className="text-brand-600 dark:text-brand-400">ora</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                Voice AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              {stats.totalItems} items • ₹{stats.estimatedTotal} est.
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop & Tablet) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/70 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'list'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            Shopping List ({stats.totalItems})
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'search'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Catalog & Search
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'recommendations'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Smart Picks
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            History
          </button>
        </nav>

        {/* Right Controls: Language, TTS, Theme, Preferences */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <LanguageSelector />

          {/* TTS Audio toggle */}
          <button
            onClick={toggleTTS}
            title={preferences.enableTTS ? 'Voice confirmations enabled' : 'Voice confirmations muted'}
            aria-label="Toggle voice spoken feedback"
            className={`p-2 rounded-xl border transition-colors ${
              preferences.enableTTS
                ? 'bg-brand-50 border-brand-200 text-brand-600 dark:bg-brand-950/40 dark:border-brand-800 dark:text-brand-400'
                : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700'
            }`}
          >
            {preferences.enableTTS ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            title="Toggle theme"
            aria-label="Toggle dark mode"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Preferences Button */}
          <button
            onClick={() => setPreferencesOpen(true)}
            title="User Preferences"
            aria-label="Open User Preferences"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={resetDemoData}
            title="Reset sample demo data"
            aria-label="Reset demo sample data"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
