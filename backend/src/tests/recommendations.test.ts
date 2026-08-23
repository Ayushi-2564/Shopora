import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '../data/store';
import { replenishmentService } from '../services/replenishmentService';
import { recommendationService } from '../services/recommendationService';
import { seasonalService } from '../services/seasonalService';

describe('Smart Recommendations & Replenishment Tests', () => {
  beforeEach(() => {
    store.reset();
  });

  it('should identify milk or bread for replenishment based on purchase history intervals', () => {
    const suggestions = replenishmentService.getReplenishmentSuggestions('default-user');
    expect(suggestions.length).toBeGreaterThan(0);

    const hasMilkOrBread = suggestions.some(
      (s) => s.product.name.includes('Milk') || s.product.name.includes('Bread')
    );
    expect(hasMilkOrBread).toBe(true);

    const first = suggestions[0];
    expect(first.reason).toBeDefined();
    expect(first.confidenceScore).toBeGreaterThan(0.5);
  });

  it('should provide multi-layered recommendation payload with meal combos', () => {
    const recs = recommendationService.getRecommendations('default-user');
    expect(recs.replenishment).toBeDefined();
    expect(recs.frequent).toBeDefined();
    expect(recs.seasonal).toBeDefined();
    expect(recs.mealCombos).toBeDefined();
    expect(recs.mealCombos.length).toBe(3);

    // Verify breakfast, lunch, dinner combos exist
    const types = recs.mealCombos.map((c) => c.mealType);
    expect(types).toContain('breakfast');
    expect(types).toContain('lunch');
    expect(types).toContain('dinner');
  });

  it('should detect current season and return seasonal picks', () => {
    const season = seasonalService.getCurrentSeason();
    expect(['summer', 'monsoon', 'winter', 'spring']).toContain(season);

    const picks = seasonalService.getSeasonalPicks();
    expect(picks.length).toBeGreaterThan(0);
    expect(picks[0].type).toBe('seasonal');
  });
});
