import { ParsedVoiceCommand, ProductCategory, VoiceIntent } from '../models/types';
import { store } from '../data/store';

// Number words map
const NUMBER_WORDS: Record<string, number> = {
  // English
  a: 1,
  an: 1,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  dozen: 12,
  'half a dozen': 6,
  'half dozen': 6,
  half: 0.5,
  quarter: 0.25,

  // Hindi / Hinglish
  ek: 1,
  do: 2,
  teen: 3,
  char: 4,
  paanch: 5,
  chhah: 6,
  saat: 7,
  aath: 8,
  nau: 9,
  das: 10,
  ek_dozen: 12,
  aadha: 0.5,
  'एक': 1,
  'दो': 2,
  'तीन': 3,
  'चार': 4,
  'पाँच': 5,
  'पांच': 5,
  'छह': 6,
  'सात': 7,
  'आठ': 8,
  'नौ': 9,
  'दस': 10,
  'आधा': 0.5,
  'दर्जन': 12,

  // Spanish
  un: 1,
  una: 1,
  uno: 1,
  dos: 2,
  tres: 3,
  cuatro: 4,
  cinco: 5,
  seis: 6,
  siete: 7,
  ocho: 8,
  nueve: 9,
  diez: 10,
  docena: 12,
  media: 0.5,
  medio: 0.5,
};

// Unit aliases map
const UNIT_MAP: Record<string, string> = {
  // Metric / Count
  kg: 'kg',
  kgs: 'kg',
  kilo: 'kg',
  kilos: 'kg',
  kilogram: 'kg',
  kilograms: 'kg',
  'किलो': 'kg',
  'किलोग्राम': 'kg',
  g: 'g',
  gm: 'g',
  gms: 'g',
  gram: 'g',
  grams: 'g',
  'ग्राम': 'g',
  l: 'litre',
  litre: 'litre',
  litres: 'litre',
  liter: 'litre',
  liters: 'litre',
  'लीटर': 'litre',
  litro: 'litre',
  litros: 'litre',
  bottle: 'bottle',
  bottles: 'bottle',
  botella: 'bottle',
  botellas: 'bottle',
  packet: 'packet',
  packets: 'packet',
  pack: 'packet',
  packs: 'packet',
  pkt: 'packet',
  paquete: 'packet',
  paquetes: 'packet',
  'पैकेट': 'packet',
  piece: 'piece',
  pieces: 'piece',
  pc: 'piece',
  pcs: 'piece',
  pieza: 'piece',
  piezas: 'piece',
  dozen: 'dozen',
  dozens: 'dozen',
  'दर्जन': 'dozen',
  box: 'box',
  boxes: 'box',
  caja: 'box',
  cajas: 'box',
  dabba: 'box',
  dabbe: 'box',
  'डब्बा': 'box',
  'डब्बे': 'box',
  'डिब्बा': 'box',
  'डिब्बे': 'box',
  can: 'can',
  cans: 'can',
  lata: 'can',
  latas: 'can',
};

