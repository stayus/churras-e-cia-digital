
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to handle product realtime subscriptions
 */
export const useRealtimeSubscription = (onProductChange: () => void) => {
  // Set up realtime subscription
  useEffect(() => {
    console.log("useRealtimeSubscription: Configurando escuta em tempo real");
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
};
