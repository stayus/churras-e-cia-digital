
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const EmailConfirmedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(5);
  const [isConfirmed, setIsConfirmed] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Extract token from various URL formats
        // Check hash parameters (for #access_token=...)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        // Check query parameters (for ?token=...)
        const queryParams = new URLSearchParams(window.location.search);
        
        const token = hashParams.get('access_token') || queryParams.get('token');
        
        if (!token) {
          console.log("No token found in URL, checking for existing session");
          // Check if the user has already confirmed their email
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user?.email_confirmed_at) {
            console.log("User is already confirmed");
            setIsConfirmed(true);
          } else {
            console.log("No session or user not confirmed");
            setError("Não foi possível confirmar o e-mail. O link pode ter expirado ou ser inválido.");
            setIsConfirmed(false);
          }
          return;
        }
        
        console.log("Found token, verifying email");
        
        // The token is handled automatically by Supabase Auth
        // Just check if we're now confirmed
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.email_confirmed_at) {
          console.log("Email confirmed successfully");
          setIsConfirmed(true);
        } else {
          console.log("Confirmation failed");
          setError("Não foi possível confirmar o e-mail. O link pode ter expirado ou ser inválido.");
          setIsConfirmed(false);
        }
      } catch (error) {
        console.error("Error confirming email:", error);
        setError("Ocorreu um erro ao confirmar o email. Por favor, tente novamente mais tarde.");
        setIsConfirmed(false);
      }
    };

    confirmEmail();
  }, [location]);

  useEffect(() => {
    // Redirect to login page after countdown if confirmation was successful
    if (isConfirmed) {
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
    }
  }, [isConfirmed, navigate]);

  if (isConfirmed === null) {
    // Loading state
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Verificando Email...</CardTitle>
              <CardDescription className="text-center">
                Por favor, aguarde enquanto confirmamos seu email.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader>
            {isConfirmed ? (
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            ) : (
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
            )}
            <CardTitle className="text-center mt-4">
              {isConfirmed ? "Email Confirmado com Sucesso!" : "Falha na Confirmação do Email"}
            </CardTitle>
            <CardDescription className="text-center">
              {isConfirmed 
                ? "Sua conta foi ativada e está pronta para uso." 
                : error || "Não foi possível confirmar seu email."}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {isConfirmed ? (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Agora você pode fazer login e aproveitar todos os recursos da nossa plataforma.
                </p>
                <p className="text-sm text-gray-500">
                  Redirecionando para a página de login em <span className="font-semibold">{countdown}</span> segundos...
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-600 mb-4">
                Por favor, tente novamente com um link válido ou entre em contato com o suporte para obter ajuda.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailConfirmedPage;
