
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
import { CardContent, CardFooter } from '@/components/ui/card';

// Schema for customer login (email/password)
const customerLoginSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z.string().min(1, { message: 'A senha é obrigatória' }),
});

type CustomerLoginFormValues = z.infer<typeof customerLoginSchema>;

interface CustomerLoginFormProps {
  onTabChange?: (tab: string) => void;
}

const CustomerLoginForm: React.FC<CustomerLoginFormProps> = ({ onTabChange }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Form for customer login
  const form = useForm<CustomerLoginFormValues>({
    resolver: zodResolver(customerLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleCustomerLogin = async (data: CustomerLoginFormValues) => {
    try {
      await login('email', data.email, data.password);
      
      // Navigate to the customer's home page
      navigate('/catalogo');
      
      toast({
        title: 'Login realizado com sucesso!',
        description: 'Bem-vindo ao Churrasquinho & Cia.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Falha no login',
        description: 'E-mail ou senha incorretos.',
      });
    }
  };

  return (
    <>
      <CardContent className="space-y-4 pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCustomerLogin)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="cliente@exemplo.com" {...field} />
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
      
      <CardFooter className="flex justify-center">
        <Button variant="link" className="text-red-600">
          Criar uma conta
        </Button>
      </CardFooter>
    </>
  );
};

export default CustomerLoginForm;
