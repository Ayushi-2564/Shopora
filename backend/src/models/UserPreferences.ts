import mongoose, { Schema, Document } from 'mongoose';
import { ProductCategory } from './types';

export interface IUserPreferencesDoc extends Document {
  userId: string;
  language: string;
  dietaryPreference: string;
  preferredBrands: string[];
  favoriteCategories: ProductCategory[];
  budget: number;
  enableTTS: boolean;
}

const UserPreferencesSchema = new Schema<IUserPreferencesDoc>(
  {
    userId: { type: String, required: true, unique: true },
    language: { type: String, default: 'en-US' },
    dietaryPreference: { type: String, default: 'none' },
    preferredBrands: [{ type: String }],
    favoriteCategories: [{ type: String }],
    budget: { type: Number, default: 2000 },
    enableTTS: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const UserPreferencesModel = mongoose.model<IUserPreferencesDoc>('UserPreferences', UserPreferencesSchema);
