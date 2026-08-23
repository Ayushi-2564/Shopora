import mongoose, { Schema, Document } from 'mongoose';
import { ProductCategory } from './types';

export interface IShoppingItemDoc extends Document {
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
  attributes?: Record<string, any>;
}

const ShoppingItemSchema = new Schema<IShoppingItemDoc>(
  {
    userId: { type: String, required: true, index: true },
    productId: { type: String },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    unit: { type: String, required: true, default: 'piece' },
    category: { type: String, required: true, index: true },
    brand: { type: String },
    estimatedPrice: { type: Number, required: true, default: 0 },
    completed: { type: Boolean, default: false },
    notes: { type: String },
    attributes: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const ShoppingItemModel = mongoose.model<IShoppingItemDoc>('ShoppingItem', ShoppingItemSchema);
