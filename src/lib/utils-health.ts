import { User, DailyStats } from './types';

// Calcular meta diária de água (35ml por kg)
export function calculateWaterGoal(weight: number): number {
  return Math.round(weight * 35);
}

// Meta fixa de calorias: 2000 kcal
export function calculateCalorieGoal(user: User): number {
  return 2000; // Meta fixa de 2000 calorias
}

// Calcular progresso percentual
export function calculateProgress(current: number, goal: number): number {
  if (goal === 0) return 0;
  return Math.min(Math.round((current / goal) * 100), 100);
}

// Formatar tempo de jejum
export function formatFastingTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

// Verificar se está em jejum
export function isCurrentlyFasting(lastFastingSession: any): boolean {
  if (!lastFastingSession || lastFastingSession.endTime) return false;
  return true;
}

// Calcular tempo de jejum atual
export function getCurrentFastingTime(startTime: Date): number {
  const now = new Date();
  const diffMs = now.getTime() - startTime.getTime();
  return Math.floor(diffMs / (1000 * 60)); // em minutos
}

// Obter data atual no formato YYYY-MM-DD
export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Verificar se é um novo dia e resetar dados se necessário
export function checkAndResetDailyData() {
  const today = getCurrentDate();
  const lastResetDate = localStorage.getItem('emagreca-last-reset');
  
  if (lastResetDate !== today) {
    // É um novo dia, resetar dados
    const waterData = JSON.parse(localStorage.getItem('emagreca-water') || '[]');
    const calorieData = JSON.parse(localStorage.getItem('emagreca-calories') || '[]');
    
    // Manter apenas dados históricos (não de hoje)
    const filteredWater = waterData.filter((item: any) => item.date !== today);
    const filteredCalories = calorieData.filter((item: any) => item.date !== today);
    
    localStorage.setItem('emagreca-water', JSON.stringify(filteredWater));
    localStorage.setItem('emagreca-calories', JSON.stringify(filteredCalories));
    localStorage.setItem('emagreca-last-reset', today);
    
    return true; // Indica que houve reset
  }
  
  return false; // Não houve reset
}

// Frases motivacionais
export const motivationalQuotes = [
  { text: "Cada gota conta! 💧", author: "" },
  { text: "Você está mais forte do que pensa! 💪", author: "" },
  { text: "Pequenos passos, grandes resultados! 🚶‍♀️", author: "" },
  { text: "Seu corpo agradece cada escolha saudável! ❤️", author: "" },
  { text: "O jejum fortalece corpo e mente! 🧠", author: "" },
  { text: "Hidratação é vida! 🌊", author: "" },
  { text: "Você está no caminho certo! ✨", author: "" },
];

// Obter frase motivacional aleatória
export function getRandomQuote() {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
}