'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Utensils } from 'lucide-react';
import { useCalories } from '@/hooks/useHealthData';
import { CalorieEntry } from '@/lib/types';

export default function AddCaloriesModal() {
  const { addCalorieEntry } = useCalories();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    foodName: '',
    calories: '',
    meal: '',
  });

  // Alimentos comuns com calorias aproximadas
  const commonFoods = [
    { name: 'Arroz (1 xícara)', calories: 205 },
    { name: 'Feijão (1 xícara)', calories: 245 },
    { name: 'Frango grelhado (100g)', calories: 165 },
    { name: 'Pão francês (1 unidade)', calories: 135 },
    { name: 'Banana (1 unidade)', calories: 105 },
    { name: 'Maçã (1 unidade)', calories: 95 },
    { name: 'Ovo (1 unidade)', calories: 70 },
    { name: 'Leite integral (1 copo)', calories: 150 },
    { name: 'Iogurte natural (1 pote)', calories: 120 },
    { name: 'Aveia (1 xícara)', calories: 150 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.foodName && formData.calories && formData.meal) {
      addCalorieEntry(
        formData.foodName,
        parseInt(formData.calories),
        formData.meal as CalorieEntry['meal']
      );
      
      // Reset form
      setFormData({ foodName: '', calories: '', meal: '' });
      setIsOpen(false);
    }
  };

  const selectCommonFood = (food: typeof commonFoods[0]) => {
    setFormData(prev => ({
      ...prev,
      foodName: food.name,
      calories: food.calories.toString(),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg">
          <Plus className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Utensils className="w-5 h-5" />
            Adicionar Refeição
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="meal">Refeição</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, meal: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a refeição" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cafe">Café da manhã</SelectItem>
                <SelectItem value="almoco">Almoço</SelectItem>
                <SelectItem value="lanche">Lanche</SelectItem>
                <SelectItem value="jantar">Jantar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Alimentos comuns</Label>
            <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
              {commonFoods.map((food, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto p-2 text-left justify-start"
                  onClick={() => selectCommonFood(food)}
                >
                  <div>
                    <div className="font-medium">{food.name.split('(')[0]}</div>
                    <div className="text-gray-500">{food.calories} kcal</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="foodName">Alimento</Label>
            <Input
              id="foodName"
              placeholder="Ex: Arroz com feijão"
              value={formData.foodName}
              onChange={(e) => setFormData(prev => ({ ...prev, foodName: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="calories">Calorias</Label>
            <Input
              id="calories"
              type="number"
              placeholder="Ex: 300"
              value={formData.calories}
              onChange={(e) => setFormData(prev => ({ ...prev, calories: e.target.value }))}
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              disabled={!formData.foodName || !formData.calories || !formData.meal}
            >
              Adicionar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}