// Keyword category map
const CATEGORY_KEYWORDS: Record<ProductCategory, string[]> = {
  Dairy: [
    'milk', 'doodh', 'दूध', 'leche', 'butter', 'makhan', 'मक्खन', 'mantequilla', 'cheese', 'paneer', 'पनीर', 'queso',
    'curd', 'dahi', 'दही', 'yogurt', 'tofu', 'cream', 'malai', 'मलाई', 'almond milk', 'soy milk', 'oat milk'
  ],
  Produce: [
    'apple', 'apples', 'seb', 'सेब', 'manzana', 'manzanas', 'banana', 'bananas', 'kela', 'केला', 'platano',
    'orange', 'oranges', 'santra', 'संतरा', 'naranja', 'tomato', 'tomatoes', 'tamatar', 'टमाटर', 'tomate',
    'onion', 'onions', 'pyaz', 'प्याज', 'cebolla', 'potato', 'potatoes', 'aloo', 'आलू', 'patata', 'papa',
    'spinach', 'palak', 'पालक', 'espinaca', 'cucumber', 'kheera', 'खीरा', 'pepino', 'watermelon', 'tarbooj', 'तरबूज',
    'sandia', 'ginger', 'adrak', 'अदरक', 'jengibre', 'lemon', 'lemons', 'nimbu', 'नींबू', 'limon', 'corn',
    'sweet corn', 'bhutta', 'भुट्टा', 'maiz', 'garlic', 'lahsun', 'लहसुन', 'carrot', 'gajar', 'गाजर', 'fruit', 'vegetable'
  ],
  Bakery: [
    'bread', 'brown bread', 'ब्रेड', 'pan', 'bun', 'buns', 'burger buns', 'croissant', 'croissants',
    'toast', 'pav', 'पाव', 'muffin', 'cake', 'bagel', 'multigrain bread', 'gluten-free bread',
    'nankhatai', 'nan khatai', 'naankhatai', 'non-cut eye', 'non khatai', 'नानखटाई', 'shortbread', 'cookies'
  ],
  Beverages: [
    'water', 'mineral water', 'pani', 'पानी', 'agua', 'tea', 'chai', 'चाय', 'te', 'green tea', 'coffee', 'कॉफ़ी',
    'cafe', 'juice', 'orange juice', 'jugo', 'coconut water', 'nariyal pani', 'नारियल पानी', 'soda', 'coke'
  ],
  Snacks: [
    'chips', 'potato chips', 'चिप्स', 'crisps', 'wafer', 'papas', 'biscuit', 'biscuits', 'बिस्कुट', 'cookie',
    'cookies', 'galleta', 'chocolate', 'chocolates', 'चॉकलेट', 'dark chocolate', 'almonds', 'nuts',
    'badam', 'बादाम', 'almendras', 'namkeen', 'नमकीन', 'popcorn', 'snack',
    'gulab jamun', 'gulabjamun', 'गुलाब जामुन', 'kaju katli', 'काजू कतली', 'ladoo', 'laddu', 'लड्डू',
    'besan ladoo', 'rasgulla', 'रसगुल्ला', 'samosa', 'समोसा', 'jalebi', 'जलेबी', 'mithai', 'sweet dish'
  ],
  Pantry: [
    'rice', 'basmati rice', 'chawal', 'चावल', 'arroz', 'flour', 'wheat flour', 'atta', 'आटा', 'harina',
    'dal', 'lentils', 'toor dal', 'दाल', 'pulses', 'lentejas', 'sugar', 'cheeni', 'चीनी', 'azucar',
    'salt', 'namak', 'नमक', 'sal', 'pink salt', 'oil', 'olive oil', 'cooking oil', 'tel', 'तेल', 'aceite',
    'spice', 'masala', 'मसाला', 'pasta', 'noodles'
  ],
  Meat: [
    'egg', 'eggs', 'ande', 'अंडा', 'अंडे', 'huevo', 'huevos', 'chicken', 'चिकन', 'chicken breast', 'meat', 'pollo',
    'carne', 'mutton', 'fish', 'machli', 'मछली', 'pescado', 'poultry'
  ],
  'Personal Care': [
    'toothpaste', 'paste', 'colgate', 'sensodyne', 'pasta de dientes', 'dentifrico',
    'shampoo', 'champu', 'dove', 'body wash', 'gel de ducha', 'soap', 'sabun', 'साबुन', 'jabon',
    'deodorant', 'lotion', 'face wash'
  ],
  Household: [
    'dishwash', 'vim', 'detergent', 'surf excel', 'detergente', 'paper towel', 'tissue',
    'kitchen roll', 'toallas de papel', 'napkin', 'cleaner', 'sponge', 'mop'
  ],
  Frozen: [
    'frozen peas', 'green peas', 'matar', 'मटर', 'guisantes', 'french fries', 'fries',
    'patatas fritas', 'ice cream', 'आइसक्रीम', 'helado', 'frozen corn', 'frozen'
  ],
  Other: ['item', 'product', 'thing'],
};

