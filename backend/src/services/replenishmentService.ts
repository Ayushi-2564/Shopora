import { IRecommendation } from '../models/types';
import { store } from '../data/store';

export class ReplenishmentService {
  /**
   * Identifies low-stock items based on historical purchase frequency and intervals
   */
  public getReplenishmentSuggestions(userId = 'default-user'): IRecommendation[] {
    const history = store.getHistory(userId);
    const activeItems = store.getShoppingItems(userId);
    const activeProductIds = new Set(
      activeItems.filter((item) => !item.completed).map((item) => item.productId).filter(Boolean)
    );

    // Group history by productId
    const productHistoryMap = new Map<string, Date[]>();
    for (const h of history) {
      if (!productHistoryMap.has(h.productId)) {
        productHistoryMap.set(h.productId, []);
      }
      productHistoryMap.get(h.productId)!.push(new Date(h.purchasedAt));
    }

    const suggestions: IRecommendation[] = [];
    const now = new Date().getTime();

    for (const [productId, dates] of productHistoryMap.entries()) {
      // Don't suggest if already actively on the list
      if (activeProductIds.has(productId)) continue;

      const product = store.getProductById(productId);
      if (!product) continue;

      // Sort dates descending (newest first)
      dates.sort((a, b) => b.getTime() - a.getTime());

      const lastPurchase = dates[0];
      const daysSinceLastPurchase = Math.floor((now - lastPurchase.getTime()) / (1000 * 60 * 60 * 24));

      // Calculate average interval between purchases if purchased >= 2 times
      let avgInterval = 7; // default 7 days
      if (dates.length >= 2) {
        let totalIntervalDays = 0;
        for (let i = 0; i < dates.length - 1; i++) {
          const diffDays = (dates[i].getTime() - dates[i + 1].getTime()) / (1000 * 60 * 60 * 24);
          totalIntervalDays += diffDays;
        }
        avgInterval = Math.max(1, Math.round(totalIntervalDays / (dates.length - 1)));
      }

      // If days since last purchase is close to or exceeds average interval, flag for replenishment
      if (daysSinceLastPurchase >= avgInterval - 1 || dates.length >= 3) {
        suggestions.push({
          product,
          type: 'replenishment',
          reason: `You may be running low. You bought this ${dates.length} times (average cycle: every ${avgInterval} days; last bought ${daysSinceLastPurchase} days ago).`,
          badge: 'Running Low',
          confidenceScore: Math.min(0.99, 0.6 + dates.length * 0.1),
          daysSinceLastPurchase,
          averageIntervalDays: avgInterval,
        });
      }
    }

    return suggestions.sort((a, b) => b.confidenceScore - a.confidenceScore);
  }
}

export const replenishmentService = new ReplenishmentService();
