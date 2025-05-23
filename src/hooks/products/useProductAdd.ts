
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AddProductData, Product } from '@/types/product';

/**
 * Hook for adding products
 */
export const useProductAdd = () => {
  const { toast } = useToast();
  
  // Function to add a product using the edge function
  const addProduct = async (productData: AddProductData): Promise<Product | null> => {
    try {
      console.log("Chamando edge function para adicionar produto:", productData);
      
      // Try to use the edge function first
      const { data, error } = await supabase.functions.invoke('add-product', {
        body: productData
      });
      
      if (error) {
        console.error("Erro na edge function:", error);
        throw error;
      }
      
      console.log("Resposta da edge function:", data);
      
      if (!data.success) {
        throw new Error(data.error || "Erro ao adicionar produto");
      }
      
      toast({
        title: "Produto adicionado",
        description: "O produto foi adicionado com sucesso."
      });
      
      return data.data;
    } catch (error: any) {
      console.error("Erro ao adicionar produto:", error);
      
      let errorMessage = error.message || "Não foi possível adicionar o produto.";
      
      // Check if it's a specific edge function error
      if (error.name === 'FunctionsHttpError') {
        errorMessage = "Erro ao conectar com a função add-product. Certifique-se de que a função está implantada corretamente.";
      }
      
      toast({
        variant: "destructive",
        title: "Erro",
        description: errorMessage
      });
      return null;
    }
  };

  return { addProduct };
};
