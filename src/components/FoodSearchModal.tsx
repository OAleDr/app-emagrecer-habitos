'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Scan, Plus, Zap, Apple, Beef, Wheat, Droplets } from 'lucide-react';
import { searchFoods, searchByBarcode, calculateNutrition, suggestFoods, FoodItem } from '@/lib/food-database';
import { useCalories } from '@/hooks/useHealthData';

interface FoodSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  userGoal: 'perder' | 'manter' | 'ganhar';
}

export default function FoodSearchModal({ isOpen, onClose, userGoal }: FoodSearchModalProps) {
  const { addCalorieEntry } = useCalories();
  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [selectedPortion, setSelectedPortion] = useState<{ name: string; grams: number } | null>(null);
  const [customGrams, setCustomGrams] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<'cafe' | 'almoco' | 'lanche' | 'jantar'>('almoco');
  const [activeTab, setActiveTab] = useState('search');

  const searchResults = searchFoods(searchQuery);
  const suggestions = suggestFoods(userGoal);

  const handleBarcodeSearch = () => {
    if (barcodeInput.trim()) {
      const food = searchByBarcode(barcodeInput.trim());
      if (food) {
        setSelectedFood(food);
        setActiveTab('details');
      } else {
        alert('Produto não encontrado no banco de dados');
      }
    }
  };

  const handleFoodSelect = (food: FoodItem) => {
    setSelectedFood(food);
    setSelectedPortion(food.commonPortions[0]);
    setActiveTab('details');
  };

  const handleAddFood = () => {
    if (!selectedFood) return;

    const grams = selectedPortion ? selectedPortion.grams : parseFloat(customGrams) || 100;
    const nutrition = calculateNutrition(selectedFood, grams);
    
    const portionName = selectedPortion ? selectedPortion.name : `${grams}g`;
    const foodName = `${selectedFood.name} (${portionName})`;

    addCalorieEntry(selectedMeal, nutrition.calories, foodName, {
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
      fiber: nutrition.fiber,
      grams: grams
    });

    // Reset e fechar
    setSelectedFood(null);
    setSelectedPortion(null);
    setCustomGrams('');
    setSearchQuery('');
    onClose();
  };

  const getCurrentNutrition = () => {
    if (!selectedFood) return null;
    const grams = selectedPortion ? selectedPortion.grams : parseFloat(customGrams) || 100;
    return calculateNutrition(selectedFood, grams);
  };

  const currentNutrition = getCurrentNutrition();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'proteina': return <Beef className="w-4 h-4" />;
      case 'carboidrato': return <Wheat className="w-4 h-4" />;
      case 'fruta': return <Apple className="w-4 h-4" />;
      case 'vegetal': return <Apple className="w-4 h-4" />;
      case 'gordura': return <Droplets className="w-4 h-4" />;
      case 'bebida': return <Droplets className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'proteina': return 'bg-red-100 text-red-800';
      case 'carboidrato': return 'bg-yellow-100 text-yellow-800';
      case 'fruta': return 'bg-green-100 text-green-800';
      case 'vegetal': return 'bg-green-100 text-green-800';
      case 'gordura': return 'bg-purple-100 text-purple-800';
      case 'bebida': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Adicionar Alimento
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search">
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </TabsTrigger>
            <TabsTrigger value="barcode">
              <Scan className="w-4 h-4 mr-2" />
              Código
            </TabsTrigger>
            <TabsTrigger value="details" disabled={!selectedFood}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-4">
            <div>
              <Label>Buscar alimento</Label>
              <Input
                placeholder="Digite o nome do alimento..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-1"
              />
            </div>

            {searchQuery.trim() ? (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Resultados da busca:</h4>
                <div className="grid gap-2 max-h-60 overflow-y-auto">
                  {searchResults.map((food) => (
                    <div
                      key={food.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleFoodSelect(food)}
                    >
                      <div className="flex items-center gap-3">
                        {getCategoryIcon(food.category)}
                        <div>
                          <div className="font-medium text-sm">{food.name}</div>
                          <div className="text-xs text-gray-500">
                            {food.calories} kcal/100g • {food.protein}g prot
                          </div>
                        </div>
                      </div>
                      <Badge className={getCategoryColor(food.category)}>
                        {food.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">
                  Sugestões para {userGoal === 'perder' ? 'perder peso' : userGoal === 'ganhar' ? 'ganhar peso' : 'manter peso'}:
                </h4>
                <div className="grid gap-2 max-h-60 overflow-y-auto">
                  {suggestions.map((food) => (
                    <div
                      key={food.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleFoodSelect(food)}
                    >
                      <div className="flex items-center gap-3">
                        {getCategoryIcon(food.category)}
                        <div>
                          <div className="font-medium text-sm">{food.name}</div>
                          <div className="text-xs text-gray-500">
                            {food.calories} kcal/100g • {food.protein}g prot
                          </div>
                        </div>
                      </div>
                      <Badge className={getCategoryColor(food.category)}>
                        {food.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="barcode" className="space-y-4">
            <div>
              <Label>Código de barras</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  placeholder="Digite ou escaneie o código..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleBarcodeSearch}>
                  <Scan className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Funcionalidade de escaneamento em desenvolvimento. Digite códigos conhecidos para teste.
              </p>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Códigos de teste:</h4>
              <div className="space-y-1 text-xs text-gray-600">
                <div>7891000100103 - Leite Integral</div>
                <div>7891000053508 - Pão Francês</div>
                <div>7891000315507 - Queijo Mussarela</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            {selectedFood && (
              <>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{selectedFood.name}</h3>
                    <Badge className={getCategoryColor(selectedFood.category)}>
                      {selectedFood.category}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 text-center text-xs mb-3">
                    <div>
                      <div className="font-medium">{selectedFood.calories}</div>
                      <div className="text-gray-500">kcal/100g</div>
                    </div>
                    <div>
                      <div className="font-medium">{selectedFood.protein}g</div>
                      <div className="text-gray-500">proteína</div>
                    </div>
                    <div>
                      <div className="font-medium">{selectedFood.carbs}g</div>
                      <div className="text-gray-500">carbs</div>
                    </div>
                    <div>
                      <div className="font-medium">{selectedFood.fat}g</div>
                      <div className="text-gray-500">gordura</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label>Refeição</Label>
                    <Select value={selectedMeal} onValueChange={(value: any) => setSelectedMeal(value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cafe">☕ Café da manhã</SelectItem>
                        <SelectItem value="almoco">🍽️ Almoço</SelectItem>
                        <SelectItem value="lanche">🍪 Lanche</SelectItem>
                        <SelectItem value="jantar">🌙 Jantar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Porção</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {selectedFood.commonPortions.map((portion) => (
                        <Button
                          key={portion.name}
                          variant={selectedPortion?.name === portion.name ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setSelectedPortion(portion);
                            setCustomGrams('');
                          }}
                          className="text-xs"
                        >
                          {portion.name}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="mt-2">
                      <Label className="text-xs">Ou quantidade personalizada (gramas):</Label>
                      <Input
                        type="number"
                        placeholder="Ex: 150"
                        value={customGrams}
                        onChange={(e) => {
                          setCustomGrams(e.target.value);
                          setSelectedPortion(null);
                        }}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {currentNutrition && (
                    <div className="border rounded-lg p-3 bg-green-50">
                      <h4 className="font-medium text-sm mb-2">Valores nutricionais da porção:</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span>Calorias:</span>
                          <span className="font-medium">{currentNutrition.calories} kcal</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Proteína:</span>
                          <span className="font-medium">{currentNutrition.protein}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Carboidratos:</span>
                          <span className="font-medium">{currentNutrition.carbs}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Gordura:</span>
                          <span className="font-medium">{currentNutrition.fat}g</span>
                        </div>
                        {currentNutrition.fiber > 0 && (
                          <div className="flex justify-between">
                            <span>Fibra:</span>
                            <span className="font-medium">{currentNutrition.fiber}g</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <Button onClick={handleAddFood} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar à {selectedMeal === 'cafe' ? 'Café da manhã' : 
                                selectedMeal === 'almoco' ? 'Almoço' : 
                                selectedMeal === 'lanche' ? 'Lanche' : 'Jantar'}
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}