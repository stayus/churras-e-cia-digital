
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const EmailConfirmedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(5);
  const [isConfirmed, setIsConfirmed] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  // Extract error parameters from URL
  const getErrorFromUrl = () => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const queryParams = new URLSearchParams(window.location.search);
    
    const errorCode = hashParams.get('error_code') || queryParams.get('error_code');
    const errorDesc = hashParams.get('error_description') || queryParams.get('error_description');
    
    if (errorCode === 'otp_expired') {
      return "O link de confirmação de e-mail expirou. Por favor, solicite um novo link.";
    } else if (errorCode) {
      return errorDesc || "Ocorreu um erro ao verificar seu e-mail.";
    }
    
    return null;
  };
  
  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Extract token from various URL formats
        // Check hash parameters (for #access_token=...)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        // Check query parameters (for ?token=...)
        const queryParams = new URLSearchParams(window.location.search);
        
        const token = hashParams.get('access_token') || queryParams.get('token');
        const errorFromUrl = getErrorFromUrl();
        
        // Check if we have an error in the URL
        if (errorFromUrl) {
          console.log("Error detected in URL:", errorFromUrl);
          setError(errorFromUrl);
          setIsConfirmed(false);
          
          // Try to get user email from local storage or URL
          const email = localStorage.getItem('confirmationEmail') || hashParams.get('email') || queryParams.get('email');
          if (email) {
            setUserEmail(email);
          }
          return;
        }
        
        if (!token) {
          console.log("No token found in URL, checking for existing session");
          // Check if the user has already confirmed their email
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user?.email_confirmed_at) {
            console.log("User is already confirmed");
            setIsConfirmed(true);
            setUserEmail(session.user.email || null);
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
          setUserEmail(session.user.email || null);
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

  const handleResendConfirmation = async () => {
    if (!userEmail) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "E-mail não encontrado. Por favor, tente se registrar novamente."
      });
      return;
    }

    try {
      setIsResending(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail,
        options: {
          emailRedirectTo: window.location.origin + '/email-confirmado',
        }
      });

      if (error) throw error;

      toast({
        title: "E-mail enviado",
        description: "Um novo link de confirmação foi enviado para o seu e-mail."
      });

      // Save email in localStorage for future reference
      localStorage.setItem('confirmationEmail', userEmail);
    } catch (error) {
      console.error("Error resending confirmation:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível reenviar o e-mail de confirmação."
      });
    } finally {
      setIsResending(false);
    }
  };

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
              <>
                <p className="text-sm text-gray-600 mb-4">
                  {error?.includes("expirou") 
                    ? "O link de confirmação expirou. Solicite um novo link para concluir seu cadastro."
                    : "Por favor, tente novamente com um link válido ou entre em contato com o suporte para obter ajuda."}
                </p>
                {userEmail && (
                  <Button 
                    variant="outline" 
                    className="mt-4 w-full"
                    onClick={handleResendConfirmation}
                    disabled={isResending}
                  >
                    {isResending ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Reenviando...
                      </>
                    ) : (
                      "Reenviar email de confirmação"
                    )}
                  </Button>
                )}
                <Button 
                  variant="link" 
                  className="mt-4"
                  onClick={() => navigate('/login')}
                >
                  Voltar para página de login
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailConfirmedPage;
