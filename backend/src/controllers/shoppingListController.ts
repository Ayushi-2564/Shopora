import { Request, Response } from 'express';
import { shoppingListService } from '../services/shoppingListService';

export const getShoppingList = async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'default-user';
    const data = shoppingListService.getList(userId);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch shopping list',
    });
  }
};

export const addShoppingItem = async (req: Request, res: Response) => {
  try {
    const { name, quantity, unit, category, brand, estimatedPrice, notes, userId } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Product name is required',
      });
    }

    const newItem = shoppingListService.addItem({
      userId,
      name,
      quantity,
      unit,
      category,
      brand,
      estimatedPrice,
      notes,
    });

    return res.status(201).json({
      success: true,
      data: newItem,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to add item to shopping list',
    });
  }
};

export const bulkAddShoppingItems = async (req: Request, res: Response) => {
  try {
    const { items, userId = 'default-user' } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Items array is required',
      });
    }

    const addedItems = items.map((item) =>
      shoppingListService.addItem({
        userId,
        name: item.name,
        quantity: item.quantity || 1,
        unit: item.unit || 'piece',
        category: item.category,
        estimatedPrice: item.estimatedPrice,
      })
    );

    return res.status(201).json({
      success: true,
      data: addedItems,
      count: addedItems.length,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to bulk add items',
    });
  }
};

export const updateShoppingItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = shoppingListService.updateItem(id, updates);
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Shopping item not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to update shopping item',
    });
  }
};

export const deleteShoppingItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = shoppingListService.deleteItem(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Shopping item not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: { id, message: 'Item removed successfully' },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete shopping item',
    });
  }
};

export const clearShoppingList = async (req: Request, res: Response) => {
  try {
    const userId = (req.body.userId as string) || 'default-user';
    const count = shoppingListService.clearList(userId);

    return res.status(200).json({
      success: true,
      data: { clearedCount: count, message: 'Shopping list cleared' },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to clear shopping list',
    });
  }
};
