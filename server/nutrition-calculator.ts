// Comprehensive nutrition calculator for recipes
// Based on USDA nutrient data for common ingredients

interface IngredientNutrition {
  calories: number; // per 100g
  protein: number; // grams per 100g
  carbs: number; // grams per 100g
  fat: number; // grams per 100g
  fiber: number; // grams per 100g
  sugar: number; // grams per 100g
  sodium: number; // mg per 100g
  vitaminC: number; // mg per 100g
  vitaminD: number; // IU per 100g
  calcium: number; // mg per 100g
  iron: number; // mg per 100g
  potassium: number; // mg per 100g
}

// Comprehensive nutrition database for common ingredients
const NUTRITION_DATABASE: { [key: string]: IngredientNutrition } = {
  // Proteins
  'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74, vitaminC: 0, vitaminD: 0, calcium: 15, iron: 0.9, potassium: 256 },
  'salmon': { calories: 208, protein: 22, carbs: 0, fat: 12, fiber: 0, sugar: 0, sodium: 54, vitaminC: 4, vitaminD: 360, calcium: 12, iron: 0.8, potassium: 363 },
  'beef': { calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0, sugar: 0, sodium: 72, vitaminC: 0, vitaminD: 0, calcium: 18, iron: 2.6, potassium: 318 },
  'tuna': { calories: 144, protein: 30, carbs: 0, fat: 1, fiber: 0, sugar: 0, sodium: 45, vitaminC: 0, vitaminD: 154, calcium: 8, iron: 1.0, potassium: 244 },
  'eggs': { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sugar: 1.1, sodium: 124, vitaminC: 0, vitaminD: 87, calcium: 56, iron: 1.8, potassium: 138 },
  'greek yogurt': { calories: 97, protein: 10, carbs: 4, fat: 5, fiber: 0, sugar: 4, sodium: 36, vitaminC: 0, vitaminD: 0, calcium: 110, iron: 0.1, potassium: 141 },
  'cottage cheese': { calories: 98, protein: 11, carbs: 3.4, fat: 4.3, fiber: 0, sugar: 2.7, sodium: 364, vitaminC: 0, vitaminD: 0, calcium: 83, iron: 0.1, potassium: 104 },

  // Grains & Starches
  'quinoa': { calories: 368, protein: 14, carbs: 64, fat: 6, fiber: 7, sugar: 0, sodium: 5, vitaminC: 0, vitaminD: 0, calcium: 47, iron: 4.6, potassium: 563 },
  'brown rice': { calories: 370, protein: 7.9, carbs: 77, fat: 2.9, fiber: 3.5, sugar: 0.7, sodium: 7, vitaminC: 0, vitaminD: 0, calcium: 23, iron: 1.5, potassium: 223 },
  'oats': { calories: 389, protein: 17, carbs: 66, fat: 7, fiber: 11, sugar: 1, sodium: 2, vitaminC: 0, vitaminD: 0, calcium: 54, iron: 5, potassium: 429 },
  'sweet potato': { calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3, sugar: 4.2, sodium: 5, vitaminC: 2.4, vitaminD: 0, calcium: 30, iron: 0.6, potassium: 337 },
  'pasta': { calories: 371, protein: 13, carbs: 75, fat: 1.5, fiber: 3.2, sugar: 2.7, sodium: 6, vitaminC: 0, vitaminD: 0, calcium: 21, iron: 3.3, potassium: 223 },

  // Vegetables
  'spinach': { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, sugar: 0.4, sodium: 79, vitaminC: 28, vitaminD: 0, calcium: 99, iron: 2.7, potassium: 558 },
  'broccoli': { calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, sugar: 1.5, sodium: 33, vitaminC: 89, vitaminD: 0, calcium: 47, iron: 0.7, potassium: 316 },
  'bell pepper': { calories: 31, protein: 1, carbs: 7, fat: 0.3, fiber: 2.5, sugar: 4.2, sodium: 4, vitaminC: 128, vitaminD: 0, calcium: 7, iron: 0.5, potassium: 211 },
  'zucchini': { calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, fiber: 1, sugar: 2.5, sodium: 8, vitaminC: 17, vitaminD: 0, calcium: 16, iron: 0.4, potassium: 261 },
  'cauliflower': { calories: 25, protein: 1.9, carbs: 5, fat: 0.3, fiber: 2, sugar: 1.9, sodium: 30, vitaminC: 48, vitaminD: 0, calcium: 22, iron: 0.4, potassium: 299 },

  // Fruits
  'banana': { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, sugar: 12, sodium: 1, vitaminC: 8.7, vitaminD: 0, calcium: 5, iron: 0.3, potassium: 358 },
  'avocado': { calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7, sugar: 0.7, sodium: 7, vitaminC: 10, vitaminD: 0, calcium: 12, iron: 0.6, potassium: 485 },
  'berries': { calories: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 2.4, sugar: 10, sodium: 1, vitaminC: 58, vitaminD: 0, calcium: 16, iron: 0.4, potassium: 77 },
  'lemon': { calories: 29, protein: 1.1, carbs: 9, fat: 0.3, fiber: 2.8, sugar: 1.5, sodium: 2, vitaminC: 53, vitaminD: 0, calcium: 26, iron: 0.6, potassium: 138 },

  // Fats & Oils
  'olive oil': { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, sugar: 0, sodium: 2, vitaminC: 0, vitaminD: 0, calcium: 1, iron: 0.6, potassium: 1 },
  'coconut oil': { calories: 862, protein: 0, carbs: 0, fat: 100, fiber: 0, sugar: 0, sodium: 0, vitaminC: 0, vitaminD: 0, calcium: 0, iron: 0, potassium: 0 },
  'almonds': { calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12, sugar: 4.4, sodium: 1, vitaminC: 0, vitaminD: 0, calcium: 269, iron: 3.7, potassium: 733 },
  'tahini': { calories: 595, protein: 17, carbs: 21, fat: 54, fiber: 9.3, sugar: 0.5, sodium: 115, vitaminC: 0, vitaminD: 0, calcium: 426, iron: 9, potassium: 414 },

  // Legumes
  'black beans': { calories: 341, protein: 21, carbs: 62, fat: 1.4, fiber: 15, sugar: 0.3, sodium: 2, vitaminC: 0, vitaminD: 0, calcium: 160, iron: 7.1, potassium: 1483 },
  'lentils': { calories: 353, protein: 25, carbs: 60, fat: 1.1, fiber: 11, sugar: 2.0, sodium: 6, vitaminC: 4.5, vitaminD: 0, calcium: 35, iron: 6.5, potassium: 677 },

  // Dairy
  'cheese': { calories: 402, protein: 25, carbs: 1.3, fat: 33, fiber: 0, sugar: 0.5, sodium: 621, vitaminC: 0, vitaminD: 6, calcium: 721, iron: 0.7, potassium: 76 },
  'milk': { calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0, sugar: 5.1, sodium: 44, vitaminC: 0, vitaminD: 51, calcium: 113, iron: 0, potassium: 150 },
};

