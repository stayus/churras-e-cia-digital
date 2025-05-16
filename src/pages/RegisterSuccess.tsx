
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <Mail className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-center mt-4">Cadastro Concluído!</CardTitle>
            <CardDescription className="text-center">
              Um link de confirmação foi enviado para {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Por favor, verifique sua caixa de entrada e confirme seu email para ativar sua conta.
            </p>
            <p className="text-sm text-gray-500">
              Você será redirecionado para a página de login em <span className="font-semibold">{countdown}</span> segundos...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterSuccessPage;
