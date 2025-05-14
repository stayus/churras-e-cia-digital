
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import EmployeeLoginForm from '@/components/auth/EmployeeLoginForm';
import LoginHeader from '@/components/auth/LoginHeader';

const EmployeeLoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <LoginHeader 
          title="Churrasquinho & Cia" 
          description="Sistema de gestão para funcionários"
        />

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-center">Login de Funcionários</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          
          <EmployeeLoginForm />
        </Card>
      </div>
    </div>
  );
};

export default EmployeeLoginPage;
