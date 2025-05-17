
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

// Protected route component that checks user authentication and role
interface ProtectedRouteProps {
  element: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ element, allowedRoles = [] }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  useEffect(() => {
    console.log("ProtectedRoute - Auth state:", { 
      isAuthenticated, 
      isLoading, 
      userRole: user?.role,
      requiredRoles: allowedRoles
    });
  }, [isAuthenticated, isLoading, user, allowedRoles]);

  if (isLoading) {
    console.log("ProtectedRoute - Loading...");
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }

  if (!isAuthenticated) {
    console.log("ProtectedRoute - Not authenticated, redirecting to login");
    // Redirecionar para página de login apropriada com base no papel esperado
    if (allowedRoles.includes('admin') || 
        allowedRoles.includes('employee') || 
        allowedRoles.includes('motoboy') ||
        allowedRoles.includes('tesoureiro') || 
        allowedRoles.includes('analista') || 
        allowedRoles.includes('cozinheira')) {
      return <Navigate to="/employee-login" replace />;
    }
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
      console.log("ProtectedRoute - User does not have required role. Redirecting based on role:", user.role);
      // Redirect based on user role
      if (user.role === 'admin') {
        return <Navigate to="/admin" replace />;
      } else if (user.role === 'motoboy') {
        return <Navigate to="/motoboy" replace />;
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
    console.log("ProtectedRoute - First login, redirecting to password change");
    return <Navigate to="/change-password" replace />;
  }

  console.log("ProtectedRoute - Access granted");
  return <>{element}</>;
};
