import { IRecommendation } from '../models/types';
import { store } from '../data/store';

export class SeasonalService {
  /**
   * Determine current season based on month (Northern Hemisphere / South Asian context)
   * Summer: Mar - Jun
   * Monsoon: Jul - Sep
   * Autumn/Spring: Oct - Nov
   * Winter: Dec - Feb
   */
  public getCurrentSeason(): 'summer' | 'monsoon' | 'winter' | 'spring' {
    const month = new Date().getMonth(); // 0 = Jan, 11 = Dec
    if (month >= 2 && month <= 5) return 'summer';
    if (month >= 6 && month <= 8) return 'monsoon';
    if (month >= 9 && month <= 10) return 'spring';
    return 'winter';
  }

  public getSeasonalPicks(): IRecommendation[] {
    const season = this.getCurrentSeason();
    const products = store.getProducts();

    const seasonalProducts = products.filter(
      (p) => p.seasonal === season || (season === 'monsoon' && (p.seasonal === 'monsoon' || p.tags.includes('tea')))
    );

    return seasonalProducts.map((product) => ({
      product,
      type: 'seasonal',
      reason: `Fresh pick for the ${season.toUpperCase()} season!`,
      badge: product.onSale ? 'Seasonal Sale' : 'In Season',
      confidenceScore: 0.85,
    }));
  }
}

export const seasonalService = new SeasonalService();
