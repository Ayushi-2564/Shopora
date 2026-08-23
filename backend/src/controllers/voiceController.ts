import { Request, Response } from 'express';
import { nlpService } from '../services/nlpService';
import { shoppingListService } from '../services/shoppingListService';
import { productService } from '../services/productService';

export const parseVoiceCommand = async (req: Request, res: Response) => {
  try {
    const { transcript, language = 'en-US', autoExecute = false, userId = 'default-user' } = req.body;

    if (!transcript || typeof transcript !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Transcript is required and must be a string',
      });
    }

    const parsed = nlpService.parseVoiceInput(transcript, language);

    // If autoExecute is requested, execute the intent immediately
    let executionResult: any = null;

    if (autoExecute) {
      switch (parsed.intent) {
        case 'ADD_ITEM':
          if (parsed.item) {
            const added = shoppingListService.addItem({
              userId,
              name: parsed.item,
              quantity: parsed.quantity || 1,
              unit: parsed.unit,
              category: parsed.category,
              notes: parsed.attributes?.organic ? 'Organic' : undefined,
            });
            executionResult = { addedItem: added };
          }
          break;

        case 'REMOVE_ITEM':
          if (parsed.item) {
            const list = shoppingListService.getList(userId).items;
            const targetLower = parsed.item.toLowerCase();
            const found = list.find((i) => i.name.toLowerCase().includes(targetLower) || targetLower.includes(i.name.toLowerCase()));
            if (found) {
              shoppingListService.deleteItem(found.id);
              executionResult = { deletedItemId: found.id, itemName: found.name };
            }
          }
          break;

        case 'UPDATE_ITEM':
          if (parsed.item && parsed.quantity) {
            const list = shoppingListService.getList(userId).items;
            const targetLower = parsed.item.toLowerCase();
            const found = list.find((i) => i.name.toLowerCase().includes(targetLower) || targetLower.includes(i.name.toLowerCase()));
            if (found) {
              const updated = shoppingListService.updateItem(found.id, {
                quantity: parsed.quantity,
                unit: parsed.unit || found.unit,
              });
              executionResult = { updatedItem: updated };
            }
          }
          break;

        case 'COMPLETE_ITEM':
          if (parsed.item) {
            const list = shoppingListService.getList(userId).items;
            const targetLower = parsed.item.toLowerCase();
            const found = list.find((i) => i.name.toLowerCase().includes(targetLower) || targetLower.includes(i.name.toLowerCase()));
            if (found) {
              const updated = shoppingListService.updateItem(found.id, { completed: true });
              executionResult = { completedItem: updated };
            }
          }
          break;

        case 'SEARCH_PRODUCT':
          const searchResults = productService.searchProducts({
            query: parsed.filters?.query || parsed.item,
            category: parsed.filters?.category,
            minPrice: parsed.filters?.minPrice,
            maxPrice: parsed.filters?.maxPrice,
            organic: parsed.attributes?.organic,
          });
          executionResult = { products: searchResults, count: searchResults.length };
          break;

        case 'CLEAR_LIST':
          // We return the intent; frontend triggers a confirmation dialog for destructive actions
          break;
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        parsed,
        executionResult,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error while parsing voice command',
    });
  }
};
