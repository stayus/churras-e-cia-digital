
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Key, Lock } from 'lucide-react';

// Define the schema for the password change form
const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, { message: 'A senha atual é obrigatória' }),
  newPassword: z.string()
    .min(8, { message: 'A nova senha deve ter pelo menos 8 caracteres' })
    .regex(/[A-Z]/, { message: 'A senha deve conter pelo menos uma letra maiúscula' })
    .regex(/[a-z]/, { message: 'A senha deve conter pelo menos uma letra minúscula' })
    .regex(/[0-9]/, { message: 'A senha deve conter pelo menos um número' })
    .regex(/[^A-Za-z0-9]/, { message: 'A senha deve conter pelo menos um caractere especial' }),
  confirmPassword: z.string().min(1, { message: 'A confirmação de senha é obrigatória' }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

const PasswordChangePage = () => {
  const { user, updatePassword, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // If the user is not logged in or does not need to change their password, redirect them
    if (!isLoading && (!user || !user.isFirstLogin)) {
      // Redirect based on user role
      if (user?.role === 'admin' || user?.role === 'employee') {
        navigate('/admin');
      } else if (user?.role === 'motoboy') {
        navigate('/motoboy');
      } else if (user?.role === 'customer') {
        navigate('/catalogo');
      } else {
        navigate('/login');
      }
    }
  }, [user, isLoading, navigate]);

  const form = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: PasswordChangeFormValues) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await updatePassword(data.currentPassword, data.newPassword);
      
      toast({
        title: 'Senha alterada com sucesso!',
        description: 'Sua nova senha foi configurada.',
      });
      
      // Redirect based on user role
      if (user?.role === 'admin' || user?.role === 'employee') {
        navigate('/admin');
      } else if (user?.role === 'motoboy') {
        navigate('/motoboy');
      } else {
        navigate('/catalogo');
      }
      
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao alterar senha',
        description: 'Verifique se a senha atual está correta e tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Carregando...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-red-600">
            Primeiro Acesso
          </CardTitle>
          <CardDescription className="text-center">
            Olá, {user.name}! Por razões de segurança, você precisa alterar sua senha temporária antes de continuar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha Atual</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="password" 
                          placeholder="Digite sua senha temporária" 
                          {...field} 
                          className="pl-10"
                        />
                        <Key className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="password" 
                          placeholder="Digite sua nova senha" 
                          {...field} 
                          className="pl-10"
                        />
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirme a Nova Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="password" 
                          placeholder="Confirme sua nova senha" 
                          {...field} 
                          className="pl-10"
                        />
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Alterando senha..." : "Alterar Senha"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-xs text-gray-500 text-center">
            Sua nova senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, 
            minúsculas, números e caracteres especiais.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PasswordChangePage;
