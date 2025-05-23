
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for deleting products
 */
export const useProductDelete = () => {
  const { toast } = useToast();
  
  // Function to delete a product
  const deleteProduct = async (productId: string): Promise<boolean> => {
    try {
      console.log(`Deletando produto ${productId}`);
      
      // Try direct deletion first
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
        
      if (deleteError) {
        console.error("Erro ao deletar produto diretamente:", deleteError);
        
        // Try using the edge function as fallback
        const { error } = await supabase.functions.invoke('delete-product', {
          body: { productId }
        });
        
        if (error) {
          console.error("Erro ao deletar produto via função:", error);
          throw error;
        }
      }
      
      toast({
        title: "Produto excluído",
        description: "O produto foi excluído com sucesso."
      });
      
      return true;
    } catch (error: any) {
      console.error("Erro ao deletar produto:", error);
      
      let errorMessage = error.message || "Não foi possível excluir o produto.";
      
      toast({
        variant: "destructive",
        title: "Erro",
        description: errorMessage
      });
      
      return false;
    }
  };
  
  return { deleteProduct };
};
