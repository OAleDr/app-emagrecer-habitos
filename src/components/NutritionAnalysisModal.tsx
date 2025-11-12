'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, PieChart, TrendingUp, Calendar, Beef, Wheat, Droplets as Fat } from 'lucide-react';
import { useCalories } from '@/hooks/useHealthData';
import { analyzeMacros } from '@/lib/food-database';

interface NutritionAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  calorieGoal: number;
}

export default function NutritionAnalysisModal({ isOpen, onClose, calorieGoal }: NutritionAnalysisModalProps) {
  const { getTodayMeals, getTodayCalories } = useCalories();
  const [activeTab, setActiveTab] = useState('today');

  const todayMeals = getTodayMeals();
  const todayCalories = getTodayCalories();

  // Calcular macronutrientes do dia
  const mealsWithMacros = todayMeals.map(meal => ({
    protein: meal.nutritionData?.protein || 0,
    carbs: meal.nutritionData?.carbs || 0,
    fat: meal.nutritionData?.fat || 0,
    calories: meal.calories
  }));

  const macroAnalysis = analyzeMacros(mealsWithMacros);

  // Metas recomendadas de macronutrientes (baseado em diretrizes nutricionais)
  const proteinGoal = Math.round(calorieGoal * 0.25 / 4); // 25% das calorias, 4 kcal/g
  const carbsGoal = Math.round(calorieGoal * 0.45 / 4); // 45% das calorias, 4 kcal/g
  const fatGoal = Math.round(calorieGoal * 0.30 / 9); // 30% das calorias, 9 kcal/g

  const proteinProgress = (macroAnalysis.protein.grams / proteinGoal) * 100;
  const carbsProgress = (macroAnalysis.carbs.grams / carbsGoal) * 100;
  const fatProgress = (macroAnalysis.fat.grams / fatGoal) * 100;

  const getProgressColor = (progress: number) => {
    if (progress < 70) return 'bg-red-500';
    if (progress < 90) return 'bg-yellow-500';
    if (progress <= 110) return 'bg-green-500';
    return 'bg-orange-500';
  };

  const getRecommendation = () => {
    const recommendations = [];
    
    if (proteinProgress < 80) {
      recommendations.push('🥩 Adicione mais proteínas (frango, ovos, peixe)');
    }
    if (carbsProgress < 80) {
      recommendations.push('🍠 Inclua carboidratos saudáveis (batata doce, aveia)');
    }
    if (fatProgress < 80) {
      recommendations.push('🥑 Adicione gorduras boas (abacate, castanhas)');
    }
    if (todayCalories < calorieGoal * 0.8) {
      recommendations.push('⚡ Você está comendo poucas calorias hoje');
    }
    if (todayCalories > calorieGoal * 1.2) {
      recommendations.push('⚠️ Cuidado com o excesso de calorias');
    }

    if (recommendations.length === 0) {
      return ['🎉 Excelente balanço nutricional hoje!'];
    }

    return recommendations;
  };

  const getMealsByType = () => {
    const mealTypes = {
      cafe: { name: 'Café da manhã', icon: '☕', meals: [] as any[] },
      almoco: { name: 'Almoço', icon: '🍽️', meals: [] as any[] },
      lanche: { name: 'Lanche', icon: '🍪', meals: [] as any[] },
      jantar: { name: 'Jantar', icon: '🌙', meals: [] as any[] }
    };

    todayMeals.forEach(meal => {
      if (mealTypes[meal.meal as keyof typeof mealTypes]) {
        mealTypes[meal.meal as keyof typeof mealTypes].meals.push(meal);
      }
    });

    return mealTypes;
  };

  const mealsByType = getMealsByType();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Análise Nutricional
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today">
              <Calendar className="w-4 h-4 mr-2" />
              Hoje
            </TabsTrigger>
            <TabsTrigger value="macros">
              <PieChart className="w-4 h-4 mr-2" />
              Macros
            </TabsTrigger>
            <TabsTrigger value="meals">
              <TrendingUp className="w-4 h-4 mr-2" />
              Refeições
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Resumo Calórico */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Resumo Calórico</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Consumidas:</span>
                      <span className="font-bold text-xl">{todayCalories} kcal</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Meta:</span>
                      <span className="text-gray-600">{calorieGoal} kcal</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Restantes:</span>
                      <span className={`font-medium ${calorieGoal - todayCalories >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {calorieGoal - todayCalories} kcal
                      </span>
                    </div>
                    <Progress 
                      value={(todayCalories / calorieGoal) * 100} 
                      className="h-3"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Balanço de Macros */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Distribuição de Macros</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Beef className="w-4 h-4 text-red-500" />
                        <span className="text-sm">Proteína</span>
                      </div>
                      <span className="font-medium">{macroAnalysis.protein.percentage}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wheat className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">Carboidratos</span>
                      </div>
                      <span className="font-medium">{macroAnalysis.carbs.percentage}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Fat className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">Gorduras</span>
                      </div>
                      <span className="font-medium">{macroAnalysis.fat.percentage}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recomendações */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Recomendações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getRecommendation().map((rec, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="macros" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Proteína */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Beef className="w-5 h-5 text-red-500" />
                    Proteína
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {macroAnalysis.protein.grams}g
                      </div>
                      <div className="text-sm text-gray-500">
                        Meta: {proteinGoal}g
                      </div>
                    </div>
                    <Progress 
                      value={proteinProgress} 
                      className={`h-3 ${getProgressColor(proteinProgress)}`}
                    />
                    <div className="text-xs text-center text-gray-600">
                      {Math.round(proteinProgress)}% da meta
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Carboidratos */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Wheat className="w-5 h-5 text-yellow-500" />
                    Carboidratos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {macroAnalysis.carbs.grams}g
                      </div>
                      <div className="text-sm text-gray-500">
                        Meta: {carbsGoal}g
                      </div>
                    </div>
                    <Progress 
                      value={carbsProgress} 
                      className={`h-3 ${getProgressColor(carbsProgress)}`}
                    />
                    <div className="text-xs text-center text-gray-600">
                      {Math.round(carbsProgress)}% da meta
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Gorduras */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Fat className="w-5 h-5 text-purple-500" />
                    Gorduras
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {macroAnalysis.fat.grams}g
                      </div>
                      <div className="text-sm text-gray-500">
                        Meta: {fatGoal}g
                      </div>
                    </div>
                    <Progress 
                      value={fatProgress} 
                      className={`h-3 ${getProgressColor(fatProgress)}`}
                    />
                    <div className="text-xs text-center text-gray-600">
                      {Math.round(fatProgress)}% da meta
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gráfico de distribuição */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Distribuição Calórica</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      {/* Simulação de gráfico de pizza com CSS */}
                      <div className="w-full h-full rounded-full border-8 border-gray-200 relative overflow-hidden">
                        <div 
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: `conic-gradient(
                              #ef4444 0% ${macroAnalysis.protein.percentage}%,
                              #eab308 ${macroAnalysis.protein.percentage}% ${macroAnalysis.protein.percentage + macroAnalysis.carbs.percentage}%,
                              #a855f7 ${macroAnalysis.protein.percentage + macroAnalysis.carbs.percentage}% 100%
                            )`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <span>Proteína</span>
                      </div>
                      <div className="font-medium">{macroAnalysis.protein.percentage}%</div>
                      <div className="text-xs text-gray-500">{macroAnalysis.protein.calories} kcal</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <span>Carbos</span>
                      </div>
                      <div className="font-medium">{macroAnalysis.carbs.percentage}%</div>
                      <div className="text-xs text-gray-500">{macroAnalysis.carbs.calories} kcal</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <div className="w-3 h-3 bg-purple-500 rounded-full" />
                        <span>Gorduras</span>
                      </div>
                      <div className="font-medium">{macroAnalysis.fat.percentage}%</div>
                      <div className="text-xs text-gray-500">{macroAnalysis.fat.calories} kcal</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meals" className="space-y-4">
            {Object.entries(mealsByType).map(([mealType, mealData]) => (
              <Card key={mealType}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="text-xl">{mealData.icon}</span>
                    {mealData.name}
                    <Badge variant="secondary">
                      {mealData.meals.reduce((sum, meal) => sum + meal.calories, 0)} kcal
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {mealData.meals.length === 0 ? (
                    <p className="text-gray-500 text-sm">Nenhum alimento registrado</p>
                  ) : (
                    <div className="space-y-2">
                      {mealData.meals.map((meal) => (
                        <div key={meal.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium text-sm">{meal.foodName}</div>
                            {meal.nutritionData && (
                              <div className="text-xs text-gray-500">
                                P: {meal.nutritionData.protein}g • 
                                C: {meal.nutritionData.carbs}g • 
                                G: {meal.nutritionData.fat}g
                              </div>
                            )}
                          </div>
                          <div className="text-sm font-medium">
                            {meal.calories} kcal
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}