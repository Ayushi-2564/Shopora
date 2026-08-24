import { Request, Response } from 'express';
import { store } from '../data/store';
import { IOrder } from '../models/types';

export const placeOrder = async (req: Request, res: Response) => {
  try {
    const {
      userId = 'default-user',
      deliveryAddress = 'Flat 402, Green Valley Apartments, Indiranagar, Bengaluru - 560038',
      paymentMethod = 'UPI',
    } = req.body;

    const items = store.getShoppingItems(userId).filter((i) => !i.completed);

    if (items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Your shopping list is empty. Add items before placing an order.',
      });
    }

    const subtotal = items.reduce((sum, item) => sum + item.estimatedPrice * item.quantity, 0);
    const deliveryFee = 0; // Free express delivery promo
    const total = subtotal + deliveryFee;

    const orderNumber = `SHP-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: IOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      userId,
      items: [...items],
      itemCount: items.length,
      subtotal,
      deliveryFee,
      total,
      status: 'confirmed',
      paymentMethod,
      deliveryAddress,
      estimatedDeliveryMins: 25,
      createdAt: new Date().toISOString(),
    };

    // Save ordered items to shopping history
    for (const item of items) {
      store.addHistoryRecord({
        userId,
        productId: item.productId || `prod-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
        productName: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        price: item.estimatedPrice * item.quantity,
        purchasedAt: new Date().toISOString(),
      });
    }

    // Clear active shopping list
    store.clearShoppingList(userId);

    return res.status(201).json({
      success: true,
      data: newOrder,
      message: `Order #${orderNumber} placed successfully! Arriving in 25 mins.`,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to place order',
    });
  }
};
