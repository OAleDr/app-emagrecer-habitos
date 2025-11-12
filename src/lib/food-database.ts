// Base de dados de alimentos com informações nutricionais completas
export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  barcode?: string;
  calories: number; // por 100g
  protein: number; // gramas por 100g
  carbs: number; // gramas por 100g
  fat: number; // gramas por 100g
  fiber?: number; // gramas por 100g
  sugar?: number; // gramas por 100g
  sodium?: number; // mg por 100g
  category: 'proteina' | 'carboidrato' | 'gordura' | 'vegetal' | 'fruta' | 'bebida' | 'doce' | 'processado';
  commonPortions: {
    name: string;
    grams: number;
  }[];
}

export const FOOD_DATABASE: FoodItem[] = [
  // Proteínas
  {
    id: 'frango-peito',
    name: 'Peito de Frango',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    category: 'proteina',
    commonPortions: [
      { name: '1 filé médio', grams: 120 },
      { name: '1 fatia', grams: 30 },
      { name: '100g', grams: 100 }
    ]
  },
  {
    id: 'ovo',
    name: 'Ovo de Galinha',
    calories: 155,
    protein: 13,
    carbs: 1.1,
    fat: 11,
    category: 'proteina',
    commonPortions: [
      { name: '1 ovo grande', grams: 50 },
      { name: '2 ovos', grams: 100 },
      { name: '1 clara', grams: 33 }
    ]
  },
  {
    id: 'salmao',
    name: 'Salmão',
    calories: 208,
    protein: 20,
    carbs: 0,
    fat: 13,
    category: 'proteina',
    commonPortions: [
      { name: '1 filé médio', grams: 150 },
      { name: '1 fatia', grams: 80 },
      { name: '100g', grams: 100 }
    ]
  },

  // Carboidratos
  {
    id: 'arroz-branco',
    name: 'Arroz Branco Cozido',
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    fiber: 0.4,
    category: 'carboidrato',
    commonPortions: [
      { name: '1 xícara', grams: 158 },
      { name: '1 colher de servir', grams: 45 },
      { name: '100g', grams: 100 }
    ]
  },
  {
    id: 'batata-doce',
    name: 'Batata Doce Cozida',
    calories: 86,
    protein: 1.6,
    carbs: 20,
    fat: 0.1,
    fiber: 3,
    sugar: 4.2,
    category: 'carboidrato',
    commonPortions: [
      { name: '1 batata média', grams: 128 },
      { name: '1 fatia', grams: 35 },
      { name: '100g', grams: 100 }
    ]
  },
  {
    id: 'aveia',
    name: 'Aveia em Flocos',
    calories: 389,
    protein: 16.9,
    carbs: 66.3,
    fat: 6.9,
    fiber: 10.6,
    category: 'carboidrato',
    commonPortions: [
      { name: '1 colher de sopa', grams: 10 },
      { name: '1/2 xícara', grams: 40 },
      { name: '100g', grams: 100 }
    ]
  },

  // Frutas
  {
    id: 'banana',
    name: 'Banana',
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    fiber: 2.6,
    sugar: 12,
    category: 'fruta',
    commonPortions: [
      { name: '1 banana média', grams: 118 },
      { name: '1 banana pequena', grams: 81 },
      { name: '100g', grams: 100 }
    ]
  },
  {
    id: 'maca',
    name: 'Maçã',
    calories: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2,
    fiber: 2.4,
    sugar: 10,
    category: 'fruta',
    commonPortions: [
      { name: '1 maçã média', grams: 182 },
      { name: '1 fatia', grams: 25 },
      { name: '100g', grams: 100 }
    ]
  },

  // Vegetais
  {
    id: 'brocolis',
    name: 'Brócolis Cozido',
    calories: 35,
    protein: 2.4,
    carbs: 7,
    fat: 0.4,
    fiber: 2.6,
    category: 'vegetal',
    commonPortions: [
      { name: '1 xícara', grams: 156 },
      { name: '1 raminho', grams: 20 },
      { name: '100g', grams: 100 }
    ]
  },

  // Gorduras
  {
    id: 'abacate',
    name: 'Abacate',
    calories: 160,
    protein: 2,
    carbs: 9,
    fat: 15,
    fiber: 7,
    category: 'gordura',
    commonPortions: [
      { name: '1/2 abacate médio', grams: 100 },
      { name: '1 fatia', grams: 30 },
      { name: '100g', grams: 100 }
    ]
  },
  {
    id: 'amendoim',
    name: 'Amendoim Torrado',
    calories: 567,
    protein: 26,
    carbs: 16,
    fat: 49,
    fiber: 8.5,
    category: 'gordura',
    commonPortions: [
      { name: '1 punhado', grams: 28 },
      { name: '1 colher de sopa', grams: 16 },
      { name: '100g', grams: 100 }
    ]
  },

  // Bebidas
  {
    id: 'leite-integral',
    name: 'Leite Integral',
    calories: 61,
    protein: 3.2,
    carbs: 4.8,
    fat: 3.2,
    category: 'bebida',
    commonPortions: [
      { name: '1 copo (240ml)', grams: 244 },
      { name: '1/2 copo', grams: 122 },
      { name: '100ml', grams: 100 }
    ]
  },

  // Processados comuns
  {
    id: 'pao-frances',
    name: 'Pão Francês',
    calories: 300,
    protein: 9,
    carbs: 58,
    fat: 3.1,
    fiber: 2.3,
    sodium: 628,
    category: 'processado',
    commonPortions: [
      { name: '1 pão (50g)', grams: 50 },
      { name: '1 fatia', grams: 25 },
      { name: '100g', grams: 100 }
    ]
  },
  {
    id: 'queijo-mussarela',
    name: 'Queijo Mussarela',
    calories: 280,
    protein: 25,
    carbs: 3.1,
    fat: 19,
    sodium: 415,
    category: 'proteina',
    commonPortions: [
      { name: '1 fatia', grams: 30 },
      { name: '2 fatias', grams: 60 },
      { name: '100g', grams: 100 }
    ]
  }
];

