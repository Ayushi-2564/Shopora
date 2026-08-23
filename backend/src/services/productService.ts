import { IProduct, ProductCategory } from '../models/types';
import { store } from '../data/store';

export interface ProductSearchParams {
  query?: string;
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  dietary?: string;
  organic?: boolean;
  onSale?: boolean;
  availableOnly?: boolean;
}

export class ProductService {
  public getAllProducts(): IProduct[] {
    return store.getProducts();
  }

  public getProductById(id: string): IProduct | undefined {
    return store.getProductById(id);
  }

  public searchProducts(params: ProductSearchParams): IProduct[] {
    let results = store.getProducts();

    // Query filter
    if (params.query && params.query.trim()) {
      const q = params.query.toLowerCase().trim();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (params.category && params.category !== ('Other' as ProductCategory)) {
      results = results.filter((p) => p.category.toLowerCase() === params.category!.toLowerCase());
    }

    // Min Price
    if (params.minPrice !== undefined && params.minPrice > 0) {
      results = results.filter((p) => (p.salePrice || p.price) >= params.minPrice!);
    }

    // Max Price
    if (params.maxPrice !== undefined && params.maxPrice > 0) {
      results = results.filter((p) => (p.salePrice || p.price) <= params.maxPrice!);
    }

    // Brand
    if (params.brand && params.brand.trim()) {
      results = results.filter((p) => p.brand.toLowerCase().includes(params.brand!.toLowerCase()));
    }

    // Organic filter
    if (params.organic) {
      results = results.filter(
        (p) =>
          p.dietaryTags?.includes('organic') ||
          p.tags.some((t) => t.includes('organic')) ||
          p.name.toLowerCase().includes('organic')
      );
    }

    // Dietary filter
    if (params.dietary && params.dietary !== 'none') {
      results = results.filter((p) => p.dietaryTags?.includes(params.dietary as any));
    }

    // On sale filter
    if (params.onSale) {
      results = results.filter((p) => p.onSale);
    }

    return results;
  }

  public getSubstitutes(productId: string): IProduct[] {
    const product = store.getProductById(productId);
    if (!product) return [];

    if (product.substituteIds && product.substituteIds.length > 0) {
      const subs: IProduct[] = [];
      for (const subId of product.substituteIds) {
        const sub = store.getProductById(subId);
        if (sub) subs.push(sub);
      }
      if (subs.length > 0) return subs;
    }

    // Fallback: Return products in same category
    return store
      .getProducts()
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 3);
  }
}

export const productService = new ProductService();
