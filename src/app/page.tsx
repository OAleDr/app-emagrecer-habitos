'use client';

import { useUser } from '@/hooks/useHealthData';
import Onboarding from '@/components/Onboarding';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const { user, saveUser, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Onboarding onComplete={saveUser} />;
  }

  return <Dashboard user={user} onUserUpdate={saveUser} />;
}