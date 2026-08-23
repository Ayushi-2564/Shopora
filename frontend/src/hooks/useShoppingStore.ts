import { create } from 'zustand';
import {
  IShoppingItem,
  IProduct,
  IRecommendation,
  IMealCombo,
  IShoppingHistory,
  IUserPreferences,
  IOrder,
  ShoppingStats,
  ParsedVoiceCommand,
  SupportedLanguage,
} from '../types';
import { api } from '../services/api';

interface ToastInfo {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  subMessage?: string;
  actionText?: string;
  onAction?: () => void;
}

interface ShoppingStoreState {
  // Shopping list
  items: IShoppingItem[];
  stats: ShoppingStats;
  isLoadingList: boolean;

  // Products
  products: IProduct[];
  isLoadingProducts: boolean;
  searchQuery: string;
  searchResults: IProduct[];
  isSearching: boolean;

  // Recommendations & Replenishment & Combos
  recommendations: {
    replenishment: IRecommendation[];
    frequent: IRecommendation[];
    seasonal: IRecommendation[];
    preferencesBased: IRecommendation[];
    mealCombos: IMealCombo[];
  };
  isLoadingRecommendations: boolean;

  // History
  history: IShoppingHistory[];
  isLoadingHistory: boolean;

  // Orders
  isOrderCheckoutOpen: boolean;
  placedOrder: IOrder | null;
  isPlacingOrder: boolean;

  // Preferences
  preferences: IUserPreferences;
  darkMode: boolean;

  // Voice Interaction State
  activeVoiceParsed: ParsedVoiceCommand | null;
  voiceProcessingState: 'idle' | 'listening' | 'processing' | 'success' | 'error';
  voiceStatusMessage: string;

  // Modals & UI View
  activeTab: 'list' | 'search' | 'recommendations' | 'history';
  isPreferencesOpen: boolean;
  isSubstituteModalOpen: boolean;
  selectedProductForSubstitutes: IProduct | null;
  substitutesList: IProduct[];
  isClearConfirmOpen: boolean;

  // Toast
  toasts: ToastInfo[];

