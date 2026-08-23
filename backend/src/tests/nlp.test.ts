import { describe, it, expect } from 'vitest';
import { nlpService } from '../services/nlpService';

describe('NLP & Intent Parser Tests', () => {
  it('should parse simple add item command', () => {
    const res = nlpService.parseVoiceInput('Add milk');
    expect(res.intent).toBe('ADD_ITEM');
    expect(res.item).toBe('milk');
    expect(res.category).toBe('Dairy');
    expect(res.quantity).toBe(1);
  });

  it('should parse natural add item with quantity and unit (2 bottles of milk)', () => {
    const res = nlpService.parseVoiceInput('Add 2 bottles of milk');
    expect(res.intent).toBe('ADD_ITEM');
    expect(res.item).toBe('milk');
    expect(res.quantity).toBe(2);
    expect(res.unit).toBe('bottle');
    expect(res.category).toBe('Dairy');
  });

  it('should parse "Add two boxes of nan khatai an indian sweet dish"', () => {
    const res = nlpService.parseVoiceInput('Add two boxes of nan khatai an indian sweet dish');
    expect(res.intent).toBe('ADD_ITEM');
    expect(res.item).toContain('Nankhatai');
    expect(res.quantity).toBe(2);
    expect(res.unit).toBe('box');
    expect(res.category).toBe('Bakery');
  });

  it('should parse Hindi sweet with box unit "गुलाब जामुन का डब्बा जोड़ो"', () => {
    const res = nlpService.parseVoiceInput('गुलाब जामुन का डब्बा जोड़ो');
    expect(res.intent).toBe('ADD_ITEM');
    expect(res.item).toContain('Gulab Jamun');
    expect(res.unit).toBe('box');
    expect(res.category).toBe('Snacks');
  });

  it('should parse Hinglish command "Ek packet brown bread chahiye"', () => {
    const res = nlpService.parseVoiceInput('Ek packet brown bread chahiye');
    expect(res.intent).toBe('ADD_ITEM');
    expect(res.quantity).toBe(1);
    expect(res.unit).toBe('packet');
    expect(res.item).toContain('brown bread');
    expect(res.category).toBe('Bakery');
  });

  it('should parse Hinglish order addition "2 bottle milk order karo"', () => {
    const res = nlpService.parseVoiceInput('2 bottle milk order karo');
    expect(res.intent).toBe('ADD_ITEM');
    expect(res.quantity).toBe(2);
    expect(res.unit).toBe('bottle');
    expect(res.item).toContain('milk');
  });

  it('should parse "Place my order" command', () => {
    const res = nlpService.parseVoiceInput('Place my order');
    expect(res.intent).toBe('PLACE_ORDER');
  });

  it('should parse "Order place karo" in Hinglish', () => {
    const res = nlpService.parseVoiceInput('Order place karo');
    expect(res.intent).toBe('PLACE_ORDER');
  });

  it('should parse "I need 5 apples"', () => {
    const res = nlpService.parseVoiceInput('I need 5 apples');
    expect(res.intent).toBe('ADD_ITEM');
    expect(res.item).toBe('apples');
    expect(res.quantity).toBe(5);
    expect(res.category).toBe('Produce');
  });

  it('should parse word numbers like "Add one packet of chips"', () => {
    const res = nlpService.parseVoiceInput('Add one packet of chips');
    expect(res.intent).toBe('ADD_ITEM');
    expect(res.item).toBe('chips');
    expect(res.quantity).toBe(1);
    expect(res.unit).toBe('packet');
    expect(res.category).toBe('Snacks');
  });

  it('should parse organic attributes: "Hey, I need to buy 3 packets of organic brown bread"', () => {
    const res = nlpService.parseVoiceInput('Hey, I need to buy 3 packets of organic brown bread');
    expect(res.intent).toBe('ADD_ITEM');
    expect(res.item).toContain('brown bread');
    expect(res.quantity).toBe(3);
    expect(res.unit).toBe('packet');
    expect(res.attributes?.organic).toBe(true);
    expect(res.category).toBe('Bakery');
  });

  it('should parse remove command "Remove milk"', () => {
    const res = nlpService.parseVoiceInput('Remove milk');
    expect(res.intent).toBe('REMOVE_ITEM');
    expect(res.item).toBe('milk');
  });

  it('should parse remove command "Delete bananas from my list"', () => {
    const res = nlpService.parseVoiceInput('Delete bananas from my list');
    expect(res.intent).toBe('REMOVE_ITEM');
    expect(res.item).toBe('bananas');
  });

  it('should parse update command "Change milk quantity to 3"', () => {
    const res = nlpService.parseVoiceInput('Change milk quantity to 3');
    expect(res.intent).toBe('UPDATE_ITEM');
    expect(res.quantity).toBe(3);
    expect(res.item).toContain('milk');
  });

  it('should parse complete command "I bought the milk"', () => {
    const res = nlpService.parseVoiceInput('I bought the milk');
    expect(res.intent).toBe('COMPLETE_ITEM');
    expect(res.item).toContain('milk');
  });

  it('should parse search command "Find me organic apples"', () => {
    const res = nlpService.parseVoiceInput('Find me organic apples');
    expect(res.intent).toBe('SEARCH_PRODUCT');
    expect(res.item).toBe('apples');
    expect(res.attributes?.organic).toBe(true);
  });

  it('should parse search with dollar price filter "Find toothpaste under $5"', () => {
    const res = nlpService.parseVoiceInput('Find toothpaste under $5');
    expect(res.intent).toBe('SEARCH_PRODUCT');
    expect(res.filters?.maxPrice).toBe(5);
  });

  it('should parse search with price filter "Find organic apples under 200 rupees"', () => {
    const res = nlpService.parseVoiceInput('Find organic apples under 200 rupees');
    expect(res.intent).toBe('SEARCH_PRODUCT');
    expect(res.filters?.maxPrice).toBe(200);
    expect(res.attributes?.organic).toBe(true);
  });

  it('should parse search with price filter "Find toothpaste under 200"', () => {
    const res = nlpService.parseVoiceInput('Find toothpaste under 200');
    expect(res.intent).toBe('SEARCH_PRODUCT');
    expect(res.filters?.maxPrice).toBe(200);
  });

  it('should parse price range "Find shampoo between 300 and 500"', () => {
    const res = nlpService.parseVoiceInput('Find shampoo between 300 and 500');
    expect(res.intent).toBe('SEARCH_PRODUCT');
    expect(res.filters?.minPrice).toBe(300);
    expect(res.filters?.maxPrice).toBe(500);
  });

  it('should parse Hindi voice input "मेरी लिस्ट में 2 किलो सेब जोड़ो"', () => {
    const res = nlpService.parseVoiceInput('मेरी लिस्ट में 2 किलो सेब जोड़ो');
    expect(res.intent).toBe('ADD_ITEM');
    expect(res.quantity).toBe(2);
    expect(res.unit).toBe('kg');
    expect(res.category).toBe('Produce');
  });

  it('should parse Hinglish voice input "Meri shopping list mein 2 kilo apples add karo"', () => {
    const res = nlpService.parseVoiceInput('Meri shopping list mein 2 kilo apples add karo');
    expect(res.intent).toBe('ADD_ITEM');
    expect(res.quantity).toBe(2);
    expect(res.unit).toBe('kg');
    expect(res.item).toContain('apples');
  });

  it('should parse Spanish voice input "Agrega dos litros de leche"', () => {
    const res = nlpService.parseVoiceInput('Agrega dos litros de leche');
    expect(res.intent).toBe('ADD_ITEM');
    expect(res.quantity).toBe(2);
    expect(res.unit).toBe('litre');
    expect(res.category).toBe('Dairy');
  });

  it('should parse clear list command "Clear my shopping list"', () => {
    const res = nlpService.parseVoiceInput('Clear my shopping list');
    expect(res.intent).toBe('CLEAR_LIST');
  });
});
