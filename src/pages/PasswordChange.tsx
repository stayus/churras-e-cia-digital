
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import PasswordChangeForm from '@/components/auth/PasswordChangeForm';
import PasswordChangeHeader from '@/components/auth/PasswordChangeHeader';
import PasswordChangeInfo from '@/components/auth/PasswordChangeInfo';
import LoadingScreen from '@/components/auth/LoadingScreen';

const PasswordChangePage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If the user is not logged in or does not need to change their password, redirect them
    if (!isLoading && (!user || !user.isFirstLogin)) {
      // Redirect based on user role
      if (user?.role === 'admin' || user?.role === 'employee') {
        navigate('/admin');
      } else if (user?.role === 'motoboy') {
        navigate('/motoboy');
      } else if (user?.role === 'customer') {
        navigate('/catalogo');
      } else {
        navigate('/login');
      }
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-15"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-red-900/70 to-black/85"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mb-6 shadow-2xl animate-pulse">
            <span className="text-white font-bold text-2xl">🔒</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent mb-2">
            Alterar Senha
          </h1>
          <p className="text-gray-300">Por segurança, altere sua senha padrão</p>
        </div>

        <Card className="bg-gray-900/90 backdrop-blur-sm border-gray-700 shadow-2xl animate-scale-in">
          <CardHeader className="space-y-1">
            <PasswordChangeHeader userName={user.name} />
          </CardHeader>
          <CardContent>
            <PasswordChangeForm user={user} />
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <PasswordChangeInfo />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PasswordChangePage;