  // Actions
  fetchInitialData: () => Promise<void>;
  fetchShoppingList: () => Promise<void>;
  addItem: (data: { name: string; quantity?: number; unit?: string; category?: string; estimatedPrice?: number }) => Promise<IShoppingItem | null>;
  addMealComboToList: (combo: IMealCombo) => Promise<void>;
  updateItem: (id: string, updates: Partial<IShoppingItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  clearList: () => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;

  // Order Actions
  openOrderCheckout: () => void;
  closeOrderCheckout: () => void;
  submitPlaceOrder: (options?: { deliveryAddress?: string; paymentMethod?: 'UPI' | 'Card' | 'COD' }) => Promise<IOrder | null>;

  // Voice Actions
  processVoiceTranscript: (transcript: string) => Promise<ParsedVoiceCommand | null>;
  setVoiceProcessingState: (state: 'idle' | 'listening' | 'processing' | 'success' | 'error', msg?: string) => void;
  clearActiveVoiceParsed: () => void;

  // Search & Catalog
  searchCatalog: (query: string, filters?: any) => Promise<void>;
  setSearchQuery: (query: string) => void;

  // Recommendations & History
  fetchRecommendations: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  buyAgain: (historyItem: IShoppingHistory) => Promise<void>;

  // Preferences & Settings
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
  updatePreferences: (updates: Partial<IUserPreferences>) => Promise<void>;
  toggleDarkMode: () => void;
  toggleTTS: () => Promise<void>;

  // Substitutes & Modals
  openSubstituteModal: (product: IProduct) => Promise<void>;
  closeSubstituteModal: () => void;
  setActiveTab: (tab: 'list' | 'search' | 'recommendations' | 'history') => void;
  setPreferencesOpen: (open: boolean) => void;
  setClearConfirmOpen: (open: boolean) => void;

  // Toast helper
  showToast: (toast: Omit<ToastInfo, 'id'>) => void;
  dismissToast: (id: string) => void;
  resetDemoData: () => Promise<void>;
}

export const useShoppingStore = create<ShoppingStoreState>((set, get) => ({
  items: [],
  stats: { totalItems: 0, completedItems: 0, categoriesCount: 0, estimatedTotal: 0 },
  isLoadingList: false,

  products: [],
  isLoadingProducts: false,
  searchQuery: '',
  searchResults: [],
  isSearching: false,

  recommendations: {
    replenishment: [],
    frequent: [],
    seasonal: [],
    preferencesBased: [],
    mealCombos: [],
  },
  isLoadingRecommendations: false,

  history: [],
  isLoadingHistory: false,

  isOrderCheckoutOpen: false,
  placedOrder: null,
  isPlacingOrder: false,

  preferences: {
    userId: 'default-user',
    language: 'en-US',
    dietaryPreference: 'none',
    preferredBrands: ['Amul', 'Tata Sampann', 'Organic Tattva', 'Haldiram\'s'],
    favoriteCategories: ['Dairy', 'Produce', 'Beverages', 'Bakery', 'Snacks'],
    budget: 2500,
    enableTTS: true,
  },
  darkMode: false,

  activeVoiceParsed: null,
  voiceProcessingState: 'idle',
  voiceStatusMessage: 'Tap microphone to speak',

  activeTab: 'list',
  isPreferencesOpen: false,
  isSubstituteModalOpen: false,
  selectedProductForSubstitutes: null,
  substitutesList: [],
  isClearConfirmOpen: false,

  toasts: [],

  // Toast Helpers
  showToast: (toast) => {
    const id = 'toast-' + Date.now();
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));

    setTimeout(() => {
      get().dismissToast(id);
    }, 4500);
  },

  dismissToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  // Reset Demo
  resetDemoData: async () => {
    try {
      await api.resetDemoData();
      await get().fetchInitialData();
      get().showToast({
        type: 'info',
        message: 'Demo store reset to initial sample state.',
      });
    } catch (err: any) {
      console.error('Reset demo error:', err);
    }
  },

  // Fetch initial data
  fetchInitialData: async () => {
    await Promise.all([
      get().fetchShoppingList(),
      get().fetchRecommendations(),
      get().fetchHistory(),
      (async () => {
        try {
          const prods = await api.getProducts();
          set({ products: prods, searchResults: prods });
        } catch (e) {
          console.warn('Failed to load products:', e);
        }
      })(),
      (async () => {
        try {
          const prefs = await api.getPreferences();
          set({ preferences: prefs });
        } catch (e) {
          console.warn('Failed to load preferences:', e);
        }
      })(),
    ]);
  },

  fetchShoppingList: async () => {
    set({ isLoadingList: true });
    try {
      const data = await api.getShoppingList();
      set({ items: data.items, stats: data.stats });
    } catch (err: any) {
      console.error('Failed to fetch list:', err);
    } finally {
      set({ isLoadingList: false });
    }
  },

  addItem: async (data) => {
    try {
      const newItem = await api.addShoppingItem(data);
      await get().fetchShoppingList();
      get().showToast({
        type: 'success',
        message: `✓ Added ${newItem.quantity} ${newItem.unit} of ${newItem.name}`,
        subMessage: `Category: ${newItem.category} • Est. ₹${newItem.estimatedPrice * newItem.quantity}`,
      });
      return newItem;
    } catch (err: any) {
      get().showToast({
        type: 'error',
        message: `Failed to add item: ${err.message || 'Unknown error'}`,
      });
      return null;
    }
  },

  addMealComboToList: async (combo) => {
    try {
      const itemsToAdd = combo.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        category: item.category,
        estimatedPrice: item.estimatedPrice,
      }));

