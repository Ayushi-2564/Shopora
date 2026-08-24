import React, { useEffect } from 'react';
import {
  ListOrdered,
  Search,
  Sparkles,
  History as HistoryIcon,
  Mic,
  Plus,
} from 'lucide-react';
import { useShoppingStore } from './hooks/useShoppingStore';
import { Navbar } from './components/Navbar';
import { VoiceAssistant } from './components/VoiceAssistant';
import { StatsCards } from './components/StatsCards';
import { ShoppingList } from './components/ShoppingList';
import { ProductSearch } from './components/ProductSearch';
import { RecommendationPanel } from './components/RecommendationPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { PreferencesModal } from './components/PreferencesModal';
import { SubstituteModal } from './components/SubstituteModal';
import { ClearConfirmModal } from './components/ClearConfirmModal';
import { OrderCheckoutModal } from './components/OrderCheckoutModal';
import { ConfirmationToast } from './components/ConfirmationToast';

export const App: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    fetchInitialData,
    stats,
  } = useShoppingStore();

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-brand-500 selection:text-white pb-20 md:pb-8 transition-colors">
      {/* Top Navbar */}
      <Navbar />

      {/* Hero Voice Command Area */}
      <VoiceAssistant />

      {/* Dashboard Stats */}
      <StatsCards />

      {/* Main Tab Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto">
        {activeTab === 'list' && <ShoppingList />}
        {activeTab === 'search' && <ProductSearch />}
        {activeTab === 'recommendations' && <RecommendationPanel />}
        {activeTab === 'history' && <HistoryPanel />}
      </main>

      {/* Modals & Dialogs */}
      <PreferencesModal />
      <SubstituteModal />
      <ClearConfirmModal />
      <OrderCheckoutModal />

      {/* Floating Notifications */}
      <ConfirmationToast />

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('list')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeTab === 'list'
              ? 'text-brand-600 dark:text-brand-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <div className="relative">
            <ListOrdered className="w-5 h-5" />
            {stats.totalItems > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-brand-600 text-white text-[9px] font-bold flex items-center justify-center">
                {stats.totalItems}
              </span>
            )}
          </div>
          <span>List</span>
        </button>

        <button
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeTab === 'search'
              ? 'text-brand-600 dark:text-brand-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Search className="w-5 h-5" />
          <span>Search</span>
        </button>

        <button
          onClick={() => setActiveTab('recommendations')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeTab === 'recommendations'
              ? 'text-brand-600 dark:text-brand-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>Smart Picks</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeTab === 'history'
              ? 'text-brand-600 dark:text-brand-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <HistoryIcon className="w-5 h-5" />
          <span>History</span>
        </button>
      </div>
    </div>
  );
};

export default App;
