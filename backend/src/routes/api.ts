import { Router } from 'express';
import { parseVoiceCommand } from '../controllers/voiceController';
import {
  getShoppingList,
  addShoppingItem,
  bulkAddShoppingItems,
  updateShoppingItem,
  deleteShoppingItem,
  clearShoppingList,
} from '../controllers/shoppingListController';
import {
  getProducts,
  searchProducts,
  getProductById,
  getProductSubstitutes,
} from '../controllers/productController';
import {
  getRecommendations,
  getReplenishment,
  getSeasonalPicks,
  getMealCombos,
} from '../controllers/recommendationController';
import {
  getShoppingHistory,
  addHistoryRecord,
} from '../controllers/historyController';
import {
  getUserPreferences,
  updateUserPreferences,
} from '../controllers/preferencesController';
import { placeOrder } from '../controllers/orderController';
import { store } from '../data/store';

const router = Router();

// Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'Shopora Voice Shopping Assistant API',
      version: '1.0.0',
    },
  });
});

// Reset demo data
router.post('/reset-demo', (req, res) => {
  store.reset();
  res.status(200).json({
    success: true,
    message: 'Demo store reset to initial seed state successfully',
  });
});

// Voice Parsing
router.post('/voice/parse', parseVoiceCommand);

// Shopping List
router.get('/shopping-list', getShoppingList);
router.post('/shopping-list', addShoppingItem);
router.post('/shopping-list/bulk-add', bulkAddShoppingItems);
router.put('/shopping-list/:id', updateShoppingItem);
router.delete('/shopping-list/:id', deleteShoppingItem);
router.post('/shopping-list/clear', clearShoppingList);

// Orders & Checkout
router.post('/orders/place', placeOrder);

// Products Catalog & Search
router.get('/products', getProducts);
router.get('/products/search', searchProducts);
router.get('/products/:id', getProductById);
router.get('/products/:id/substitutes', getProductSubstitutes);

// Recommendations, Replenishment & Meal Combos
router.get('/recommendations', getRecommendations);
router.get('/recommendations/combos', getMealCombos);
router.get('/recommendations/replenishment', getReplenishment);
router.get('/recommendations/seasonal', getSeasonalPicks);

// Shopping History
router.get('/history', getShoppingHistory);
router.post('/history', addHistoryRecord);

// User Preferences
router.get('/preferences', getUserPreferences);
router.put('/preferences', updateUserPreferences);

export default router;
