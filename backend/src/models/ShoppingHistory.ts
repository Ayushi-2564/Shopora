import mongoose, { Schema, Document } from 'mongoose';
import { ProductCategory } from './types';

export interface IShoppingHistoryDoc extends Document {
  userId: string;
  productId: string;
  productName: string;
  category: ProductCategory;
  quantity: number;
  unit: string;
  price: number;
  purchasedAt: Date;
}

const ShoppingHistorySchema = new Schema<IShoppingHistoryDoc>(
  {
    userId: { type: String, required: true, index: true },
    productId: { type: String, required: true, index: true },
    productName: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    price: { type: Number, required: true },
    purchasedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

export const ShoppingHistoryModel = mongoose.model<IShoppingHistoryDoc>('ShoppingHistory', ShoppingHistorySchema);
