
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to handle product realtime subscriptions
 */
export const useProductsRealtime = (onProductChange: () => void) => {
  const { toast } = useToast();
  
  // Configure realtime for products table
  const setupRealtime = async () => {
    try {
      console.log("Configurando realtime para a tabela products...");
      
      const { data, error } = await supabase.functions.invoke('enable-realtime', {
        body: {}
      });
      
      if (error) {
        console.error("Erro ao configurar realtime:", error);
        return;
      }
      
      console.log("Resposta da configuração realtime:", data);
      
      if (data.success) {
        console.log("Realtime configurado com sucesso para a tabela products");
        toast({
          title: "Sucesso",
          description: "Realtime configurado com sucesso para a tabela de produtos."
        });
      } else {
        console.error("Falha ao configurar realtime:", data.error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: data.error || "Falha ao configurar realtime para produtos."
        });
      }
    } catch (error: any) {
      console.error("Erro ao configurar realtime:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Falha ao configurar realtime para produtos."
      });
    }
  };

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('public:products')
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
          
          // Try to setup realtime after a short delay
          setTimeout(() => {
            setupRealtime();
          }, 1000);
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
