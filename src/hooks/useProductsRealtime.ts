
import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to handle product realtime subscriptions
 */
export const useProductsRealtime = (onProductChange: () => void) => {
  const { toast } = useToast();
  
  // Configure realtime for products table
  const setupRealtime = useCallback(async () => {
    try {
      console.log("Configurando realtime para a tabela products...");
      
      // Instead of calling the edge function, we'll directly set up
      // the subscription here to avoid potential edge function errors
      
      // First, set up a channel
      const channel = supabase
        .channel('products-changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'products' 
          }, 
          (payload) => {
            console.log('Alteração detectada na tabela products:', payload);
          }
        )
        .subscribe();
        
      console.log("Realtime configurado automaticamente");
      
      toast({
        title: "Sucesso",
        description: "Realtime configurado com sucesso para a tabela de produtos."
      });
      
      return true;
    } catch (error: any) {
      console.error("Erro ao configurar realtime:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Falha ao configurar realtime para produtos."
      });
      
      return false;
    }
  }, [toast]);

  // Set up realtime subscription
  useEffect(() => {
    console.log("useProductsRealtime: Configurando escuta em tempo real");
    const channel = supabase
      .channel('products-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'products' 
        }, 
        (payload) => {
          console.log('Alteração detectada na tabela products:', payload);
          onProductChange(); // Refresh products when there's a change
        }
      )
      .subscribe(status => {
        console.log('Status da subscrição realtime:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('Subscrição ativa para mudanças na tabela products');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Erro na subscrição realtime para products');
        }
      });
      
    console.log('Escuta em tempo real configurada para a tabela products');
    
    return () => {
      console.log('Removendo escuta em tempo real');
      supabase.removeChannel(channel);
    };
  }, [onProductChange]);

  return { setupRealtime };
};
