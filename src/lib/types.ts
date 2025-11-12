// Tipos para o aplicativo Emagreça já
export interface User {
  id: string;
  name: string;
  age: number;
  gender: 'masculino' | 'feminino';
  height: number; // metros (ex: 1.75)
  currentWeight: number; // kg
  targetWeight: number; // kg
  goal: 'perder' | 'manter' | 'ganhar';
  fastingProtocol: FastingProtocol;
  createdAt: Date;
}

export interface FastingProtocol {
  type: '16:8' | '18:6' | '20:4' | 'personalizado';
  fastingHours: number;
  eatingHours: number;
}

export interface WaterIntake {
  id: string;
  userId: string;
  amount: number; // ml
  timestamp: Date;
  date: string; // YYYY-MM-DD
}

export interface CalorieEntry {
  id: string;
  userId: string;
  foodName: string;
  calories: number;
  meal: 'cafe' | 'almoco' | 'lanche' | 'jantar';
  timestamp: Date;
  date: string; // YYYY-MM-DD
  nutritionData?: {
    protein: number; // gramas
    carbs: number; // gramas
    fat: number; // gramas
    fiber: number; // gramas
    grams: number; // peso da porção
  };
}

export interface FastingSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // minutes
  date: string; // YYYY-MM-DD
}

export interface DailyStats {
  date: string;
  waterIntake: number; // ml
  waterGoal: number; // ml
  caloriesConsumed: number;
  calorieGoal: number;
  fastingDuration: number; // minutes
  fastingGoal: number; // minutes
}

export interface MotivationalQuote {
  id: string;
  text: string;
  author?: string;
}