
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Password change form schema with validation
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
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

const PasswordChangePage = () => {
  const { user, updatePassword } = useAuth();
  const navigate = useNavigate();

  const form = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handlePasswordChange = async (data: PasswordChangeFormValues) => {
    try {
      await updatePassword(data.currentPassword, data.newPassword);
      
      toast({
        title: 'Senha alterada com sucesso!',
        description: 'Sua nova senha foi definida. Você será redirecionado para a página inicial.',
      });
      
      // Redirect based on user role after successful password change
      if (user?.role === 'admin') {
        navigate('/admin');
      } else if (user?.role === 'employee') {
        navigate('/employee');
      } else if (user?.role === 'motoboy') {
        navigate('/motoboy');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao alterar a senha',
        description: 'Verifique se a senha atual está correta e tente novamente.',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="logo-text">Churrasquinho & Cia</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {user?.isFirstLogin 
              ? 'Você precisa alterar sua senha no primeiro acesso.'
              : 'Altere sua senha para continuar.'
            }
          </p>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-center">Alterar Senha</CardTitle>
            <CardDescription className="text-center">
              Crie uma senha forte para proteger sua conta
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handlePasswordChange)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha atual</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
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
                      <FormLabel>Nova senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
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
                      <FormLabel>Confirmar nova senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="text-xs text-gray-500 space-y-1 mb-4">
                  <p>Sua senha deve ter pelo menos:</p>
                  <ul className="list-disc pl-5">
                    <li>8 caracteres</li>
                    <li>Uma letra maiúscula</li>
                    <li>Uma letra minúscula</li>
                    <li>Um número</li>
                    <li>Um caractere especial</li>
                  </ul>
                </div>
                
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Alterando senha...' : 'Alterar senha'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PasswordChangePage;
