import { IRecommendation, IMealCombo } from '../models/types';
import { store } from '../data/store';
import { replenishmentService } from './replenishmentService';
import { seasonalService } from './seasonalService';

export const HEALTHY_MEAL_COMBOS: IMealCombo[] = [
  {
    id: 'combo-breakfast',
    title: 'Healthy Power Breakfast Combo',
    mealType: 'breakfast',
    tagline: 'High-Protein & Sustained Energy Kickstart',
    description: '100% whole grain rolled oats with farm fresh brown eggs, organic Shimla apples, and antioxidant-rich green tea.',
    calories: '450 kcal / serving',
    tags: ['High Protein', 'Fiber Rich', 'Antioxidants', 'Clean Eating'],
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    bundlePrice: 650,
    originalPrice: 710,
    items: [
      {
        name: '100% Whole Grain Rolled Oats',
        quantity: 1,
        unit: 'packet',
        category: 'Pantry',
        estimatedPrice: 190,
        imageUrl: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=400&q=80',
      },
      {
        name: 'Farm Fresh Brown Eggs',
        quantity: 1,
        unit: 'dozen',
        category: 'Meat',
        estimatedPrice: 110,
        imageUrl: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=400&q=80',
      },
      {
        name: 'Organic Shimla Apples',
        quantity: 1,
        unit: 'kg',
        category: 'Produce',
        estimatedPrice: 170,
        imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80',
      },
      {
        name: 'Organic Green Tea (Tulsi & Lemon)',
        quantity: 1,
        unit: 'box',
        category: 'Beverages',
        estimatedPrice: 240,
        imageUrl: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },
  {
    id: 'combo-lunch',
    title: 'Balanced Indian Lunch Combo',
    mealType: 'lunch',
    tagline: 'Traditional Complete Protein & Wholesome Grains',
    description: 'Aromatic Royal Basmati Rice, unpolished high-protein Toor Dal, fresh Malai Paneer, ripe farm tomatoes, and cold-pressed extra virgin olive oil.',
    calories: '620 kcal / serving',
    tags: ['Complete Protein', 'Gluten-Free', 'Indian Classic', 'Essential Minerals'],
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    bundlePrice: 1120,
    originalPrice: 1210,
    items: [
      {
        name: 'Royal Aged Basmati Rice',
        quantity: 1,
        unit: 'kg',
        category: 'Pantry',
        estimatedPrice: 195,
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
      },
      {
        name: 'Unpolished Toor Dal (Arhar)',
        quantity: 1,
        unit: 'kg',
        category: 'Pantry',
        estimatedPrice: 175,
        imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80',
      },
      {
        name: 'Fresh Malai Paneer',
        quantity: 2,
        unit: 'packets',
        category: 'Dairy',
        estimatedPrice: 180,
        imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80',
      },
      {
        name: 'Vine Ripe Farm Tomatoes',
        quantity: 1,
        unit: 'kg',
        category: 'Produce',
        estimatedPrice: 40,
        imageUrl: 'https://images.unsplash.com/photo-1546470427-e26264be0b11?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },
  {
    id: 'combo-dinner',
    title: 'Light & Nourishing Dinner Combo',
    mealType: 'dinner',
    tagline: 'Easy-to-Digest & Restorative Night Meal',
    description: 'Whole wheat fiber-rich brown bread paired with fresh baby spinach leaves, juicy sweet corn cobs, and mineral-rich Himalayan pink salt.',
    calories: '380 kcal / serving',
    tags: ['Low Calorie', 'High Fiber', 'Easy Digestion', 'Heart Healthy'],
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    bundlePrice: 200,
    originalPrice: 220,
    items: [
      {
        name: 'Whole Wheat Brown Bread',
        quantity: 1,
        unit: 'packet',
        category: 'Bakery',
        estimatedPrice: 50,
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
      },
      {
        name: 'Fresh Baby Spinach Leaves',
        quantity: 1,
        unit: 'packet',
        category: 'Produce',
        estimatedPrice: 35,
        imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=80',
      },
      {
        name: 'Fresh Sweet Corn Cobs',
        quantity: 1,
        unit: 'packet',
        category: 'Produce',
        estimatedPrice: 50,
        imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=400&q=80',
      },
      {
        name: 'Himalayan Pink Rock Salt',
        quantity: 1,
        unit: 'packet',
        category: 'Pantry',
        estimatedPrice: 85,
        imageUrl: 'https://images.unsplash.com/photo-1518110903416-749e75525eb5?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },
];

export class RecommendationService {
  /**
   * Generates smart, multi-layered recommendations
   */
  public getRecommendations(userId = 'default-user'): {
    replenishment: IRecommendation[];
    frequent: IRecommendation[];
    seasonal: IRecommendation[];
    preferencesBased: IRecommendation[];
    mealCombos: IMealCombo[];
  } {
    const preferences = store.getPreferences(userId);
    const history = store.getHistory(userId);
    const activeItems = store.getShoppingItems(userId);
    const activeProductNames = new Set(
      activeItems.filter((i) => !i.completed).map((i) => i.name.toLowerCase())
    );

    // 1. Replenishment Suggestions
    const replenishment = replenishmentService.getReplenishmentSuggestions(userId);

    // 2. Frequently Purchased Items
    const frequencyMap = new Map<string, { count: number; lastDate: Date; productName: string }>();
    for (const h of history) {
      if (!frequencyMap.has(h.productId)) {
        frequencyMap.set(h.productId, { count: 0, lastDate: new Date(h.purchasedAt), productName: h.productName });
      }
      const record = frequencyMap.get(h.productId)!;
      record.count += 1;
      const d = new Date(h.purchasedAt);
      if (d > record.lastDate) record.lastDate = d;
    }

    const frequent: IRecommendation[] = [];
    for (const [productId, info] of frequencyMap.entries()) {
      if (info.count >= 2) {
        const product = store.getProductById(productId);
        if (product && !activeProductNames.has(product.name.toLowerCase())) {
          frequent.push({
            product,
            type: 'frequent',
            reason: `Recommended because you bought this ${info.count} times in your previous shopping sessions.`,
            badge: 'Frequently Bought',
            confidenceScore: 0.9,
          });
        }
      }
    }

    // 3. Seasonal Picks
    const seasonal = seasonalService.getSeasonalPicks();

    // 4. Preference & Dietary Based Picks
    const allProducts = store.getProducts();
    const preferencesBased: IRecommendation[] = allProducts
      .filter((p) => {
        // Dietary match
        if (preferences.dietaryPreference !== 'none') {
          if (!p.dietaryTags?.includes(preferences.dietaryPreference as any)) {
            return false;
          }
        }
        // Favorite category or preferred brand
        const matchesCat = preferences.favoriteCategories.includes(p.category);
        const matchesBrand = preferences.preferredBrands.some((b) =>
          p.brand.toLowerCase().includes(b.toLowerCase())
        );
        return (matchesCat || matchesBrand) && !activeProductNames.has(p.name.toLowerCase());
      })
      .slice(0, 4)
      .map((product) => ({
        product,
        type: 'substitute' as const,
        reason: `Matches your preferred ${product.category} category and dietary preferences.`,
        badge: 'For You',
        confidenceScore: 0.8,
      }));

    return {
      replenishment,
      frequent,
      seasonal,
      preferencesBased,
      mealCombos: HEALTHY_MEAL_COMBOS,
    };
  }

  public getMealCombos(): IMealCombo[] {
    return HEALTHY_MEAL_COMBOS;
  }
}

export const recommendationService = new RecommendationService();
