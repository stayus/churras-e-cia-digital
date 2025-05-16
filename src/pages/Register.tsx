
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import RegisterForm from '@/components/auth/RegisterForm';
import LoginHeader from '@/components/auth/LoginHeader';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <LoginHeader 
          title="Churrasquinho & Cia" 
          description="Faça seu cadastro para aproveitar nossas ofertas"
        />

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-center">Criar Conta</CardTitle>
            <CardDescription className="text-center">
              Preencha seus dados para criar uma nova conta
            </CardDescription>
          </CardHeader>
          
          <RegisterForm />
        </Card>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary/80">
              Entre aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
