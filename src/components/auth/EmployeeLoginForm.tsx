
import React, { useState } from 'react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

// Schema for employee login (username/password)
const employeeLoginSchema = z.object({
  username: z.string().min(1, { message: 'O nome de usuário é obrigatório' }),
  password: z.string().min(1, { message: 'A senha é obrigatória' }),
});

type EmployeeLoginFormValues = z.infer<typeof employeeLoginSchema>;

const EmployeeLoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form for employee login
  const form = useForm<EmployeeLoginFormValues>({
    resolver: zodResolver(employeeLoginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleEmployeeLogin = async (data: EmployeeLoginFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // Trim whitespace from credentials before sending
      const username = data.username.trim();
      const password = data.password.trim();
      
      console.log('Attempting login with:', { username, password: '***' });
      await login('username', username, password);
      
      // Show success message
      toast({
        title: 'Login realizado com sucesso!',
        description: 'Bem-vindo ao sistema.',
      });
      
      // Navigate to admin panel
      navigate('/admin');
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Nome de usuário ou senha incorretos. Por favor, tente novamente.');
      toast({
        variant: 'destructive',
        title: 'Falha no login',
        description: 'Nome de usuário ou senha incorretos.',
      });
    } finally {
      setIsLoading(false);
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
                    <Input placeholder="username" {...field} disabled={isLoading} />
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
                    <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {errorMessage && (
              <Alert variant="destructive">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      
      <CardFooter>
        <Alert className="bg-gray-100 w-full">
          <AlertDescription className="text-xs text-gray-500 text-center">
            Para acesso ao sistema, use:<br />
            <strong>Usuário:</strong> admin | <strong>Senha:</strong> admin
          </AlertDescription>
        </Alert>
      </CardFooter>
    </>
  );
};

export default EmployeeLoginForm;
