
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Schema for employee login (username/password)
const employeeLoginSchema = z.object({
  username: z.string().min(1, { message: 'O nome de usuário é obrigatório' }),
  password: z.string().min(1, { message: 'A senha é obrigatória' }),
});

// Schema for customer login (email/password)
const customerLoginSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z.string().min(1, { message: 'A senha é obrigatória' }),
});

type EmployeeLoginFormValues = z.infer<typeof employeeLoginSchema>;
type CustomerLoginFormValues = z.infer<typeof customerLoginSchema>;

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState<'employee' | 'customer'>('customer');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Form for employee login
  const employeeForm = useForm<EmployeeLoginFormValues>({
    resolver: zodResolver(employeeLoginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Form for customer login
  const customerForm = useForm<CustomerLoginFormValues>({
    resolver: zodResolver(customerLoginSchema),
    defaultValues: {
      email: '',
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-red-600">Churrasquinho & Cia</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            O melhor churrasquinho da região!
          </p>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'employee' | 'customer')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="customer">Clientes</TabsTrigger>
              <TabsTrigger value="employee">Funcionários</TabsTrigger>
            </TabsList>
            
            <TabsContent value="customer">
              <CardContent className="space-y-4 pt-4">
                <Form {...customerForm}>
                  <form onSubmit={customerForm.handleSubmit(handleCustomerLogin)} className="space-y-4">
                    <FormField
                      control={customerForm.control}
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
                      control={customerForm.control}
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
                    
                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={customerForm.formState.isSubmitting}>
                      {customerForm.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              
              <CardFooter className="flex justify-center">
                <Button variant="link" className="text-red-600">
                  Criar uma conta
                </Button>
              </CardFooter>
            </TabsContent>
            
            <TabsContent value="employee">
              <CardContent className="space-y-4 pt-4">
                <Form {...employeeForm}>
                  <form onSubmit={employeeForm.handleSubmit(handleEmployeeLogin)} className="space-y-4">
                    <FormField
                      control={employeeForm.control}
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
                      control={employeeForm.control}
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
                    
                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={employeeForm.formState.isSubmitting}>
                      {employeeForm.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
