
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parse } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { registerSchema, RegisterFormData } from './registerSchema';

export const useRegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      birthDate: "",
      street: "",
      number: "",
      city: "",
      zip: "",
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Form data:", data);
      
      // Format birth date to ISO (yyyy-MM-dd)
      const birthDateFormatted = parse(data.birthDate, "dd/MM/yyyy", new Date());
      const formattedBirthDate = format(birthDateFormatted, "yyyy-MM-dd");
      
      // Create address object with proper format for database storage
      const formattedAddress = {
        id: `addr_${Date.now()}`,
        street: data.street,
        number: data.number,
        city: data.city,
        zip: data.zip.replace(/[^0-9]/g, '') // Remove formatting from zip code
      };
      
      console.log("Processing registration with formatted address:", formattedAddress);

      // First, sign up the user with Supabase Authentication
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.fullName,
            birth_date: formattedBirthDate,
            address: formattedAddress,
          },
          emailRedirectTo: window.location.origin + '/email-confirmado'
        }
      });

      if (signUpError) {
        console.error("Auth signup error:", signUpError);
        throw signUpError;
      }

      // Check if user was created successfully
      if (authData?.user) {
        toast({
          title: "Cadastro iniciado com sucesso!",
          description: "Enviamos um email de confirmação. Verifique sua caixa de entrada para ativar sua conta.",
        });

        // Redirect to registration completed page
        navigate("/registro-concluido", { state: { email: data.email } });
      } else {
        throw new Error("Erro ao criar usuário");
      }

    } catch (error: any) {
      console.error("Erro ao registrar:", error);
      let errorMessage = "Ocorreu um erro ao criar sua conta";
      
      // Check for specific error messages
      if (error.message?.includes("duplicate key") || error.message?.includes("already exists") || 
          error.message?.includes("User already registered")) {
        errorMessage = "Este e-mail já está sendo utilizado";
      } else if (error.message?.includes("violates row level security")) {
        errorMessage = "Erro de permissão ao criar conta";
      }
      
      setError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    error,
    onSubmit: form.handleSubmit(onSubmit),
    setError
  };
};
