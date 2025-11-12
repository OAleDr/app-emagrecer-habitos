'use client';

import { useState, useEffect } from 'react';
import { User, WaterIntake, CalorieEntry, FastingSession, DailyStats } from '@/lib/types';
import { calculateWaterGoal, calculateCalorieGoal, getCurrentDate, checkAndResetDailyData } from '@/lib/utils-health';

// Hook para gerenciar dados do usuário
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('emagreca-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const saveUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('emagreca-user', JSON.stringify(userData));
  };

  return { user, saveUser, isLoading };
}

// Hook para gerenciar configurações personalizáveis
export function useSettings() {
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    const saved = localStorage.getItem('emagreca-settings');
    if (saved) {
      const settings = JSON.parse(saved);
      setCalorieGoal(settings.calorieGoal || 2000);
    }
  }, []);

  const updateCalorieGoal = (newGoal: number) => {
    setCalorieGoal(newGoal);
    const settings = { calorieGoal: newGoal };
    localStorage.setItem('emagreca-settings', JSON.stringify(settings));
    setLastUpdate(Date.now());
  };

  return { calorieGoal, updateCalorieGoal, lastUpdate };
}

// Hook para gerenciar consumo de água
export function useWaterIntake() {
  const [waterIntakes, setWaterIntakes] = useState<WaterIntake[]>([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    // Verificar e resetar dados diários
    checkAndResetDailyData();
    
    const saved = localStorage.getItem('emagreca-water');
    if (saved) {
      setWaterIntakes(JSON.parse(saved));
    }
  }, []);

  // Verificar reset a cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      const wasReset = checkAndResetDailyData();
      if (wasReset) {
        // Recarregar dados após reset
        const saved = localStorage.getItem('emagreca-water');
        if (saved) {
          setWaterIntakes(JSON.parse(saved));
        } else {
          setWaterIntakes([]);
        }
        setLastUpdate(Date.now());
      }
    }, 60000); // Verificar a cada minuto

    return () => clearInterval(interval);
  }, []);

  const addWaterIntake = (amount: number) => {
    const newIntake: WaterIntake = {
      id: Date.now().toString(),
      userId: 'current-user',
      amount,
      timestamp: new Date(),
      date: getCurrentDate(),
    };

    const updated = [...waterIntakes, newIntake];
    setWaterIntakes(updated);
    localStorage.setItem('emagreca-water', JSON.stringify(updated));
    setLastUpdate(Date.now());
  };

  const removeWaterIntake = (intakeId: string) => {
    const updated = waterIntakes.filter(intake => intake.id !== intakeId);
    setWaterIntakes(updated);
    localStorage.setItem('emagreca-water', JSON.stringify(updated));
    setLastUpdate(Date.now());
  };

  const getTodayWaterIntake = () => {
    const today = getCurrentDate();
    return waterIntakes
      .filter(intake => intake.date === today)
      .reduce((total, intake) => total + intake.amount, 0);
  };

  const getTodayWaterEntries = () => {
    const today = getCurrentDate();
    return waterIntakes.filter(intake => intake.date === today);
  };

  return { 
    waterIntakes, 
    addWaterIntake, 
    removeWaterIntake,
    getTodayWaterIntake, 
    getTodayWaterEntries,
    lastUpdate 
  };
}

