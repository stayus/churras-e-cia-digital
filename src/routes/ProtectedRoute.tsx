
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

// Protected route component that checks user authentication and role
interface ProtectedRouteProps {
  element: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ element, allowedRoles = [] }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if the user has one of the allowed roles
  // Se allowedRoles contém 'employee', consideramos todos os usuários não-customer como funcionários
  if (allowedRoles.length > 0 && user) {
    const isEmployee = user.role !== 'customer';
    
    // Se 'employee' está na lista de funções permitidas e o usuário é um funcionário, permitir acesso
    // Ou se a função específica do usuário está na lista de funções permitidas
    const hasAllowedRole = 
      (allowedRoles.includes('employee') && isEmployee) ||
      allowedRoles.includes(user.role);
    
    if (!hasAllowedRole) {
      // Redirect based on user role
      if (user.role === 'admin') {
        return <Navigate to="/admin" replace />;
      } else if (user.role !== 'customer') {
        // Qualquer funcionário (não cliente) vai para o painel de funcionário
        return <Navigate to="/employee" replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }
  }

  // Check if user needs to change password (first login)
  if (user?.isFirstLogin && window.location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />;
  }

  return <>{element}</>;
};