export class NLPService {
  /**
   * Main entry point for voice parsing
   */
  public parseVoiceInput(text: string, languageHint?: string): ParsedVoiceCommand {
    const rawText = text.trim();
    if (!rawText) {
      return {
        intent: 'UNKNOWN',
        confidence: 0,
        rawText,
        spokenFeedback: "I didn't hear anything. Try saying 'Add 2 bottles of milk'.",
      };
    }

    const clean = rawText.toLowerCase().replace(/[.,!?;:]/g, ' ');

    // 1. Detect Intent
    const intent = this.detectIntent(clean);

    // 2. Extract Details based on Intent
    switch (intent) {
      case 'ADD_ITEM':
        return this.parseAddItem(rawText, clean);
      case 'REMOVE_ITEM':
        return this.parseRemoveItem(rawText, clean);
      case 'UPDATE_ITEM':
        return this.parseUpdateItem(rawText, clean);
      case 'COMPLETE_ITEM':
        return this.parseCompleteItem(rawText, clean);
      case 'SEARCH_PRODUCT':
      case 'FILTER_PRODUCT':
        return this.parseSearchOrFilter(rawText, clean);
      case 'CLEAR_LIST':
        return {
          intent: 'CLEAR_LIST',
          confidence: 0.95,
          rawText,
          spokenFeedback: 'Are you sure you want to clear your shopping list?',
        };
      case 'GET_RECOMMENDATIONS':
        return {
          intent: 'GET_RECOMMENDATIONS',
          confidence: 0.95,
          rawText,
          spokenFeedback: 'Here are smart recommendations based on your history and seasonal picks.',
        };
      case 'SHOW_LIST':
        return {
          intent: 'SHOW_LIST',
          confidence: 0.9,
          rawText,
          spokenFeedback: 'Displaying your current shopping list.',
        };
      case 'PLACE_ORDER':
        return {
          intent: 'PLACE_ORDER',
          confidence: 0.95,
          rawText,
          spokenFeedback: 'Opening checkout to review and place your order.',
        };
      default:
        // Try fallback if it sounds like an item addition (e.g. user just said "Milk", "Two apples")
        const fallbackAdd = this.parseAddItem(rawText, clean);
        if (fallbackAdd.item && fallbackAdd.item.length > 1) {
          fallbackAdd.confidence = 0.7;
          return fallbackAdd;
        }

        return {
          intent: 'UNKNOWN',
          confidence: 0.2,
          rawText,
          spokenFeedback: `I couldn't understand "${rawText}". Try saying "Add 2 bottles of milk" or "Find organic apples".`,
        };
    }
  }