// Hook para gerenciar calorias com dados nutricionais completos
export function useCalories() {
  const [calorieEntries, setCalorieEntries] = useState<CalorieEntry[]>([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    // Verificar e resetar dados diários
    checkAndResetDailyData();
    
    const saved = localStorage.getItem('emagreca-calories');
    if (saved) {
      setCalorieEntries(JSON.parse(saved));
    }
  }, []);

  // Atualização em tempo real - verificar mudanças a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      const wasReset = checkAndResetDailyData();
      if (wasReset) {
        // Recarregar dados após reset
        const saved = localStorage.getItem('emagreca-calories');
        if (saved) {
          setCalorieEntries(JSON.parse(saved));
        } else {
          setCalorieEntries([]);
        }
        setLastUpdate(Date.now());
      }
    }, 60000); // Verificar a cada minuto

    return () => clearInterval(interval);
  }, []);

  const addCalorieEntry = (
    meal: CalorieEntry['meal'], 
    calories: number, 
    foodName: string,
    nutritionData?: {
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
      grams: number;
    }
  ) => {
    const newEntry: CalorieEntry = {
      id: Date.now().toString(),
      userId: 'current-user',
      foodName,
      calories,
      meal,
      timestamp: new Date(),
      date: getCurrentDate(),
      nutritionData,
    };

    const updated = [...calorieEntries, newEntry];
    setCalorieEntries(updated);
    localStorage.setItem('emagreca-calories', JSON.stringify(updated));
    setLastUpdate(Date.now());
  };

  const removeCalorieEntry = (entryId: string) => {
    const updated = calorieEntries.filter(entry => entry.id !== entryId);
    setCalorieEntries(updated);
    localStorage.setItem('emagreca-calories', JSON.stringify(updated));
    setLastUpdate(Date.now());
  };

  const updateCalorieEntry = (entryId: string, newCalories: number, newFoodName?: string) => {
    const updated = calorieEntries.map(entry => 
      entry.id === entryId 
        ? { ...entry, calories: newCalories, foodName: newFoodName || entry.foodName }
        : entry
    );
    setCalorieEntries(updated);
    localStorage.setItem('emagreca-calories', JSON.stringify(updated));
    setLastUpdate(Date.now());
  };

  const getTodayCalories = () => {
    const today = getCurrentDate();
    return calorieEntries
      .filter(entry => entry.date === today)
      .reduce((total, entry) => total + entry.calories, 0);
  };

  const getTodayMeals = () => {
    const today = getCurrentDate();
    return calorieEntries.filter(entry => entry.date === today);
  };

  return { 
    calorieEntries, 
    addCalorieEntry, 
    removeCalorieEntry,
    updateCalorieEntry,
    getTodayCalories, 
    getTodayMeals,
    lastUpdate 
  };
}

// Hook para gerenciar jejum
export function useFasting() {
  const [fastingSessions, setFastingSessions] = useState<FastingSession[]>([]);
  const [currentSession, setCurrentSession] = useState<FastingSession | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('emagreca-fasting');
    if (saved) {
      const sessions = JSON.parse(saved);
      setFastingSessions(sessions);
      
      // Verificar se há sessão ativa
      const active = sessions.find((s: FastingSession) => !s.endTime);
      if (active) {
        setCurrentSession(active);
      }
    }
  }, []);

  const startFasting = () => {
    const newSession: FastingSession = {
      id: Date.now().toString(),
      userId: 'current-user',
      startTime: new Date(),
      date: getCurrentDate(),
    };

    const updated = [...fastingSessions, newSession];
    setFastingSessions(updated);
    setCurrentSession(newSession);
    localStorage.setItem('emagreca-fasting', JSON.stringify(updated));
  };

  const endFasting = () => {
    if (!currentSession) return;

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - currentSession.startTime.getTime()) / (1000 * 60));

    const updatedSession = {
      ...currentSession,
      endTime,
      duration,
    };

    const updated = fastingSessions.map(session => 
      session.id === currentSession.id ? updatedSession : session
    );

    setFastingSessions(updated);
    setCurrentSession(null);
    localStorage.setItem('emagreca-fasting', JSON.stringify(updated));
  };

  const getCurrentFastingDuration = () => {
    if (!currentSession) return 0;
    const now = new Date();
    return Math.floor((now.getTime() - currentSession.startTime.getTime()) / (1000 * 60));
  };

  return {
    fastingSessions,
    currentSession,
    startFasting,
    endFasting,
    getCurrentFastingDuration,
    isCurrentlyFasting: !!currentSession,
  };
}