// Weight conversions for common measurements
const WEIGHT_CONVERSIONS: { [key: string]: number } = {
  'cup': 240, // ml to grams (approximate for most ingredients)
  'tbsp': 15,
  'tsp': 5,
  'oz': 28.35,
  'lb': 453.59,
};

export function calculateNutrition(ingredients: string[], servings: number = 1): {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  vitaminC: number;
  vitaminD: number;
  calcium: number;
  iron: number;
  potassium: number;
} {
  let totalNutrition = {
    calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0,
    sodium: 0, vitaminC: 0, vitaminD: 0, calcium: 0, iron: 0, potassium: 0
  };

  ingredients.forEach(ingredient => {
    const parsed = parseIngredient(ingredient);
    if (parsed) {
      const { amount, unit, name } = parsed;
      const nutrition = findNutritionData(name);
      
      if (nutrition) {
        const weightInGrams = convertToGrams(amount, unit);
        const multiplier = weightInGrams / 100; // nutrition data is per 100g
        
        totalNutrition.calories += nutrition.calories * multiplier;
        totalNutrition.protein += nutrition.protein * multiplier;
        totalNutrition.carbs += nutrition.carbs * multiplier;
        totalNutrition.fat += nutrition.fat * multiplier;
        totalNutrition.fiber += nutrition.fiber * multiplier;
        totalNutrition.sugar += nutrition.sugar * multiplier;
        totalNutrition.sodium += nutrition.sodium * multiplier;
        totalNutrition.vitaminC += nutrition.vitaminC * multiplier;
        totalNutrition.vitaminD += nutrition.vitaminD * multiplier;
        totalNutrition.calcium += nutrition.calcium * multiplier;
        totalNutrition.iron += nutrition.iron * multiplier;
        totalNutrition.potassium += nutrition.potassium * multiplier;
      }
    }
  });

  // Divide by servings and round to reasonable precision
  const perServing = {
    calories: Math.round(totalNutrition.calories / servings),
    protein: Math.round(totalNutrition.protein / servings),
    carbs: Math.round(totalNutrition.carbs / servings),
    fat: Math.round(totalNutrition.fat / servings),
    fiber: Math.round(totalNutrition.fiber / servings),
    sugar: Math.round(totalNutrition.sugar / servings),
    sodium: Math.round(totalNutrition.sodium / servings),
    vitaminC: Math.round(totalNutrition.vitaminC / servings),
    vitaminD: Math.round(totalNutrition.vitaminD / servings),
    calcium: Math.round(totalNutrition.calcium / servings),
    iron: Math.round(totalNutrition.iron / servings * 10) / 10, // 1 decimal place for iron
    potassium: Math.round(totalNutrition.potassium / servings),
  };

  return perServing;
}