  /**
   * Classify user intent
   */
  private detectIntent(clean: string): VoiceIntent {
    // Clear list
    if (
      clean.includes('clear my shopping list') ||
      clean.includes('clear shopping list') ||
      clean.includes('clear list') ||
      clean.includes('remove everything') ||
      clean.includes('delete everything') ||
      clean.includes('saari list clear karo') ||
      clean.includes('puri list saaf karo') ||
      clean.includes('limpiar mi lista') ||
      clean.includes('borrar todo')
    ) {
      return 'CLEAR_LIST';
    }

    // Recommendations
    if (
      clean.includes('recommend') ||
      clean.includes('what should i buy') ||
      clean.includes('suggestions') ||
      clean.includes('kya khareedna') ||
      clean.includes('kya chahiye') ||
      clean.includes('sugerencias') ||
      clean.includes('recomendaciones')
    ) {
      return 'GET_RECOMMENDATIONS';
    }

    // Complete / Purchased
    if (
      clean.includes('bought') ||
      clean.includes('purchased') ||
      clean.includes('mark as purchased') ||
      clean.includes('mark as completed') ||
      clean.includes('got the') ||
      clean.includes('buy kar liya') ||
      clean.includes('khareed liya') ||
      clean.includes('le liya') ||
      clean.includes('comprado') ||
      clean.includes('he comprado') ||
      clean.includes('marcar como comprado')
    ) {
      return 'COMPLETE_ITEM';
    }

    // Update quantity
    if (
      clean.includes('change') ||
      clean.includes('make it') ||
      clean.includes('make ') ||
      clean.includes('update quantity') ||
      clean.includes('add two more') ||
      clean.includes('add more') ||
      clean.includes('quantity badhao') ||
      clean.includes('badal do') ||
      clean.includes('cambiar cantidad') ||
      clean.includes('hazlo')
    ) {
      return 'UPDATE_ITEM';
    }

    // Search / Filter
    if (
      clean.startsWith('find') ||
      clean.startsWith('search') ||
      clean.startsWith('show me') ||
      clean.startsWith('look for') ||
      clean.includes('under ') ||
      clean.includes('below ') ||
      clean.includes('between ') ||
      clean.includes('dhoondho') ||
      clean.includes('khojo') ||
      clean.includes('search karo') ||
      clean.includes('buscar') ||
      clean.includes('encuentra') ||
      clean.includes('muestra')
    ) {
      return 'SEARCH_PRODUCT';
    }

    // Remove
    if (
      clean.startsWith('remove') ||
      clean.startsWith('delete') ||
      clean.includes("don't need") ||
      clean.includes('dont need') ||
      clean.includes('drop') ||
      clean.includes('hata do') ||
      clean.includes('hatao') ||
      clean.includes('nikal do') ||
      clean.includes('delete karo') ||
      clean.includes('quitar') ||
      clean.includes('eliminar') ||
      clean.includes('borra')
    ) {
      return 'REMOVE_ITEM';
    }

    // Show list
    if (
      clean.includes('show list') ||
      clean.includes('my list') ||
      clean.includes('list dikhao') ||
      clean.includes('ver mi lista')
    ) {
      return 'SHOW_LIST';
    }

    // Place order / Checkout (e.g. "Place order", "Order place karo", "Checkout")
    const isExplicitOrderCheckout =
      clean === 'order karo' ||
      clean === 'order kar do' ||
      clean === 'order now' ||
      clean === 'place order' ||
      clean === 'place my order' ||
      clean === 'checkout' ||
      clean.includes('order place') ||
      clean.includes('place order') ||
      clean.includes('place my order') ||
      clean.includes('order my list') ||
      clean.includes('list order karo') ||
      clean.includes('complete order') ||
      clean.includes('realizar pedido') ||
      clean.includes('ordenar');

    // Only treat as checkout if user isn't specifying an item/quantity (e.g. "2 bottle milk order karo" -> ADD_ITEM)
    const hasDigitOrQuantity = /\d/.test(clean) || clean.includes('bottle') || clean.includes('packet') || clean.includes('kg') || clean.includes('kilo') || clean.includes('litre');
    if (isExplicitOrderCheckout && !hasDigitOrQuantity) {
      return 'PLACE_ORDER';
    }

    // Add item (English, Hindi, Hinglish, Spanish)
    if (
      clean.startsWith('add') ||
      clean.startsWith('i need') ||
      clean.startsWith('i want') ||
      clean.startsWith('put') ||
      clean.startsWith('get') ||
      clean.startsWith('buy') ||
      clean.includes('jodo') ||
      clean.includes('add karo') ||
      clean.includes('laana hai') ||
      clean.includes('daal do') ||
      clean.includes('daalo') ||
      clean.includes('chahiye') ||
      clean.includes('mangwa do') ||
      clean.includes('mangwana hai') ||
      clean.includes('khareedna hai') ||
      clean.includes('le aao') ||
      clean.includes('bhejo') ||
      clean.includes('pack karo') ||
      clean.includes('meri list') ||
      clean.includes('agrega') ||
      clean.includes('anadir') ||
      clean.includes('añadir') ||
      clean.includes('necesito')
    ) {
      return 'ADD_ITEM';
    }

    return 'UNKNOWN';
  }

