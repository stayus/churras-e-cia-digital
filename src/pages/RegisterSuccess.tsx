
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, CheckCircle } from 'lucide-react';

const RegisterSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const email = location.state?.email || 'seu email';

  useEffect(() => {
    // Redirecionar para página de login após 5 segundos
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-15"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-red-900/60 to-black/80"></div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center animate-fade-in">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center mb-6 shadow-2xl animate-pulse">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-yellow-400 bg-clip-text text-transparent mb-2">
            Sucesso!
          </h1>
        </div>

        <Card className="bg-gray-900/90 backdrop-blur-sm border-gray-700 shadow-2xl animate-scale-in">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100/10 mb-4">
              <Mail className="h-8 w-8 text-green-400" />
            </div>
            <CardTitle className="text-2xl text-white">Cadastro Concluído!</CardTitle>
            <CardDescription className="text-gray-300">
              Um link de confirmação foi enviado para <span className="text-yellow-400 font-semibold">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-300 leading-relaxed">
              Por favor, verifique sua caixa de entrada e confirme seu email para ativar sua conta.
            </p>
            <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-4">
              <p className="text-yellow-400 text-sm font-medium">
                Você será redirecionado para a página de login em{' '}
                <span className="font-bold text-xl">{countdown}</span> segundos...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterSuccessPage;
