
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(8, { message: "Senha deve ter no mínimo 8 caracteres" }),
});

const CustomerLoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    try {
      // Login functionality
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) throw signInError;
      
      if (!authData?.user?.email_confirmed_at) {
        // Email not confirmed
        setError("Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada.");
        
        // Resend confirmation email
        await supabase.auth.resend({
          type: 'signup',
          email: data.email,
        });
        
        toast({
          variant: "default",
          title: "Email de confirmação reenviado",
          description: "Verifique sua caixa de entrada para confirmar seu email",
        });
        
        return;
      }
      
      // Email is confirmed, proceed with login
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo ao Churrasquinho & Cia!",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Error during login:", error);
      setError("Email ou senha incorretos");
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: "Email ou senha incorretos",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@exemplo.com" {...field} />
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
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between items-center mt-2">
          <Link to="/esqueci-senha" className="text-sm text-primary hover:underline">
            Esqueci minha senha
          </Link>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
        <div className="text-center mt-4">
          <span className="text-sm text-gray-500">Não tem uma conta? </span>
          <Link to="/registro" className="text-sm text-primary hover:underline">
            Criar conta
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default CustomerLoginForm;
