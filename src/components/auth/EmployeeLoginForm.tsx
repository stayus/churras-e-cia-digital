
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CardContent } from '@/components/ui/card';

// Schema for employee login (username/password)
const employeeLoginSchema = z.object({
  username: z.string().min(1, { message: 'O nome de usuário é obrigatório' }),
  password: z.string().min(1, { message: 'A senha é obrigatória' }),
});

type EmployeeLoginFormValues = z.infer<typeof employeeLoginSchema>;

interface EmployeeLoginFormProps {
  onTabChange?: (tab: string) => void;
}

const EmployeeLoginForm: React.FC<EmployeeLoginFormProps> = ({ onTabChange }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Form for employee login
  const form = useForm<EmployeeLoginFormValues>({
    resolver: zodResolver(employeeLoginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleEmployeeLogin = async (data: EmployeeLoginFormValues) => {
    try {
      await login('username', data.username, data.password);
      
      // The navigate is handled in ProtectedRoute component
      // but we'll also navigate here as a fallback
      navigate('/admin');
      
      toast({
        title: 'Login realizado com sucesso!',
        description: 'Bem-vindo ao sistema.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Falha no login',
        description: 'Nome de usuário ou senha incorretos.',
      });
    }
  };

  return (
    <>
      <CardContent className="space-y-4 pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEmployeeLogin)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome de usuário</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </>
  );
};

export default EmployeeLoginForm;