  /**
   * Parse ADD_ITEM commands
   */
  private parseAddItem(rawText: string, clean: string): ParsedVoiceCommand {
    let working = clean;

    // Remove trigger words in English, Hindi, Spanish
    const triggers = [
      'hey shopora', 'shopora', 'please', 'can you', 'could you',
      'i need to buy', 'i want to buy', 'i need', 'i want', 'add to my shopping list',
      'add to my list', 'add to list', 'add', 'put on my list', 'put on list', 'put',
      'get me', 'get', 'buy', 'meri shopping list mein', 'meri list mein', 'list mein',
      'add karo', 'jodo', 'daal do', 'daalo', 'chahiye', 'mangwa do', 'mangwana hai',
      'khareedna hai', 'le aao', 'bhejo', 'pack karo', 'order karo', 'order kar do',
      'laana hai', 'agrega a mi lista', 'agrega a la lista',
      'agrega', 'añadir a mi lista', 'añade a mi lista', 'añade', 'necesito comprar', 'necesito'
    ];

    for (const trig of triggers) {
      if (working.includes(trig)) {
        working = working.replace(new RegExp(`\\b${trig}\\b`, 'gi'), ' ');
      }
    }

    // Extract quantity and unit
    const { quantity, unit, remainingText } = this.extractQuantityAndUnit(working);
    let itemName = remainingText.trim();

    // Clean filler words and descriptive phrases
    itemName = itemName
      .replace(/\b(an indian sweet dish|indian sweet dish|an indian sweet|sweet dish|an indian dish|indian dish|mithai|sweet|dish)\b/gi, ' ')
      .replace(/\b(to|my|list|the|some|of|for|mein|ko|por|favor|de|un|una|ka|ke|ki|mujhe|bhi|aur|and|with)\b/gi, ' ')
      .replace(/\b(dabba|dabbe|packet|pack|bottle|box|boxes|डब्बा|डब्बे|डिब्बा|डिब्बे)\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Phonetic & common speech-to-text mishearing normalization for Indian grocery / sweets
    if (
      itemName.includes('non-cut eye') ||
      itemName.includes('non cut eye') ||
      itemName.includes('nan khatai') ||
      itemName.includes('nankhatai') ||
      itemName.includes('naan khatai') ||
      itemName.includes('non khatai') ||
      itemName.includes('नानखटाई')
    ) {
      itemName = 'Nankhatai (Indian Sweet Shortbread)';
    } else if (
      itemName.includes('gulab jamun') ||
      itemName.includes('gulabjamun') ||
      itemName.includes('गुलाब जामुन')
    ) {
      itemName = 'Gulab Jamun';
    } else if (
      itemName.includes('kaju katli') ||
      itemName.includes('kaju barfi') ||
      itemName.includes('काजू कतली')
    ) {
      itemName = 'Kaju Katli';
    } else if (
      itemName.includes('ladoo') ||
      itemName.includes('laddu') ||
      itemName.includes('लड्डू')
    ) {
      itemName = 'Besan Ladoo';
    } else if (
      itemName.includes('rasgulla') ||
      itemName.includes('रसगुल्ला')
    ) {
      itemName = 'Rasgulla';
    }

    // Extract attributes (organic, type, dietary)
    const attributes: Record<string, any> = {};
    if (itemName.toLowerCase().includes('organic') || itemName.toLowerCase().includes('organico') || itemName.toLowerCase().includes('organica')) {
      attributes.organic = true;
      itemName = itemName.replace(/\b(organic|organico|organica)\b/gi, '').trim();
    }
    if (itemName.toLowerCase().includes('brown') || itemName.toLowerCase().includes('wheat') || itemName.toLowerCase().includes('whole wheat')) {
      attributes.type = 'brown';
    }
    if (itemName.toLowerCase().includes('gluten free') || itemName.toLowerCase().includes('gluten-free')) {
      attributes.dietary = 'gluten-free';
    }

    // Categorize
    const category = this.categorizeItem(itemName);

    // Format spoken feedback
    const unitStr = unit ? ` ${unit}` : '';
    const qStr = quantity > 1 || quantity === 0.5 ? `${quantity}` : '1';
    const spokenFeedback = `Added ${qStr}${unitStr} of ${itemName || 'item'} to your ${category} list.`;

    return {
      intent: 'ADD_ITEM',
      confidence: 0.95,
      rawText,
      item: itemName,
      quantity,
      unit: unit || 'piece',
      category,
      attributes,
      spokenFeedback,
    };
  }

  /**
   * Parse REMOVE_ITEM commands
   */
  private parseRemoveItem(rawText: string, clean: string): ParsedVoiceCommand {
    let working = clean;

    const removeTriggers = [
      'remove from my shopping list', 'remove from my list', 'remove from list',
      'remove', 'delete from my list', 'delete from list', 'delete',
      "i don't need", "i dont need", 'anymore', 'drop', 'hata do', 'hatao',
      'nikal do', 'delete karo', 'list se hatao', 'quita de mi lista', 'quita',
      'eliminar de mi lista', 'eliminar', 'borra de mi lista', 'borra'
    ];

    for (const trig of removeTriggers) {
      working = working.replace(new RegExp(`\\b${trig}\\b`, 'gi'), ' ');
    }

    let itemName = working
      .replace(/\b(the|my|list|from|se|de|la|el)\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return {
      intent: 'REMOVE_ITEM',
      confidence: 0.9,
      rawText,
      item: itemName,
      spokenFeedback: `Removed ${itemName || 'item'} from your shopping list.`,
    };
  }

  /**
   * Parse UPDATE_ITEM commands (e.g. "Change milk quantity to 3", "Make oranges five")
   */
  private parseUpdateItem(rawText: string, clean: string): ParsedVoiceCommand {
    let working = clean;

    // Detect target quantity
    const { quantity, unit, remainingText } = this.extractQuantityAndUnit(working);

    let itemName = remainingText
      .replace(/\b(change|update|make|it|quantity|to|badhao|karo|cambiar|cantidad|a)\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return {
      intent: 'UPDATE_ITEM',
      confidence: 0.9,
      rawText,
      item: itemName,
      quantity: quantity || 1,
      unit: unit || 'piece',
      spokenFeedback: `Updated ${itemName || 'item'} quantity to ${quantity}.`,
    };
  }

  /**
   * Parse COMPLETE_ITEM commands (e.g. "I bought the milk", "Mark apples as purchased")
   */
  private parseCompleteItem(rawText: string, clean: string): ParsedVoiceCommand {
    let working = clean;
    const triggers = [
      'i have bought', 'i bought', 'bought', 'purchased', 'mark as purchased',
      'mark as completed', 'got the', 'khareed liya', 'buy kar liya', 'le liya',
      'he comprado', 'comprado', 'marcar como comprado'
    ];

    for (const trig of triggers) {
      working = working.replace(new RegExp(`\\b${trig}\\b`, 'gi'), ' ');
    }

    let itemName = working
      .replace(/\b(the|my|item|ko|as|completed|purchased|ya)\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return {
      intent: 'COMPLETE_ITEM',
      confidence: 0.9,
      rawText,
      item: itemName,
      spokenFeedback: `Marked ${itemName || 'item'} as purchased.`,
    };
  }

  /**
   * Parse SEARCH_PRODUCT & FILTER_PRODUCT commands (e.g. "Find organic apples under 200 rupees")
   */
  private parseSearchOrFilter(rawText: string, clean: string): ParsedVoiceCommand {
    let working = clean;

    // Price extraction: "under 200", "below 100", "between 300 and 500", "under 5 dollars", "below 100 rupees"
    let minPrice: number | undefined;
    let maxPrice: number | undefined;

    const betweenMatch = working.match(/between\s+(\d+)\s*(?:and|to|-)\s*(\d+)/i);
    if (betweenMatch) {
      minPrice = parseInt(betweenMatch[1], 10);
      maxPrice = parseInt(betweenMatch[2], 10);
      working = working.replace(betweenMatch[0], ' ');
    } else {
      const underMatch = working.match(/(?:under|below|less than|less|ke andar|se kam|por menos de|menos de)\s*(?:rs|inr|₹|\$)?\s*(\d+)/i);
      if (underMatch) {
        maxPrice = parseInt(underMatch[1], 10);
        working = working.replace(underMatch[0], ' ');
      }
      const aboveMatch = working.match(/(?:above|more than|greater than|se jyada|por mas de)\s*(?:rs|inr|₹|\$)?\s*(\d+)/i);
      if (aboveMatch) {
        minPrice = parseInt(aboveMatch[1], 10);
        working = working.replace(aboveMatch[0], ' ');
      }
    }

    // Clean trigger words
    working = working
      .replace(/\b(find me|search for|look for|show me|find|search|dhoondho|khojo|buscar|encuentra|muestra|rupees|rupee|rs|inr|dollars|dollar)\b/gi, ' ')
      .replace(/\b(me|a|an|the|for|por|favor)\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Check for organic or brand
    let organic = false;
    if (working.includes('organic') || working.includes('organico')) {
      organic = true;
      working = working.replace(/\b(organic|organico)\b/gi, '').trim();
    }

    const query = working.trim();
    const category = this.categorizeItem(query);

    let priceMsg = '';
    if (maxPrice && minPrice) {
      priceMsg = ` between ₹${minPrice} and ₹${maxPrice}`;
    } else if (maxPrice) {
      priceMsg = ` under ₹${maxPrice}`;
    }

    return {
      intent: 'SEARCH_PRODUCT',
      confidence: 0.95,
      rawText,
      item: query,
      filters: {
        query,
        category: category !== 'Other' ? category : undefined,
        minPrice,
        maxPrice,
      },
      attributes: {
        organic,
      },
      spokenFeedback: `Found search results for ${organic ? 'organic ' : ''}${query || 'products'}${priceMsg}.`,
    };
  }

  /**
   * Extract Quantity and Unit from clean string
   */
  public extractQuantityAndUnit(text: string): { quantity: number; unit?: string; remainingText: string } {
    let working = ` ${text} `;
    let quantity = 1;
    let unit: string | undefined;

    // 1. Look for numeric digits (e.g., "2", "2.5", "500")
    const digitMatch = working.match(/\s(\d+(?:\.\d+)?)\s/);
    if (digitMatch) {
      quantity = parseFloat(digitMatch[1]);
      working = working.replace(digitMatch[0], ' ');
    } else {
      // Check explicit number words first (e.g. "two", "three", "five", "दो", "dos")
      let foundExplicit = false;
      for (const [word, num] of Object.entries(NUMBER_WORDS)) {
        if (word === 'a' || word === 'an' || word === 'un' || word === 'una') continue;
        const regex = new RegExp(`\\s${word}\\s`, 'i');
        if (regex.test(working)) {
          quantity = num;
          working = working.replace(regex, ' ');
          foundExplicit = true;
          break;
        }
      }

      // If no explicit number was found, check articles ("a", "an", "un", "una")
      if (!foundExplicit) {
        for (const word of ['a', 'an', 'un', 'una']) {
          const regex = new RegExp(`\\s${word}\\s`, 'i');
          if (regex.test(working)) {
            quantity = 1;
            working = working.replace(regex, ' ');
            break;
          }
        }
      }
    }

    // 2. Look for units
    for (const [alias, standard] of Object.entries(UNIT_MAP)) {
      const regex = new RegExp(`\\s${alias}\\s`, 'i');
      if (regex.test(working)) {
        unit = standard;
        working = working.replace(regex, ' ');
        break;
      }
    }

    const remainingText = working.trim();
    return { quantity, unit, remainingText };
  }

  /**
   * Automatically categorize an item
   */
  public categorizeItem(itemName: string): ProductCategory {
    const lower = itemName.toLowerCase();

    // Check catalog for exact match
    const catalogMatch = store.findProductByName(lower);
    if (catalogMatch) {
      return catalogMatch.category;
    }

    // Check keyword dictionary
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      for (const kw of keywords) {
        if (lower.includes(kw) || kw.includes(lower)) {
          return category as ProductCategory;
        }
      }
    }

    return 'Other';
  }
}

export const nlpService = new NLPService();
