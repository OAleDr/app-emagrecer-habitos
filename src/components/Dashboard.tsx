'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Droplets, Flame, Clock, Plus, Play, Square, UtensilsCrossed, Trash2, Settings, Edit3, Save, X, User as UserIcon, Scale, Search, BarChart3 } from 'lucide-react';
import { User } from '@/lib/types';
import { useWaterIntake, useCalories, useFasting, useSettings } from '@/hooks/useHealthData';
import { calculateWaterGoal, calculateProgress, formatFastingTime, getRandomQuote } from '@/lib/utils-health';
import AddCaloriesModal from './AddCaloriesModal';
import FoodSearchModal from './FoodSearchModal';
import NutritionAnalysisModal from './NutritionAnalysisModal';

interface DashboardProps {
  user: User;
  onUserUpdate: (updatedUser: User) => void;
}

export default function Dashboard({ user, onUserUpdate }: DashboardProps) {
  const { addWaterIntake, removeWaterIntake, getTodayWaterIntake, getTodayWaterEntries, lastUpdate: waterLastUpdate } = useWaterIntake();
  const { getTodayCalories, getTodayMeals, removeCalorieEntry, updateCalorieEntry, lastUpdate: caloriesLastUpdate } = useCalories();
  const { currentSession, startFasting, endFasting, getCurrentFastingDuration, isCurrentlyFasting } = useFasting();
  const { calorieGoal, updateCalorieGoal, lastUpdate: settingsLastUpdate } = useSettings();
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [motivationalQuote, setMotivationalQuote] = useState(getRandomQuote());
  const [showMeals, setShowMeals] = useState(false);
  const [showWaterEntries, setShowWaterEntries] = useState(false);
  const [showPersonalData, setShowPersonalData] = useState(false);
  const [editingMeal, setEditingMeal] = useState<string | null>(null);
  const [editingCalories, setEditingCalories] = useState('');
  const [editingFoodName, setEditingFoodName] = useState('');
  
  // Estados para customização de água
  const [showWaterCustom, setShowWaterCustom] = useState(false);
  const [customWaterAmount, setCustomWaterAmount] = useState('');
  
  // Estados para customização de jejum
  const [showFastingCustom, setShowFastingCustom] = useState(false);
  const [tempFastingHours, setTempFastingHours] = useState(user.fastingProtocol.fastingHours);
  
  // Estados para atualização de peso
  const [showWeightUpdate, setShowWeightUpdate] = useState(false);
  const [newWeight, setNewWeight] = useState(user.currentWeight.toString());
  
  // Estados para edição de dados pessoais
  const [editingPersonalData, setEditingPersonalData] = useState(false);
  const [tempUserData, setTempUserData] = useState({
    name: user.name,
    age: user.age,
    gender: user.gender,
    height: user.height,
    currentWeight: user.currentWeight,
    targetWeight: user.targetWeight,
    goal: user.goal,
    fastingProtocol: { ...user.fastingProtocol }
  });

  // Estados para configuração de meta de água
  const [showWaterGoalConfig, setShowWaterGoalConfig] = useState(false);
  const [tempWaterGoal, setTempWaterGoal] = useState(calculateWaterGoal(user.currentWeight));

  // Estados para configuração de meta de calorias
  const [showCalorieGoalConfig, setShowCalorieGoalConfig] = useState(false);
  const [tempCalorieGoal, setTempCalorieGoal] = useState(calorieGoal);

  // Estados para os novos modais do FitCal
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [showNutritionAnalysis, setShowNutritionAnalysis] = useState(false);

  // Atualizar tempo a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Atualizar dados em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      // Força re-render para atualizar valores em tempo real
      setCurrentTime(new Date());
    }, 1000); // Atualiza a cada segundo

    return () => clearInterval(interval);
  }, []);

  // Metas diárias
  const waterGoal = calculateWaterGoal(user.currentWeight);
  const fastingGoal = user.fastingProtocol.fastingHours * 60; // em minutos

  // Progresso atual (recalculado em tempo real)
  const todayWater = getTodayWaterIntake();
  const todayCalories = getTodayCalories();
  const currentFastingDuration = getCurrentFastingDuration();

  // Obter refeições e entradas de água de hoje
  const todayMeals = getTodayMeals();
  const todayWaterEntries = getTodayWaterEntries();

  // Cálculos de progresso
  const waterProgress = calculateProgress(todayWater, waterGoal);
  const calorieProgress = calculateProgress(todayCalories, calorieGoal);
  const fastingProgress = calculateProgress(currentFastingDuration, fastingGoal);

  // Status do dia
  const getStatus = () => {
    const statuses = [];
    if (waterProgress >= 100) statuses.push('💧 Hidratado');
    if (isCurrentlyFasting) statuses.push('⏱️ Em jejum');
    if (calorieProgress >= 80 && calorieProgress <= 110) statuses.push('🍎 Meta calórica');
    
    return statuses.length > 0 ? statuses.join(' • ') : '🌟 Continue assim!';
  };

  const getMealIcon = (meal: string) => {
    switch (meal) {
      case 'cafe': return '☕';
      case 'almoco': return '🍽️';
      case 'lanche': return '🍪';
      case 'jantar': return '🌙';
      default: return '🍴';
    }
  };

  const getMealName = (meal: string) => {
    switch (meal) {
      case 'cafe': return 'Café da manhã';
      case 'almoco': return 'Almoço';
      case 'lanche': return 'Lanche';
      case 'jantar': return 'Jantar';
      default: return 'Refeição';
    }
  };

  const handleEditMeal = (mealId: string, currentCalories: number, currentFoodName: string) => {
    setEditingMeal(mealId);
    setEditingCalories(currentCalories.toString());
    setEditingFoodName(currentFoodName);
  };

  const handleSaveMeal = (mealId: string) => {
    const newCalories = parseInt(editingCalories);
    if (newCalories > 0 && editingFoodName.trim()) {
      updateCalorieEntry(mealId, newCalories, editingFoodName.trim());
      setEditingMeal(null);
      setEditingCalories('');
      setEditingFoodName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingMeal(null);
    setEditingCalories('');
    setEditingFoodName('');
  };

  const handleSavePersonalData = () => {
    const updatedUser: User = {
      ...user,
      ...tempUserData
    };
    onUserUpdate(updatedUser);
    setEditingPersonalData(false);
    setShowPersonalData(false);
  };

  const handleCancelPersonalDataEdit = () => {
    setTempUserData({
      name: user.name,
      age: user.age,
      gender: user.gender,
      height: user.height,
      currentWeight: user.currentWeight,
      targetWeight: user.targetWeight,
      goal: user.goal,
      fastingProtocol: { ...user.fastingProtocol }
    });
    setEditingPersonalData(false);
  };

  const updateFastingProtocol = (type: string) => {
    let fastingHours = 16;
    let eatingHours = 8;
    
    switch (type) {
      case '16:8':
        fastingHours = 16;
        eatingHours = 8;
        break;
      case '18:6':
        fastingHours = 18;
        eatingHours = 6;
        break;
      case '20:4':
        fastingHours = 20;
        eatingHours = 4;
        break;
      case 'personalizado':
        // Manter valores atuais se for personalizado
        fastingHours = tempUserData.fastingProtocol.fastingHours;
        eatingHours = tempUserData.fastingProtocol.eatingHours;
        break;
    }

    setTempUserData(prev => ({
      ...prev,
      fastingProtocol: {
        type: type as any,
        fastingHours,
        eatingHours
      }
    }));
  };

  const handleAddCustomWater = () => {
    const amount = parseInt(customWaterAmount);
    if (amount > 0) {
      addWaterIntake(amount);
      setCustomWaterAmount('');
      setShowWaterCustom(false);
    }
  };

  const handleUpdateFastingProtocol = () => {
    const updatedUser: User = {
      ...user,
      fastingProtocol: {
        ...user.fastingProtocol,
        fastingHours: tempFastingHours,
        eatingHours: 24 - tempFastingHours
      }
    };
    onUserUpdate(updatedUser);
    setShowFastingCustom(false);
  };

  const handleUpdateWeight = () => {
    const weight = parseFloat(newWeight);
    if (weight > 0) {
      const updatedUser: User = {
        ...user,
        currentWeight: weight
      };
      onUserUpdate(updatedUser);
      setShowWeightUpdate(false);
    }
  };

  const handleSaveCalorieGoal = () => {
    updateCalorieGoal(tempCalorieGoal);
    setShowCalorieGoalConfig(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 pb-20">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Olá, {user.name}! 👋
          </h1>
          <div className="flex items-center gap-2">
            <Dialog open={showPersonalData} onOpenChange={setShowPersonalData}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <UserIcon className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Dados Pessoais</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {editingPersonalData ? (
                    <>
                      <div>
                        <Label>Nome</Label>
                        <Input
                          value={tempUserData.name}
                          onChange={(e) => setTempUserData(prev => ({ ...prev, name: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label>Idade</Label>
                        <Input
                          type="number"
                          value={tempUserData.age}
                          onChange={(e) => setTempUserData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                          className="mt-1"
                          min="1"
                          max="120"
                        />
                      </div>
                      
                      <div>
                        <Label>Gênero</Label>
                        <Select 
                          value={tempUserData.gender} 
                          onValueChange={(value) => setTempUserData(prev => ({ ...prev, gender: value as 'masculino' | 'feminino' }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="masculino">Masculino</SelectItem>
                            <SelectItem value="feminino">Feminino</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Altura (m)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={tempUserData.height}
                          onChange={(e) => setTempUserData(prev => ({ ...prev, height: parseFloat(e.target.value) || 0 }))}
                          className="mt-1"
                          min="1.0"
                          max="2.5"
                          placeholder="Ex: 1.75"
                        />
                      </div>
                      
                      <div>
                        <Label>Peso Atual (kg)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={tempUserData.currentWeight}
                          onChange={(e) => setTempUserData(prev => ({ ...prev, currentWeight: parseFloat(e.target.value) || 0 }))}
                          className="mt-1"
                          min="30"
                          max="300"
                        />
                      </div>
                      
                      <div>
                        <Label>Peso Meta (kg)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={tempUserData.targetWeight}
                          onChange={(e) => setTempUserData(prev => ({ ...prev, targetWeight: parseFloat(e.target.value) || 0 }))}
                          className="mt-1"
                          min="30"
                          max="300"
                        />
                      </div>
                      
                      <div>
                        <Label>Objetivo</Label>
                        <Select 
                          value={tempUserData.goal} 
                          onValueChange={(value) => setTempUserData(prev => ({ ...prev, goal: value as 'perder' | 'manter' | 'ganhar' }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="perder">Perder peso</SelectItem>
                            <SelectItem value="manter">Manter peso</SelectItem>
                            <SelectItem value="ganhar">Ganhar peso</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Protocolo de Jejum</Label>
                        <Select 
                          value={tempUserData.fastingProtocol.type} 
                          onValueChange={updateFastingProtocol}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="16:8">16:8 (16h jejum, 8h alimentação)</SelectItem>
                            <SelectItem value="18:6">18:6 (18h jejum, 6h alimentação)</SelectItem>
                            <SelectItem value="20:4">20:4 (20h jejum, 4h alimentação)</SelectItem>
                            <SelectItem value="personalizado">Personalizado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {tempUserData.fastingProtocol.type === 'personalizado' && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label>Horas de Jejum</Label>
                            <Input
                              type="number"
                              value={tempUserData.fastingProtocol.fastingHours}
                              onChange={(e) => setTempUserData(prev => ({
                                ...prev,
                                fastingProtocol: {
                                  ...prev.fastingProtocol,
                                  fastingHours: parseInt(e.target.value) || 0,
                                  eatingHours: 24 - (parseInt(e.target.value) || 0)
                                }
                              }))}
                              className="mt-1"
                              min="12"
                              max="23"
                            />
                          </div>
                          <div>
                            <Label>Horas de Alimentação</Label>
                            <Input
                              type="number"
                              value={tempUserData.fastingProtocol.eatingHours}
                              disabled
                              className="mt-1 bg-gray-100"
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2 pt-4">
                        <Button onClick={handleSavePersonalData} className="flex-1">
                          <Save className="w-4 h-4 mr-2" />
                          Salvar
                        </Button>
                        <Button variant="outline" onClick={handleCancelPersonalDataEdit} className="flex-1">
                          <X className="w-4 h-4 mr-2" />
                          Cancelar
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Nome:</span>
                          <span className="font-medium">{user.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Idade:</span>
                          <span className="font-medium">{user.age} anos</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Gênero:</span>
                          <span className="font-medium capitalize">{user.gender}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Altura:</span>
                          <span className="font-medium">{user.height}m</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Peso Atual:</span>
                          <span className="font-medium">{user.currentWeight} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Peso Meta:</span>
                          <span className="font-medium">{user.targetWeight} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Objetivo:</span>
                          <span className="font-medium capitalize">{user.goal} peso</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Protocolo:</span>
                          <span className="font-medium">{user.fastingProtocol.type}</span>
                        </div>
                        
                        <div className="border-t pt-3">
                          <div className="text-sm text-gray-600 mb-2">IMC Atual:</div>
                          <div className="font-medium">
                            {((user.currentWeight / (user.height ** 2))).toFixed(1)}
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">Diferença para Meta:</div>
                        <div className="font-medium">
                          {user.currentWeight > user.targetWeight 
                            ? `${(user.currentWeight - user.targetWeight).toFixed(1)} kg para perder`
                            : user.currentWeight < user.targetWeight
                            ? `${(user.targetWeight - user.currentWeight).toFixed(1)} kg para ganhar`
                            : 'Meta atingida! 🎉'
                          }
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => setEditingPersonalData(true)} 
                        className="w-full mt-4"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Editar Dados
                      </Button>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            
            <div className="text-sm text-gray-600">
              {currentTime.toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 mb-4">
          <p className="text-center text-gray-700 font-medium">
            {motivationalQuote.text}
          </p>
        </div>

        <Badge variant="secondary" className="bg-green-100 text-green-800">
          {getStatus()}
        </Badge>
      </div>

      {/* Cards principais */}
      <div className="grid gap-4 mb-6">
        {/* Card Água */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-blue-700">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5" />
                Hidratação
              </div>
              <div className="flex gap-2">
                <Dialog open={showWaterEntries} onOpenChange={setShowWaterEntries}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Droplets className="w-4 h-4 mr-1" />
                      Ver Registros
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Registros de Água Hoje</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                      {todayWaterEntries.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">
                          Nenhum registro de água hoje
                        </p>
                      ) : (
                        todayWaterEntries.map((entry) => (
                          <div key={entry.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">💧</span>
                              <div>
                                <div className="font-medium text-sm">{entry.amount}ml</div>
                                <div className="text-xs text-gray-500">
                                  {new Date(entry.timestamp).toLocaleTimeString('pt-BR', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeWaterIntake(entry.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))
                      )}
                      <div className="border-t pt-3 mt-4">
                        <div className="flex justify-between items-center font-semibold">
                          <span>Total do dia:</span>
                          <span className="text-blue-600">{todayWater}ml</span>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={showWaterGoalConfig} onOpenChange={setShowWaterGoalConfig}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Configurar Meta de Água</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Meta de Água Diária (ml)</Label>
                        <Input
                          type="number"
                          value={tempWaterGoal}
                          onChange={(e) => setTempWaterGoal(parseInt(e.target.value) || 0)}
                          className="mt-1"
                          min="1000"
                          max="5000"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Recomendado: {calculateWaterGoal(user.currentWeight)}ml baseado no seu peso
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => setShowWaterGoalConfig(false)} className="flex-1">
                          <Save className="w-4 h-4 mr-2" />
                          Salvar
                        </Button>
                        <Button variant="outline" onClick={() => setShowWaterGoalConfig(false)} className="flex-1">
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">
                  {todayWater}ml
                </span>
                <span className="text-sm text-gray-600">
                  Meta: {waterGoal}ml
                </span>
              </div>
              <Progress value={waterProgress} className="h-3" />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => addWaterIntake(200)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  200ml
                </Button>
                <Button
                  size="sm"
                  onClick={() => addWaterIntake(300)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  300ml
                </Button>
                <Button
                  size="sm"
                  onClick={() => addWaterIntake(500)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  500ml
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card Calorias */}
        <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-orange-700">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5" />
                Calorias
              </div>
              <div className="flex gap-2">
                <Dialog open={showMeals} onOpenChange={setShowMeals}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs">
                      <UtensilsCrossed className="w-4 h-4 mr-1" />
                      Ver Refeições
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Refeições de Hoje</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                      {todayMeals.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">
                          Nenhuma refeição registrada hoje
                        </p>
                      ) : (
                        todayMeals.map((meal) => (
                          <div key={meal.id} className="p-3 bg-gray-50 rounded-lg">
                            {editingMeal === meal.id ? (
                              <div className="space-y-2">
                                <Input
                                  value={editingFoodName}
                                  onChange={(e) => setEditingFoodName(e.target.value)}
                                  placeholder="Nome do alimento"
                                />
                                <Input
                                  type="number"
                                  value={editingCalories}
                                  onChange={(e) => setEditingCalories(e.target.value)}
                                  placeholder="Calorias"
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={() => handleSaveMeal(meal.id)}>
                                    <Save className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">{getMealIcon(meal.meal)}</span>
                                  <div>
                                    <div className="font-medium text-sm">{meal.foodName}</div>
                                    <div className="text-xs text-gray-500">
                                      {getMealName(meal.meal)} • {meal.calories} kcal
                                      {meal.nutritionData && (
                                        <span className="ml-1">
                                          • P: {meal.nutritionData.protein}g C: {meal.nutritionData.carbs}g G: {meal.nutritionData.fat}g
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditMeal(meal.id, meal.calories, meal.foodName)}
                                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeCalorieEntry(meal.id)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                      <div className="border-t pt-3 mt-4">
                        <div className="flex justify-between items-center font-semibold">
                          <span>Total do dia:</span>
                          <span className="text-orange-600">{todayCalories} kcal</span>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => setShowNutritionAnalysis(true)}
                >
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Análise
                </Button>
                
                <Dialog open={showCalorieGoalConfig} onOpenChange={setShowCalorieGoalConfig}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Settings className="w-4 h-4 mr-1" />
                      Meta
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Configurar Meta de Calorias</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Meta de Calorias Diária</Label>
                        <Input
                          type="number"
                          value={tempCalorieGoal}
                          onChange={(e) => setTempCalorieGoal(parseInt(e.target.value) || 0)}
                          className="mt-1"
                          min="1"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveCalorieGoal} className="flex-1">
                          <Save className="w-4 h-4 mr-2" />
                          Salvar
                        </Button>
                        <Button variant="outline" onClick={() => setShowCalorieGoalConfig(false)} className="flex-1">
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-orange-600">
                  {todayCalories}
                </span>
                <span className="text-sm text-gray-600">
                  Meta: {calorieGoal} kcal
                </span>
              </div>
              <Progress value={calorieProgress} className="h-3" />
              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Restam: {Math.max(0, calorieGoal - todayCalories)} kcal
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setShowFoodSearch(true)}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  <Search className="w-4 h-4 mr-1" />
                  Buscar Alimento
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card Jejum */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-purple-700">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Jejum Intermitente
              </div>
              <Dialog open={showFastingCustom} onOpenChange={setShowFastingCustom}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Customizar Protocolo de Jejum</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Horas de Jejum</Label>
                      <Input
                        type="number"
                        value={tempFastingHours}
                        onChange={(e) => setTempFastingHours(parseInt(e.target.value) || 16)}
                        className="mt-1"
                        min="12"
                        max="23"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Horas de alimentação: {24 - tempFastingHours}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleUpdateFastingProtocol} className="flex-1">
                        <Save className="w-4 h-4 mr-2" />
                        Salvar
                      </Button>
                      <Button variant="outline" onClick={() => setShowFastingCustom(false)} className="flex-1">
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-purple-600">
                  {formatFastingTime(currentFastingDuration)}
                </span>
                <span className="text-sm text-gray-600">
                  Meta: {user.fastingProtocol.fastingHours}h
                </span>
              </div>
              <Progress value={fastingProgress} className="h-3" />
              <div className="flex gap-2">
                {!isCurrentlyFasting ? (
                  <Button
                    onClick={startFasting}
                    className="flex-1 bg-purple-500 hover:bg-purple-600"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Iniciar Jejum
                  </Button>
                ) : (
                  <Button
                    onClick={endFasting}
                    variant="outline"
                    className="flex-1 border-purple-500 text-purple-600 hover:bg-purple-50"
                  >
                    <Square className="w-4 h-4 mr-1" />
                    Encerrar Jejum
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo do progresso */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-gray-700">
            Progresso de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{waterProgress}%</div>
              <div className="text-xs text-gray-600">Água</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{calorieProgress}%</div>
              <div className="text-xs text-gray-600">Calorias</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{fastingProgress}%</div>
              <div className="text-xs text-gray-600">Jejum</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações do usuário */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <div className="flex justify-center gap-4 mb-2">
          <p>Peso atual: {user.currentWeight}kg → Objetivo: {user.targetWeight}kg</p>
          <Dialog open={showWeightUpdate} onOpenChange={setShowWeightUpdate}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Scale className="w-4 h-4 mr-1" />
                Atualizar Peso
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Atualizar Peso Atual</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Novo Peso (kg)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="mt-1"
                    min="30"
                    max="300"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleUpdateWeight} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Atualizar
                  </Button>
                  <Button variant="outline" onClick={() => setShowWeightUpdate(false)} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <p>Protocolo: {user.fastingProtocol.type}</p>
        <p>Meta diária: {calorieGoal} kcal (customizável)</p>
      </div>

      {/* Modal para adicionar calorias */}
      <AddCaloriesModal />

      {/* Novos modais do FitCal */}
      <FoodSearchModal 
        isOpen={showFoodSearch} 
        onClose={() => setShowFoodSearch(false)}
        userGoal={user.goal}
      />

      <NutritionAnalysisModal
        isOpen={showNutritionAnalysis}
        onClose={() => setShowNutritionAnalysis(false)}
        calorieGoal={calorieGoal}
      />
    </div>
  );
}