import mongoose, { Schema, Document } from 'mongoose';
import { ProductCategory, ProductUnit } from './types';

export interface IProductDoc extends Document {
  name: string;
  category: ProductCategory;
  brand: string;
  price: number;
  unit: ProductUnit;
  size?: string;
  tags: string[];
  available: boolean;
  seasonal?: string;
  onSale?: boolean;
  salePrice?: number;
  substituteIds?: string[];
  imageIcon?: string;
  dietaryTags?: string[];
}

const ProductSchema = new Schema<IProductDoc>(
  {
    name: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: String, required: true },
    size: { type: String },
    tags: [{ type: String, index: true }],
    available: { type: Boolean, default: true },
    seasonal: { type: String },
    onSale: { type: Boolean, default: false },
    salePrice: { type: Number },
    substituteIds: [{ type: String }],
    imageIcon: { type: String },
    dietaryTags: [{ type: String }],
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model<IProductDoc>('Product', ProductSchema);
