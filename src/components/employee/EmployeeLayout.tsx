
import React, { ReactNode, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';

interface EmployeeLayoutProps {
  children: ReactNode;
}

const EmployeeLayout: React.FC<EmployeeLayoutProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  console.log("EmployeeLayout - Auth state:", {
    isAuthenticated, 
    isLoading,
    userRole: user?.role
  });

  // Verify if the user is authenticated and is not a customer
  useEffect(() => {
    if (isLoading) {
      return; // Wait until loading is complete
    }
    
    if (!isAuthenticated) {
      console.log("EmployeeLayout - Redirecting to employee login: User not authenticated");
      navigate('/employee-login');
      return;
    }

    // Redirecionar se o usuário for um cliente
    if (!user || user.role === 'customer') {
      console.log("EmployeeLayout - Redirecting: User is a customer");
      navigate('/');
      return;
    }
    
    // Redirecionar se o usuário for um admin (deve usar o painel de admin)
    if (user.role === 'admin') {
      console.log("EmployeeLayout - Redirecting: User is admin");
      navigate('/admin');
      return;
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  // Se ainda estamos verificando autenticação ou o usuário é um cliente, mostrar carregando
  if (isLoading || !isAuthenticated || !user || user.role === 'customer') {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <p className="text-white text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-red-900">
      {children}
    </div>
  );
};

export default EmployeeLayout;
