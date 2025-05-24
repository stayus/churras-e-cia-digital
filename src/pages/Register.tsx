
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import RegisterForm from '@/components/auth/RegisterForm';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-red-900/60 to-black/80"></div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center animate-fade-in">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mb-6 shadow-2xl animate-pulse">
            <span className="text-white font-bold text-2xl">C</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent mb-2">
            Churrasquinho & Cia
          </h1>
          <p className="text-gray-300 text-lg">Faça seu cadastro para aproveitar nossas ofertas</p>
        </div>

        <Card className="bg-gray-900/90 backdrop-blur-sm border-gray-700 shadow-2xl animate-scale-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Criar Conta</CardTitle>
            <CardDescription className="text-gray-300">
              Preencha seus dados para criar uma nova conta
            </CardDescription>
          </CardHeader>
          
          <RegisterForm />
        </Card>

        <div className="text-center">
          <p className="text-gray-300">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors">
              Entre aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
