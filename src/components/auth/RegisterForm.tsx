
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { format, parse } from 'date-fns';

// Esquema de validação do formulário
const registerSchema = z.object({
  fullName: z.string().min(3, "Nome completo deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  birthDate: z.string().refine((date) => {
    try {
      const parsedDate = parse(date, "dd/MM/yyyy", new Date());
      return !isNaN(parsedDate.getTime());
    } catch (e) {
      return false;
    }
  }, { message: "Data inválida, use o formato DD/MM/YYYY" }),
  street: z.string().min(3, "Endereço deve ter no mínimo 3 caracteres"),
  number: z.string().min(1, "Número é obrigatório"),
  city: z.string().min(2, "Cidade deve ter no mínimo 2 caracteres"),
  zip: z.string().min(8, "CEP deve ter no mínimo 8 caracteres"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número")
    .regex(/[^A-Za-z0-9]/, "Senha deve conter pelo menos um caractere especial"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm = () => {
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

  // Mascarar o campo de data de nascimento
  const handleBirthDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 0) {
      value = value.substring(0, 8);
      if (value.length > 4) {
        value = `${value.substring(0, 2)}/${value.substring(2, 4)}/${value.substring(4)}`;
      } else if (value.length > 2) {
        value = `${value.substring(0, 2)}/${value.substring(2)}`;
      }
    }
    form.setValue('birthDate', value);
  };

  // Mascarar o campo de CEP
  const handleZipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 0) {
      value = value.substring(0, 8);
      if (value.length > 5) {
        value = `${value.substring(0, 5)}-${value.substring(5)}`;
      }
    }
    form.setValue('zip', value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input placeholder="Digite seu nome completo" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="seu@email.com" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Nascimento</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="DD/MM/AAAA" 
                    {...field} 
                    onChange={handleBirthDateChange}
                    disabled={isLoading} 
                  />
                </FormControl>
                <FormDescription>
                  Digite sua data de nascimento no formato DD/MM/AAAA
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input placeholder="Rua / Avenida" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input placeholder="Número" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Cidade" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="00000-000" 
                      {...field} 
                      onChange={handleZipChange}
                      disabled={isLoading} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} disabled={isLoading} />
                </FormControl>
                <FormDescription>
                  Mínimo 8 caracteres com letra maiúscula, número e caractere especial
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirme sua Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};

export default RegisterForm;
