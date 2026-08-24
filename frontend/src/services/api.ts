import axios from 'axios';
import {
  IProduct,
  IShoppingItem,
  IShoppingHistory,
  IUserPreferences,
  IRecommendation,
  IMealCombo,
  ParsedVoiceCommand,
  ShoppingStats,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Health
  checkHealth: async () => {
    const res = await client.get('/health');
    return res.data;
  },

  // Reset Demo
  resetDemoData: async () => {
    const res = await client.post('/reset-demo');
    return res.data;
  },

  // Voice Command Parsing
  parseVoiceCommand: async (transcript: string, language: string, autoExecute = false): Promise<{ parsed: ParsedVoiceCommand; executionResult?: any }> => {
    const res = await client.post('/voice/parse', {
      transcript,
      language,
      autoExecute,
    });
    return res.data.data;
  },

  // Shopping List
  getShoppingList: async (): Promise<{ items: IShoppingItem[]; stats: ShoppingStats }> => {
    const res = await client.get('/shopping-list');
    return res.data.data;
  },

  addShoppingItem: async (data: {
    name: string;
    quantity?: number;
    unit?: string;
    category?: string;
    brand?: string;
    estimatedPrice?: number;
    notes?: string;
  }): Promise<IShoppingItem> => {
    const res = await client.post('/shopping-list', data);
    return res.data.data;
  },

  bulkAddShoppingItems: async (items: Array<{
    name: string;
    quantity?: number;
    unit?: string;
    category?: string;
    estimatedPrice?: number;
  }>): Promise<IShoppingItem[]> => {
    const res = await client.post('/shopping-list/bulk-add', { items });
    return res.data.data;
  },

  updateShoppingItem: async (id: string, updates: Partial<IShoppingItem>): Promise<IShoppingItem> => {
    const res = await client.put(`/shopping-list/${id}`, updates);
    return res.data.data;
  },

  deleteShoppingItem: async (id: string): Promise<{ id: string; message: string }> => {
    const res = await client.delete(`/shopping-list/${id}`);
    return res.data.data;
  },

  clearShoppingList: async (): Promise<{ clearedCount: number; message: string }> => {
    const res = await client.post('/shopping-list/clear', {});
    return res.data.data;
  },

  // Place Order
  placeOrder: async (data: {
    deliveryAddress?: string;
    paymentMethod?: 'UPI' | 'Card' | 'COD';
  }) => {
    const res = await client.post('/orders/place', data);
    return res.data;
  },

  // Products
  getProducts: async (): Promise<IProduct[]> => {
    const res = await client.get('/products');
    return res.data.data;
  },

  searchProducts: async (params: {
    q?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    dietary?: string;
    organic?: boolean;
    onSale?: boolean;
  }): Promise<IProduct[]> => {
    const res = await client.get('/products/search', { params });
    return res.data.data;
  },

  getProductById: async (id: string): Promise<IProduct> => {
    const res = await client.get(`/products/${id}`);
    return res.data.data;
  },

  getProductSubstitutes: async (id: string): Promise<IProduct[]> => {
    const res = await client.get(`/products/${id}/substitutes`);
    return res.data.data;
  },

  // Recommendations & Combos
  getRecommendations: async (): Promise<{
    replenishment: IRecommendation[];
    frequent: IRecommendation[];
    seasonal: IRecommendation[];
    preferencesBased: IRecommendation[];
    mealCombos: IMealCombo[];
  }> => {
    const res = await client.get('/recommendations');
    return res.data.data;
  },

  getMealCombos: async (): Promise<IMealCombo[]> => {
    const res = await client.get('/recommendations/combos');
    return res.data.data;
  },

  getReplenishment: async (): Promise<IRecommendation[]> => {
    const res = await client.get('/recommendations/replenishment');
    return res.data.data;
  },

  getSeasonalPicks: async (): Promise<{ season: string; picks: IRecommendation[] }> => {
    const res = await client.get('/recommendations/seasonal');
    return res.data.data;
  },

  // Shopping History
  getHistory: async (): Promise<IShoppingHistory[]> => {
    const res = await client.get('/history');
    return res.data.data;
  },

  addHistoryRecord: async (record: {
    productId?: string;
    productName: string;
    category: string;
    quantity: number;
    unit: string;
    price: number;
  }): Promise<IShoppingHistory> => {
    const res = await client.post('/history', record);
    return res.data.data;
  },

  // User Preferences
  getPreferences: async (): Promise<IUserPreferences> => {
    const res = await client.get('/preferences');
    return res.data.data;
  },

  updatePreferences: async (updates: Partial<IUserPreferences>): Promise<IUserPreferences> => {
    const res = await client.put('/preferences', updates);
    return res.data.data;
  },
};
