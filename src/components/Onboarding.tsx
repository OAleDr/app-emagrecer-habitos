'use client';

import { useState } from 'react';
import { User, FastingProtocol } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Target, Clock } from 'lucide-react';

interface OnboardingProps {
  onComplete: (user: User) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    currentWeight: '',
    targetWeight: '',
    goal: '',
    fastingType: '16:8',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    const fastingProtocol: FastingProtocol = {
      type: formData.fastingType as any,
      fastingHours: formData.fastingType === '16:8' ? 16 : formData.fastingType === '18:6' ? 18 : 20,
      eatingHours: formData.fastingType === '16:8' ? 8 : formData.fastingType === '18:6' ? 6 : 4,
    };

    const user: User = {
      id: Date.now().toString(),
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender as 'masculino' | 'feminino',
      height: parseInt(formData.height),
      currentWeight: parseFloat(formData.currentWeight),
      targetWeight: parseFloat(formData.targetWeight),
      goal: formData.goal as 'perder' | 'manter' | 'ganhar',
      fastingProtocol,
      createdAt: new Date(),
    };

    onComplete(user);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name && formData.age && formData.gender;
      case 2:
        return formData.height && formData.currentWeight && formData.targetWeight;
      case 3:
        return formData.goal && formData.fastingType;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full w-16 h-16 flex items-center justify-center">
            {step === 1 && <UserPlus className="w-8 h-8 text-white" />}
            {step === 2 && <Target className="w-8 h-8 text-white" />}
            {step === 3 && <Clock className="w-8 h-8 text-white" />}
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Emagreça já
          </CardTitle>
          <p className="text-gray-600">
            {step === 1 && "Vamos conhecer você melhor"}
            {step === 2 && "Defina suas medidas e objetivos"}
            {step === 3 && "Configure seu plano de jejum"}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Sua idade"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                />
              </div>
              <div>
                <Label>Sexo</Label>
                <Select onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="height">Altura (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="Ex: 170"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="currentWeight">Peso atual (kg)</Label>
                <Input
                  id="currentWeight"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 70.5"
                  value={formData.currentWeight}
                  onChange={(e) => handleInputChange('currentWeight', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="targetWeight">Peso objetivo (kg)</Label>
                <Input
                  id="targetWeight"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 65.0"
                  value={formData.targetWeight}
                  onChange={(e) => handleInputChange('targetWeight', e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label>Objetivo</Label>
                <Select onValueChange={(value) => handleInputChange('goal', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu objetivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="perder">Perder peso</SelectItem>
                    <SelectItem value="manter">Manter peso</SelectItem>
                    <SelectItem value="ganhar">Ganhar massa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Protocolo de jejum</Label>
                <Select 
                  value={formData.fastingType}
                  onValueChange={(value) => handleInputChange('fastingType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16:8">16:8 (16h jejum, 8h alimentação)</SelectItem>
                    <SelectItem value="18:6">18:6 (18h jejum, 6h alimentação)</SelectItem>
                    <SelectItem value="20:4">20:4 (20h jejum, 4h alimentação)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <div className="text-sm text-gray-500">
              Passo {step} de 3
            </div>
            <Button 
              onClick={handleNext}
              disabled={!isStepValid()}
              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
            >
              {step === 3 ? 'Começar' : 'Próximo'}
            </Button>
          </div>

          <div className="flex space-x-2 justify-center">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === step ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}