      await api.bulkAddShoppingItems(itemsToAdd);
      await get().fetchShoppingList();
      get().showToast({
        type: 'success',
        message: `✓ Added ${combo.title} (${combo.items.length} items)`,
        subMessage: `Bundle Total: ₹${combo.bundlePrice} • Enjoy healthy eating!`,
      });
      set({ activeTab: 'list' });
    } catch (err: any) {
      get().showToast({
        type: 'error',
        message: `Failed to add meal combo: ${err.message || 'Error'}`,
      });
    }
  },

  updateItem: async (id, updates) => {
    try {
      await api.updateShoppingItem(id, updates);
      await get().fetchShoppingList();
    } catch (err: any) {
      console.error('Update item failed:', err);
    }
  },

  deleteItem: async (id) => {
    const existing = get().items.find((i) => i.id === id);
    try {
      await api.deleteShoppingItem(id);
      await get().fetchShoppingList();
      get().showToast({
        type: 'info',
        message: `Removed ${existing?.name || 'item'} from your list`,
      });
    } catch (err: any) {
      console.error('Delete item failed:', err);
    }
  },

  clearList: async () => {
    try {
      await api.clearShoppingList();
      await get().fetchShoppingList();
      set({ isClearConfirmOpen: false });
      get().showToast({
        type: 'info',
        message: 'Shopping list cleared',
      });
    } catch (err: any) {
      console.error('Clear list failed:', err);
    }
  },

  toggleComplete: async (id) => {
    const item = get().items.find((i) => i.id === id);
    if (!item) return;

    const newCompleted = !item.completed;
    await get().updateItem(id, { completed: newCompleted });

    if (newCompleted) {
      try {
        await api.addHistoryRecord({
          productId: item.productId,
          productName: item.name,
          category: item.category,
          quantity: item.quantity,
          unit: item.unit,
          price: item.estimatedPrice * item.quantity,
        });
        get().showToast({
          type: 'success',
          message: `Purchased ${item.name}! Added to history.`,
        });
        get().fetchHistory();
        get().fetchRecommendations();
      } catch (_) {}
    }
  },

  // Place Order Actions
  openOrderCheckout: () => {
    const active = get().items.filter((i) => !i.completed);
    if (active.length === 0) {
      get().showToast({
        type: 'warning',
        message: 'Your shopping list is empty!',
        subMessage: 'Add some items before placing an order.',
      });
      return;
    }
    set({ isOrderCheckoutOpen: true });
  },

  closeOrderCheckout: () => {
    set({ isOrderCheckoutOpen: false, placedOrder: null });
  },

  submitPlaceOrder: async (options = {}) => {
    set({ isPlacingOrder: true });
    try {
      const res = await api.placeOrder({
        deliveryAddress: options.deliveryAddress,
        paymentMethod: options.paymentMethod || 'UPI',
      });
      const order = res.data as IOrder;
      set({ placedOrder: order, isPlacingOrder: false });
      await get().fetchShoppingList();
      await get().fetchHistory();
      get().showToast({
        type: 'success',
        message: `🎉 Order #${order.orderNumber} Placed Successfully!`,
        subMessage: `Total ₹${order.total} • ⚡ Express delivery in ${order.estimatedDeliveryMins} mins`,
      });
      return order;
    } catch (err: any) {
      set({ isPlacingOrder: false });
      get().showToast({
        type: 'error',
        message: 'Failed to place order: ' + (err.message || 'Error'),
      });
      return null;
    }
  },

  // Voice Transcript Processing
  processVoiceTranscript: async (transcript) => {
    if (!transcript.trim()) return null;

    set({ voiceProcessingState: 'processing', voiceStatusMessage: 'Analyzing command...' });

    try {
      const response = await api.parseVoiceCommand(
        transcript,
        get().preferences.language,
        true // autoExecute on server
      );

      const { parsed, executionResult } = response;
      set({ activeVoiceParsed: parsed, voiceProcessingState: 'success' });

      // Handle UI feedback based on intent
      switch (parsed.intent) {
        case 'ADD_ITEM':
          await get().fetchShoppingList();
          get().showToast({
            type: 'success',
            message: `✓ Added ${parsed.quantity || 1} ${parsed.unit || 'piece'} of ${parsed.item}`,
            subMessage: `Category: ${parsed.category} • Action detected: Add Item`,
          });
          set({ activeTab: 'list' });
          break;

        case 'PLACE_ORDER':
          set({ isOrderCheckoutOpen: true });
          get().showToast({
            type: 'success',
            message: '⚡ Opening Checkout to Place Your Order',
            subMessage: 'Review your items and confirm instant delivery',
          });
          break;

        case 'REMOVE_ITEM':
          await get().fetchShoppingList();
          get().showToast({
            type: 'info',
            message: `✓ Removed ${parsed.item || 'item'}`,
            subMessage: 'Action detected: Remove Item',
          });
          break;

        case 'UPDATE_ITEM':
          await get().fetchShoppingList();
          get().showToast({
            type: 'info',
            message: `✓ Updated ${parsed.item} quantity to ${parsed.quantity}`,
            subMessage: 'Action detected: Update Item',
          });
          break;

        case 'COMPLETE_ITEM':
          await get().fetchShoppingList();
          await get().fetchHistory();
          get().showToast({
            type: 'success',
            message: `✓ Marked ${parsed.item} as purchased`,
            subMessage: 'Action detected: Complete Item',
          });
          break;

        case 'SEARCH_PRODUCT':
        case 'FILTER_PRODUCT':
          set({
            activeTab: 'search',
            searchQuery: parsed.filters?.query || parsed.item || '',
            searchResults: executionResult?.products || [],
          });
          get().showToast({
            type: 'info',
            message: `Found ${executionResult?.count || 0} product(s)`,
            subMessage: 'Action detected: Product Search',
          });
          break;

        case 'CLEAR_LIST':
          set({ isClearConfirmOpen: true });
          break;

        case 'GET_RECOMMENDATIONS':
          await get().fetchRecommendations();
          set({ activeTab: 'recommendations' });
          get().showToast({
            type: 'info',
            message: 'Viewing Smart Recommendations & Healthy Meal Combos',
          });
          break;

        case 'SHOW_LIST':
          set({ activeTab: 'list' });
          break;

        case 'UNKNOWN':
        default:
          get().showToast({
            type: 'warning',
            message: "I couldn't recognize that command.",
            subMessage: 'Try: "Add 2 boxes of nan khatai", "2 bottle milk order karo", or "Place my order"',
          });
          break;
      }

      return parsed;
    } catch (err: any) {
      set({ voiceProcessingState: 'error', voiceStatusMessage: 'Failed to process voice command.' });
      get().showToast({
        type: 'error',
        message: 'Voice processing error: ' + (err.message || 'Network issue'),
      });
      return null;
    }
  },

  setVoiceProcessingState: (state, msg) => {
    set({
      voiceProcessingState: state,
      voiceStatusMessage: msg || (state === 'listening' ? 'Listening...' : 'Tap microphone to speak'),
    });
  },

  clearActiveVoiceParsed: () => set({ activeVoiceParsed: null }),

  // Search & Catalog
  searchCatalog: async (query, filters = {}) => {
    set({ isSearching: true, searchQuery: query });
    try {
      const results = await api.searchProducts({ q: query, ...filters });
      set({ searchResults: results });
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      set({ isSearching: false });
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  // Recommendations & History
  fetchRecommendations: async () => {
    set({ isLoadingRecommendations: true });
    try {
      const recs = await api.getRecommendations();
      set({ recommendations: recs });
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      set({ isLoadingRecommendations: false });
    }
  },

  fetchHistory: async () => {
    set({ isLoadingHistory: true });
    try {
      const hist = await api.getHistory();
      set({ history: hist });
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      set({ isLoadingHistory: false });
    }
  },

  buyAgain: async (historyItem) => {
    await get().addItem({
      name: historyItem.productName,
      quantity: historyItem.quantity || 1,
      unit: historyItem.unit,
      category: historyItem.category,
      estimatedPrice: historyItem.price / (historyItem.quantity || 1),
    });
  },

  // Preferences & Settings
  setLanguage: async (lang) => {
    try {
      const updated = await api.updatePreferences({ language: lang });
      set({ preferences: updated });
      get().showToast({
        type: 'info',
        message: `Voice language set to ${lang}`,
      });
    } catch (err) {
      console.error('Failed to update language:', err);
    }
  },

  updatePreferences: async (updates) => {
    try {
      const updated = await api.updatePreferences(updates);
      set({ preferences: updated });
      await get().fetchRecommendations();
      get().showToast({
        type: 'success',
        message: 'Preferences updated successfully',
      });
    } catch (err) {
      console.error('Failed to update preferences:', err);
    }
  },

  toggleDarkMode: () => {
    set((state) => {
      const nextMode = !state.darkMode;
      if (nextMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { darkMode: nextMode };
    });
  },

  toggleTTS: async () => {
    const current = get().preferences.enableTTS;
    await get().updatePreferences({ enableTTS: !current });
  },

  // Substitutes Modal
  openSubstituteModal: async (product) => {
    set({ selectedProductForSubstitutes: product, isSubstituteModalOpen: true });
    try {
      const subs = await api.getProductSubstitutes(product.id);
      set({ substitutesList: subs });
    } catch (err) {
      console.error('Failed to load substitutes:', err);
    }
  },

  closeSubstituteModal: () => {
    set({ isSubstituteModalOpen: false, selectedProductForSubstitutes: null, substitutesList: [] });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setPreferencesOpen: (open) => set({ isPreferencesOpen: open }),
  setClearConfirmOpen: (open) => set({ isClearConfirmOpen: open }),
}));
