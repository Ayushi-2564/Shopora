import { Request, Response } from 'express';
import { productService } from '../services/productService';
import { ProductCategory } from '../models/types';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = productService.getAllProducts();
    return res.status(200).json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch products',
    });
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const {
      q,
      category,
      minPrice,
      maxPrice,
      brand,
      dietary,
      organic,
      onSale,
    } = req.query;

    const results = productService.searchProducts({
      query: q as string,
      category: category as ProductCategory,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      brand: brand as string,
      dietary: dietary as string,
      organic: organic === 'true',
      onSale: onSale === 'true',
    });

    return res.status(200).json({
      success: true,
      data: results,
      count: results.length,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to search products',
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = productService.getProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch product',
    });
  }
};

export const getProductSubstitutes = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const substitutes = productService.getSubstitutes(id);

    return res.status(200).json({
      success: true,
      data: substitutes,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch substitutes',
    });
  }
};