// Função para buscar alimentos
export function searchFoods(query: string): FoodItem[] {
  if (!query.trim()) return FOOD_DATABASE.slice(0, 10);
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return FOOD_DATABASE.filter(food => 
    food.name.toLowerCase().includes(normalizedQuery) ||
    food.brand?.toLowerCase().includes(normalizedQuery) ||
    food.category.toLowerCase().includes(normalizedQuery)
  ).slice(0, 15);
}

// Função para buscar por código de barras (simulado)
export function searchByBarcode(barcode: string): FoodItem | null {
  // Simulação de alguns códigos de barras conhecidos
  const barcodeMap: { [key: string]: string } = {
    '7891000100103': 'leite-integral',
    '7891000053508': 'pao-frances',
    '7891000315507': 'queijo-mussarela'
  };
  
  const foodId = barcodeMap[barcode];
  return foodId ? FOOD_DATABASE.find(f => f.id === foodId) || null : null;
}

// Função para calcular valores nutricionais por porção
export function calculateNutrition(food: FoodItem, grams: number) {
  const factor = grams / 100;
  
  return {
    calories: Math.round(food.calories * factor),
    protein: Math.round(food.protein * factor * 10) / 10,
    carbs: Math.round(food.carbs * factor * 10) / 10,
    fat: Math.round(food.fat * factor * 10) / 10,
    fiber: food.fiber ? Math.round(food.fiber * factor * 10) / 10 : 0,
    sugar: food.sugar ? Math.round(food.sugar * factor * 10) / 10 : 0,
    sodium: food.sodium ? Math.round(food.sodium * factor) : 0
  };
}

// Função para sugerir alimentos baseado no objetivo
export function suggestFoods(goal: 'perder' | 'manter' | 'ganhar', category?: string): FoodItem[] {
  let suggestions: FoodItem[] = [];
  
  if (goal === 'perder') {
    // Priorizar alimentos com baixa caloria e alta saciedade
    suggestions = FOOD_DATABASE.filter(food => 
      food.calories < 200 && (food.fiber || 0) > 2 || 
      food.category === 'vegetal' || 
      food.category === 'fruta' ||
      (food.category === 'proteina' && food.calories < 200)
    );
  } else if (goal === 'ganhar') {
    // Priorizar alimentos calóricos e nutritivos
    suggestions = FOOD_DATABASE.filter(food => 
      food.calories > 200 || 
      food.category === 'gordura' ||
      (food.category === 'proteina' && food.protein > 20)
    );
  } else {
    // Manter: variedade balanceada
    suggestions = FOOD_DATABASE.filter((_, index) => index % 2 === 0);
  }
  
  if (category) {
    suggestions = suggestions.filter(food => food.category === category);
  }
  
  return suggestions.slice(0, 8);
}

// Função para analisar balanço de macronutrientes
export function analyzeMacros(meals: Array<{ protein: number; carbs: number; fat: number; calories: number }>) {
  const totals = meals.reduce((acc, meal) => ({
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fat: acc.fat + meal.fat,
    calories: acc.calories + meal.calories
  }), { protein: 0, carbs: 0, fat: 0, calories: 0 });
  
  if (totals.calories === 0) {
    return {
      protein: { grams: 0, percentage: 0, calories: 0 },
      carbs: { grams: 0, percentage: 0, calories: 0 },
      fat: { grams: 0, percentage: 0, calories: 0 }
    };
  }
  
  const proteinCalories = totals.protein * 4;
  const carbsCalories = totals.carbs * 4;
  const fatCalories = totals.fat * 9;
  
  return {
    protein: {
      grams: Math.round(totals.protein * 10) / 10,
      percentage: Math.round((proteinCalories / totals.calories) * 100),
      calories: proteinCalories
    },
    carbs: {
      grams: Math.round(totals.carbs * 10) / 10,
      percentage: Math.round((carbsCalories / totals.calories) * 100),
      calories: carbsCalories
    },
    fat: {
      grams: Math.round(totals.fat * 10) / 10,
      percentage: Math.round((fatCalories / totals.calories) * 100),
      calories: fatCalories
    }
  };
}