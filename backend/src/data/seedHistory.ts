import { IShoppingHistory, IShoppingItem, IUserPreferences } from '../models/types';

// Helper to generate dates relative to current time
const daysAgo = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
};

export const SEED_HISTORY: IShoppingHistory[] = [
  // Milk - Frequent purchase (~4 day interval, last bought 5 days ago => due for replenishment!)
  {
    id: 'hist-1',
    userId: 'default-user',
    productId: 'prod-milk-1',
    productName: 'Fresh Whole Milk',
    category: 'Dairy',
    quantity: 2,
    unit: 'litres',
    price: 128,
    purchasedAt: daysAgo(5),
  },
  {
    id: 'hist-2',
    userId: 'default-user',
    productId: 'prod-milk-1',
    productName: 'Fresh Whole Milk',
    category: 'Dairy',
    quantity: 2,
    unit: 'litres',
    price: 128,
    purchasedAt: daysAgo(9),
  },
  {
    id: 'hist-3',
    userId: 'default-user',
    productId: 'prod-milk-1',
    productName: 'Fresh Whole Milk',
    category: 'Dairy',
    quantity: 2,
    unit: 'litres',
    price: 128,
    purchasedAt: daysAgo(14),
  },
  {
    id: 'hist-4',
    userId: 'default-user',
    productId: 'prod-milk-1',
    productName: 'Fresh Whole Milk',
    category: 'Dairy',
    quantity: 2,
    unit: 'litres',
    price: 128,
    purchasedAt: daysAgo(18),
  },

  // Brown Bread - Bought every ~5 days, last bought 6 days ago => due for replenishment!
  {
    id: 'hist-5',
    userId: 'default-user',
    productId: 'prod-brown-bread',
    productName: 'Whole Wheat Brown Bread',
    category: 'Bakery',
    quantity: 1,
    unit: 'packet',
    price: 50,
    purchasedAt: daysAgo(6),
  },
  {
    id: 'hist-6',
    userId: 'default-user',
    productId: 'prod-brown-bread',
    productName: 'Whole Wheat Brown Bread',
    category: 'Bakery',
    quantity: 1,
    unit: 'packet',
    price: 50,
    purchasedAt: daysAgo(11),
  },
  {
    id: 'hist-7',
    userId: 'default-user',
    productId: 'prod-brown-bread',
    productName: 'Whole Wheat Brown Bread',
    category: 'Bakery',
    quantity: 1,
    unit: 'packet',
    price: 50,
    purchasedAt: daysAgo(17),
  },

  // Eggs - Bought every 7 days, last bought 8 days ago
  {
    id: 'hist-8',
    userId: 'default-user',
    productId: 'prod-eggs-dozen',
    productName: 'Farm Fresh Brown Eggs',
    category: 'Meat',
    quantity: 1,
    unit: 'dozen',
    price: 110,
    purchasedAt: daysAgo(8),
  },
  {
    id: 'hist-9',
    userId: 'default-user',
    productId: 'prod-eggs-dozen',
    productName: 'Farm Fresh Brown Eggs',
    category: 'Meat',
    quantity: 1,
    unit: 'dozen',
    price: 110,
    purchasedAt: daysAgo(15),
  },

  // Apples - Bought occasionally (10 days ago)
  {
    id: 'hist-10',
    userId: 'default-user',
    productId: 'prod-apples-organic',
    productName: 'Organic Shimla Apples',
    category: 'Produce',
    quantity: 1,
    unit: 'kg',
    price: 190,
    purchasedAt: daysAgo(10),
  },

  // Coffee - Bought 20 days ago (long cycle)
  {
    id: 'hist-11',
    userId: 'default-user',
    productId: 'prod-arabica-coffee',
    productName: '100% Pure Arabica Ground Coffee',
    category: 'Beverages',
    quantity: 1,
    unit: 'packet',
    price: 490,
    purchasedAt: daysAgo(20),
  },
];

export const INITIAL_SHOPPING_LIST: IShoppingItem[] = [
  {
    id: 'item-init-1',
    userId: 'default-user',
    productId: 'prod-apples-organic',
    name: 'Organic Shimla Apples',
    quantity: 1,
    unit: 'kg',
    category: 'Produce',
    brand: 'Organic Tattva',
    estimatedPrice: 190,
    completed: false,
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: 'item-init-2',
    userId: 'default-user',
    productId: 'prod-mineral-water',
    name: 'Natural Mineral Water',
    quantity: 2,
    unit: 'bottles',
    category: 'Beverages',
    brand: 'Himalayan',
    estimatedPrice: 120,
    completed: false,
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: 'item-init-3',
    userId: 'default-user',
    productId: 'prod-potato-chips',
    name: 'Classic Salted Potato Chips',
    quantity: 2,
    unit: 'packets',
    category: 'Snacks',
    brand: 'Lay\'s',
    estimatedPrice: 60,
    completed: true,
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
];

export const INITIAL_USER_PREFERENCES: IUserPreferences = {
  userId: 'default-user',
  language: 'en-US',
  dietaryPreference: 'none',
  preferredBrands: ['Amul', 'Tata Sampann', 'Organic Tattva'],
  favoriteCategories: ['Dairy', 'Produce', 'Beverages', 'Bakery'],
  budget: 2500,
  enableTTS: true,
};
