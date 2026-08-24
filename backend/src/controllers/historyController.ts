import { Request, Response } from 'express';
import { store } from '../data/store';

export const getShoppingHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'default-user';
    const history = store.getHistory(userId);

    return res.status(200).json({
      success: true,
      data: history,
      count: history.length,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch shopping history',
    });
  }
};

export const addHistoryRecord = async (req: Request, res: Response) => {
  try {
    const { productId, productName, category, quantity, unit, price, userId = 'default-user' } = req.body;

    if (!productName || !category) {
      return res.status(400).json({
        success: false,
        error: 'Product name and category are required',
      });
    }

    const record = store.addHistoryRecord({
      userId,
      productId: productId || 'custom-prod',
      productName,
      category,
      quantity: quantity || 1,
      unit: unit || 'piece',
      price: price || 0,
      purchasedAt: new Date().toISOString(),
    });

    return res.status(201).json({
      success: true,
      data: record,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to record history',
    });
  }
};
