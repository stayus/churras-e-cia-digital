
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import CustomerLoginForm from '@/components/auth/CustomerLoginForm';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center animate-fade-in">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mb-6 shadow-2xl">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent mb-2">
            Churrasquinho & Cia
          </h1>
          <p className="text-gray-300 text-base">O melhor churrasquinho da região!</p>
        </div>

        <Card className="bg-gray-900/90 backdrop-blur-sm border-gray-700 shadow-2xl animate-scale-in">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-white">Login de Clientes</CardTitle>
            <CardDescription className="text-gray-300 text-sm">
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          
          <div className="px-6 pb-6">
            <CustomerLoginForm />
          </div>
        </Card>

        <div className="text-center">
          <p className="text-gray-300 text-sm">
            Não tem uma conta?{' '}
            <a href="/registro" className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors">
              Cadastre-se aqui
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
