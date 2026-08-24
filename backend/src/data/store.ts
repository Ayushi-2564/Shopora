import { IProduct, IShoppingItem, IShoppingHistory, IUserPreferences } from '../models/types';
import { SEED_PRODUCTS } from './seedProducts';
import { SEED_HISTORY, INITIAL_SHOPPING_LIST, INITIAL_USER_PREFERENCES } from './seedHistory';

class DataStore {
  private products: Map<string, IProduct> = new Map();
  private shoppingItems: Map<string, IShoppingItem> = new Map();
  private history: IShoppingHistory[] = [];
  private preferences: IUserPreferences = { ...INITIAL_USER_PREFERENCES };

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.products.clear();
    this.shoppingItems.clear();
    this.history = [];

    // Seed products
    SEED_PRODUCTS.forEach((p) => this.products.set(p.id, { ...p }));

    // Seed shopping list items
    INITIAL_SHOPPING_LIST.forEach((item) => this.shoppingItems.set(item.id, { ...item }));

    // Seed history
    this.history = [...SEED_HISTORY];

    // Seed preferences
    this.preferences = { ...INITIAL_USER_PREFERENCES };
  }

  // Products
  public getProducts(): IProduct[] {
    return Array.from(this.products.values());
  }

  public getProductById(id: string): IProduct | undefined {
    return this.products.get(id);
  }

  public findProductByName(name: string): IProduct | undefined {
    const lower = name.toLowerCase().trim();
    return this.getProducts().find(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        lower.includes(p.name.toLowerCase()) ||
        p.tags.some((t) => lower.includes(t) || t.includes(lower))
    );
  }

  // Shopping Items
  public getShoppingItems(userId = 'default-user'): IShoppingItem[] {
    return Array.from(this.shoppingItems.values())
      .filter((item) => item.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getShoppingItemById(id: string): IShoppingItem | undefined {
    return this.shoppingItems.get(id);
  }

  public addShoppingItem(item: Omit<IShoppingItem, 'id' | 'createdAt' | 'updatedAt'>): IShoppingItem {
    const id = 'item-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const now = new Date().toISOString();
    const newItem: IShoppingItem = {
      ...item,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.shoppingItems.set(id, newItem);
    return newItem;
  }

  public updateShoppingItem(id: string, updates: Partial<IShoppingItem>): IShoppingItem | null {
    const existing = this.shoppingItems.get(id);
    if (!existing) return null;

    const updated: IShoppingItem = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.shoppingItems.set(id, updated);
    return updated;
  }

  public deleteShoppingItem(id: string): boolean {
    return this.shoppingItems.delete(id);
  }

  public clearShoppingList(userId = 'default-user'): number {
    let deletedCount = 0;
    for (const [id, item] of this.shoppingItems.entries()) {
      if (item.userId === userId) {
        this.shoppingItems.delete(id);
        deletedCount++;
      }
    }
    return deletedCount;
  }

  // History
  public getHistory(userId = 'default-user'): IShoppingHistory[] {
    return this.history
      .filter((h) => h.userId === userId)
      .sort((a, b) => new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime());
  }

  public addHistoryRecord(record: Omit<IShoppingHistory, 'id'>): IShoppingHistory {
    const id = 'hist-' + Date.now();
    const newRecord: IShoppingHistory = { ...record, id };
    this.history.push(newRecord);
    return newRecord;
  }

  // Preferences
  public getPreferences(userId = 'default-user'): IUserPreferences {
    return { ...this.preferences, userId };
  }

  public updatePreferences(userId = 'default-user', updates: Partial<IUserPreferences>): IUserPreferences {
    this.preferences = {
      ...this.preferences,
      ...updates,
      userId,
    };
    return this.preferences;
  }
}

export const store = new DataStore();
