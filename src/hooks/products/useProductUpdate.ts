
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/product';
import { formatDbProducts } from '@/utils/productUtils';
import { Json } from '@/integrations/supabase/types';

/**
 * Hook for updating products
 */
export const useProductUpdate = () => {
  const { toast } = useToast();
  
  // Function to update a product
  const updateProduct = async (productId: string, productData: Partial<Product>): Promise<Product | null> => {
    try {
      console.log(`Atualizando produto ${productId} com dados:`, productData);
      
      // Convert ProductExtra[] to Json compatible format if it exists
      const supabaseData: any = { ...productData };
      
      // Ensure category is one of the allowed values if present
      if (supabaseData.category && 
         !['lanche', 'bebida', 'refeicao', 'sobremesa', 'outro'].includes(supabaseData.category)) {
        supabaseData.category = 'outro';
      }
      
      // Try direct update first
      const { data: updateResponse, error: updateError } = await supabase
        .from('products')
        .update(supabaseData)
        .eq('id', productId)
        .select()
        .single();
        
      if (!updateError) {
        console.log("Produto atualizado com sucesso via API direta:", updateResponse);
        
        // Convert response back to Product type
        const formattedProduct = formatDbProducts([updateResponse])[0];
        
        toast({
          title: "Produto atualizado",
          description: "O produto foi atualizado com sucesso."
        });
        return formattedProduct;
      }
      
      console.log("Atualização direta falhou, tentando com edge function:", updateError);
      
      // If direct update fails, try the edge function
      const { data: response, error } = await supabase.functions.invoke('update-product', {
        body: { productId, data: supabaseData }
      });
      
      if (error) {
        console.error("Erro ao atualizar produto:", error);
        throw error;
      }
      
      if (!response.success) {
        throw new Error(response.error || "Erro ao atualizar produto");
      }
      
      // Ensure we format the response to match the Product type
      const formattedProduct = formatDbProducts([response.data])[0];
      
      toast({
        title: "Produto atualizado",
        description: "O produto foi atualizado com sucesso."
      });
      
      return formattedProduct;
    } catch (error: any) {
      console.error("Erro ao atualizar produto:", error);
      
      let errorMessage = error.message || "Não foi possível atualizar o produto.";
      
      // Check if it's a specific edge function error
      if (error.name === 'FunctionsHttpError') {
        errorMessage = "Erro ao conectar com a função update-product. Certifique-se de que a função está implantada corretamente.";
      }
      
      toast({
        variant: "destructive",
        title: "Erro",
        description: errorMessage
      });
      return null;
    }
  };
  
  return { updateProduct };
};
