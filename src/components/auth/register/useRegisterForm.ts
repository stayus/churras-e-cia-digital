
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
      
      // Formatar data de nascimento para o formato ISO (yyyy-MM-dd)
      const birthDateFormatted = parse(data.birthDate, "dd/MM/yyyy", new Date());
      const formattedBirthDate = format(birthDateFormatted, "yyyy-MM-dd");
      
      // Criar objeto de endereço
      const address = {
        street: data.street,
        number: data.number,
        city: data.city,
        zip: data.zip.replace(/[^0-9]/g, ''), // Remover formatação do CEP
      };
      
      console.log("Sending customer data:", {
        name: data.fullName,
        email: data.email,
        birthDate: formattedBirthDate,
        password: data.password,
        address
      });

      // Enviar dados para a função Edge Function
      const { data: responseData, error } = await supabase.functions.invoke("create-customer", {
        body: { 
          name: data.fullName,
          email: data.email,
          birthDate: formattedBirthDate,
          password: data.password, 
          address 
        }
      });

      console.log("Response from create-customer:", responseData, error);

      if (error) {
        console.error("Function error:", error);
        throw error;
      }
      
      if (!responseData?.success) {
        console.error("Registration error:", responseData);
        throw new Error(responseData?.error || "Erro no cadastro");
      }

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Um email de confirmação foi enviado para o seu endereço.",
      });

      // Redirecionar para página de confirmação de email
      navigate("/registro-concluido", { state: { email: data.email } });

    } catch (error: any) {
      console.error("Erro ao registrar:", error);
      let errorMessage = "Ocorreu um erro ao criar sua conta";
      
      // Verificar mensagens de erro específicas da API
      if (error.message?.includes("Email already in use")) {
        errorMessage = "Este e-mail já está sendo utilizado";
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
