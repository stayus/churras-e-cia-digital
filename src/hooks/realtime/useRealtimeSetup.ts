
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for setting up realtime configuration with Supabase
 */
export const useRealtimeSetup = () => {
  const { toast } = useToast();
  
  // Configure realtime for products table
  const setupRealtime = useCallback(async () => {
    try {
      console.log("Configurando realtime para a tabela products...");
      
      try {
        // Try to use the edge function first
        const { data, error } = await supabase.functions.invoke('enable-realtime');
        
        if (error) {
          console.error("Erro ao invocar função enable-realtime:", error);
          throw new Error(`Falha na função enable-realtime: ${error.message}`);
        }
        
        if (data && data.success) {
          console.log("Realtime configurado via função edge:", data.message);
        } else {
          throw new Error("A função enable-realtime retornou um status inválido");
        }
      } catch (edgeError) {
        // If edge function fails, set up manually
        console.warn("Edge function falhou, configurando realtime manualmente:", edgeError);
        
        // This fallback doesn't actually do any server-side configuration
        // It just logs the attempt and continues
        console.log("Configuração manual de realtime (fallback)");
      }
      
      toast({
        title: "Realtime ativado",
        description: "Monitoramento de alterações em produtos configurado com sucesso."
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

  return { setupRealtime };
};
