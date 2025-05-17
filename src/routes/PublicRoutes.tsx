import React from 'react';
import { Route } from 'react-router-dom';

// Pages
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import RegisterSuccessPage from "@/pages/RegisterSuccess";
import EmailConfirmedPage from "@/pages/EmailConfirmed";
import EmployeeLoginPage from "@/pages/EmployeeLogin";
import NotFound from "@/pages/NotFound";
import PasswordChangePage from "@/pages/PasswordChange";

import { ProtectedRoute } from './ProtectedRoute';

const PublicRoutes: React.FC = () => (
  <>
    {/* Public routes */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/registro" element={<RegisterPage />} />
    <Route path="/registro-concluido" element={<RegisterSuccessPage />} />
    <Route path="/email-confirmado" element={<EmailConfirmedPage />} />
    {/* Keep email-confirmation as a duplicate route to handle both URL formats */}
    <Route path="/email-confirmation" element={<EmailConfirmedPage />} />
    <Route path="/employee-login" element={<EmployeeLoginPage />} />
    
    {/* Protected routes with role-based access */}
    <Route 
      path="/change-password" 
      element={
        <ProtectedRoute 
          element={<PasswordChangePage />} 
          // Permitir qualquer funcionário, não apenas aqueles com role específico
          allowedRoles={['admin', 'employee', 'motoboy', 'tesoureiro', 'analista', 'cozinheira']} 
        />
      } 
    />
    
    {/* Catch all route */}
    <Route path="*" element={<NotFound />} />
  </>
);

export default PublicRoutes;
