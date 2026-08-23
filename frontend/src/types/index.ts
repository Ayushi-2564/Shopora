export type ProductCategory =
  | 'Produce'
  | 'Dairy'
  | 'Meat'
  | 'Bakery'
  | 'Beverages'
  | 'Snacks'
  | 'Pantry'
  | 'Household'
  | 'Personal Care'
  | 'Frozen'
  | 'Other';

export type ProductUnit =
  | 'piece'
  | 'pieces'
  | 'kg'
  | 'g'
  | 'litre'
  | 'litres'
  | 'bottle'
  | 'bottles'
  | 'packet'
  | 'packets'
  | 'box'
  | 'boxes'
  | 'dozen'
  | 'can'
  | 'cans'
  | 'unit';

export interface IProduct {
  id: string;
  name: string;
  category: ProductCategory;
  brand: string;
  price: number;
  unit: ProductUnit;
  size?: string;
  tags: string[];
  available: boolean;
  seasonal?: 'summer' | 'monsoon' | 'winter' | 'spring' | 'all-year';
  onSale?: boolean;
  salePrice?: number;
  substituteIds?: string[];
  imageIcon?: string;
  imageUrl?: string;
  dietaryTags?: ('vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'organic')[];
}

export interface IShoppingItem {
  id: string;
  userId: string;
  productId?: string;
  name: string;
  quantity: number;
  unit: string;
  category: ProductCategory;
  brand?: string;
  estimatedPrice: number;
  completed: boolean;
  notes?: string;
  imageUrl?: string;
  attributes?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface IShoppingHistory {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  category: ProductCategory;
  quantity: number;
  unit: string;
  price: number;
  purchasedAt: string;
  imageUrl?: string;
}

export type SupportedLanguage = 'en-US' | 'hi-IN' | 'hinglish' | 'es-ES';

export interface IUserPreferences {
  userId: string;
  language: SupportedLanguage;
  dietaryPreference: 'none' | 'vegetarian' | 'vegan' | 'gluten-free';
  preferredBrands: string[];
  favoriteCategories: ProductCategory[];
  budget: number;
  enableTTS: boolean;
}

export type VoiceIntent =
  | 'ADD_ITEM'
  | 'REMOVE_ITEM'
  | 'UPDATE_ITEM'
  | 'COMPLETE_ITEM'
  | 'SEARCH_PRODUCT'
  | 'FILTER_PRODUCT'
  | 'SHOW_LIST'
  | 'CLEAR_LIST'
  | 'GET_RECOMMENDATIONS'
  | 'PLACE_ORDER'
  | 'UNKNOWN';

export interface ParsedVoiceCommand {
  intent: VoiceIntent;
  confidence: number;
  rawText: string;
  item?: string;
  quantity?: number;
  unit?: string;
  category?: ProductCategory;
  brand?: string;
  attributes?: {
    organic?: boolean;
    type?: string;
    dietary?: string;
    [key: string]: any;
  };
  filters?: {
    category?: ProductCategory;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    query?: string;
    dietary?: string;
  };
  spokenFeedback?: string;
}

export interface IRecommendation {
  product: IProduct;
  reason: string;
  type: 'frequent' | 'replenishment' | 'seasonal' | 'substitute';
  badge?: string;
  confidenceScore: number;
  daysSinceLastPurchase?: number;
  averageIntervalDays?: number;
}

export interface IMealComboItem {
  name: string;
  quantity: number;
  unit: string;
  category: ProductCategory;
  estimatedPrice: number;
  imageUrl?: string;
}

export interface IMealCombo {
  id: string;
  title: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  tagline: string;
  description: string;
  calories: string;
  tags: string[];
  imageUrl: string;
  bundlePrice: number;
  originalPrice: number;
  items: IMealComboItem[];
}

export interface IOrder {
  id: string;
  orderNumber: string;
  userId: string;
  items: IShoppingItem[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'confirmed' | 'packing' | 'out_for_delivery' | 'delivered';
  paymentMethod: 'UPI' | 'Card' | 'COD';
  deliveryAddress: string;
  estimatedDeliveryMins: number;
  createdAt: string;
}

export interface ShoppingStats {
  totalItems: number;
  completedItems: number;
  categoriesCount: number;
  estimatedTotal: number;
}
