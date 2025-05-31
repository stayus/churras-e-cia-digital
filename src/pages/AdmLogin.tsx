
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import EmployeeLoginForm from '@/components/auth/EmployeeLoginForm';

const AdmLoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <span className="text-white font-bold text-2xl">C</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Churrasquinho & Cia
          </h1>
          <p className="text-gray-600 text-lg">Painel Administrativo</p>
        </div>

        <Card className="bg-white shadow-lg border border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900">Login de Administrador</CardTitle>
            <CardDescription className="text-gray-600">
              Entre com suas credenciais para acessar o painel administrativo
            </CardDescription>
          </CardHeader>
          
          <EmployeeLoginForm />
        </Card>

        <div className="text-center">
          <p className="text-gray-600">
            É cliente?{' '}
            <a href="/login" className="text-red-600 hover:text-red-700 font-semibold transition-colors">
              Acesse aqui
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdmLoginPage;