function parseIngredient(ingredient: string): { amount: number; unit: string; name: string } | null {
  // Parse ingredient strings like "2 cups quinoa", "1 tbsp olive oil", "8oz chicken breast"
  const regex = /^(\d+(?:\.\d+)?)\s*(\w+)?\s+(.+)$/;
  const match = ingredient.toLowerCase().match(regex);
  
  if (match) {
    const amount = parseFloat(match[1]);
    const unit = match[2] || 'piece';
    const name = match[3].trim();
    return { amount, unit, name };
  }
  
  // Default fallback for unstructured ingredients
  return { amount: 100, unit: 'g', name: ingredient.toLowerCase() };
}

function findNutritionData(ingredientName: string): IngredientNutrition | null {
  // Direct match
  if (NUTRITION_DATABASE[ingredientName]) {
    return NUTRITION_DATABASE[ingredientName];
  }
  
  // Fuzzy matching for common variations
  for (const [key, nutrition] of Object.entries(NUTRITION_DATABASE)) {
    if (ingredientName.includes(key) || key.includes(ingredientName)) {
      return nutrition;
    }
  }
  
  // Category-based defaults for unknown ingredients
  if (ingredientName.includes('meat') || ingredientName.includes('chicken') || ingredientName.includes('beef')) {
    return NUTRITION_DATABASE['chicken breast'];
  }
  if (ingredientName.includes('vegetable') || ingredientName.includes('greens')) {
    return NUTRITION_DATABASE['spinach'];
  }
  if (ingredientName.includes('grain') || ingredientName.includes('rice')) {
    return NUTRITION_DATABASE['brown rice'];
  }
  
  return null;
}

function convertToGrams(amount: number, unit: string): number {
  const normalizedUnit = unit.toLowerCase();
  
  if (WEIGHT_CONVERSIONS[normalizedUnit]) {
    return amount * WEIGHT_CONVERSIONS[normalizedUnit];
  }
  
  // Default conversions
  switch (normalizedUnit) {
    case 'g':
    case 'gram':
    case 'grams':
      return amount;
    case 'kg':
    case 'kilogram':
    case 'kilograms':
      return amount * 1000;
    case 'piece':
    case 'pieces':
    case 'item':
    case 'items':
      return amount * 100; // Assume 100g per piece
    default:
      return amount * 100; // Default assumption
  }
}