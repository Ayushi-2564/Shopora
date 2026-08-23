import { IShoppingItem, ProductCategory } from '../models/types';
import { store } from '../data/store';
import { nlpService } from './nlpService';

export class ShoppingListService {
  public getList(userId = 'default-user'): {
    items: IShoppingItem[];
    stats: {
      totalItems: number;
      completedItems: number;
      categoriesCount: number;
      estimatedTotal: number;
    };
  } {
    const items = store.getShoppingItems(userId);

    const completedItems = items.filter((i) => i.completed).length;
    const categoriesSet = new Set(items.map((i) => i.category));
    const estimatedTotal = items.reduce((acc, curr) => acc + (curr.estimatedPrice || 0) * (curr.quantity || 1), 0);

    return {
      items,
      stats: {
        totalItems: items.length,
        completedItems,
        categoriesCount: categoriesSet.size,
        estimatedTotal: Math.round(estimatedTotal),
      },
    };
  }

  public addItem(data: {
    userId?: string;
    productId?: string;
    name: string;
    quantity?: number;
    unit?: string;
    category?: ProductCategory;
    brand?: string;
    estimatedPrice?: number;
    notes?: string;
  }): IShoppingItem {
    const userId = data.userId || 'default-user';
    const name = data.name.trim();

    // Try finding in catalog for estimated price & category
    const catalogProduct = data.productId
      ? store.getProductById(data.productId)
      : store.findProductByName(name);

    const category = data.category || (catalogProduct ? catalogProduct.category : nlpService.categorizeItem(name));
    const estimatedPrice =
      data.estimatedPrice !== undefined
        ? data.estimatedPrice
        : catalogProduct
        ? (catalogProduct.salePrice || catalogProduct.price)
        : 100; // default ballpark price if unknown

    const unit = data.unit || (catalogProduct ? catalogProduct.unit : 'piece');
    const quantity = data.quantity && data.quantity > 0 ? data.quantity : 1;

    return store.addShoppingItem({
      userId,
      productId: catalogProduct ? catalogProduct.id : undefined,
      name: catalogProduct ? catalogProduct.name : name,
      quantity,
      unit,
      category,
      brand: data.brand || catalogProduct?.brand,
      estimatedPrice,
      completed: false,
      notes: data.notes,
    });
  }

  public updateItem(id: string, updates: Partial<IShoppingItem>): IShoppingItem | null {
    return store.updateShoppingItem(id, updates);
  }

  public deleteItem(id: string): boolean {
    return store.deleteShoppingItem(id);
  }

  public clearList(userId = 'default-user'): number {
    return store.clearShoppingList(userId);
  }
}

export const shoppingListService = new ShoppingListService();
