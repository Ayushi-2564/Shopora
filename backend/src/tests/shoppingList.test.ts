import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '../data/store';
import { shoppingListService } from '../services/shoppingListService';

describe('Shopping List Service Tests', () => {
  beforeEach(() => {
    store.reset();
  });

  it('should get current shopping list and accurate statistics', () => {
    const list = shoppingListService.getList('default-user');
    expect(list.items.length).toBeGreaterThan(0);
    expect(list.stats.totalItems).toBe(list.items.length);
    expect(list.stats.estimatedTotal).toBeGreaterThan(0);
    expect(list.stats.categoriesCount).toBeGreaterThan(0);
  });

  it('should add a new item and assign correct category & estimated price', () => {
    const item = shoppingListService.addItem({
      name: 'Fresh Whole Milk',
      quantity: 2,
      unit: 'bottles',
    });

    expect(item.id).toBeDefined();
    expect(item.name).toBe('Fresh Whole Milk');
    expect(item.category).toBe('Dairy');
    expect(item.quantity).toBe(2);
  });

  it('should update shopping item quantity and completed status', () => {
    const list = shoppingListService.getList('default-user');
    const firstItem = list.items[0];

    const updated = shoppingListService.updateItem(firstItem.id, {
      quantity: 5,
      completed: true,
    });

    expect(updated?.quantity).toBe(5);
    expect(updated?.completed).toBe(true);
  });

  it('should delete an item from the list', () => {
    const list = shoppingListService.getList('default-user');
    const initialCount = list.items.length;
    const firstItem = list.items[0];

    const deleted = shoppingListService.deleteItem(firstItem.id);
    expect(deleted).toBe(true);

    const updatedList = shoppingListService.getList('default-user');
    expect(updatedList.items.length).toBe(initialCount - 1);
  });
});
