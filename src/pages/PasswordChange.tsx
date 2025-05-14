
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
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
  );
};

export default PasswordChangePage;
