
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/product';
import { formatDbProducts } from '@/utils/productUtils';

/**
 * Hook for checking products in the database
 */
export const useProductCheck = () => {
  const { toast } = useToast();
  
  // Function to verify products directly in the database
  const checkProducts = async (): Promise<Product[] | null> => {
    try {
      console.log("Verificando produtos direto no banco de dados...");
      
      // Try direct database query first
      const { data: directData, error: directError } = await supabase
        .from('products')
        .select('*');
        
      if (!directError && directData) {
        console.log("Produtos obtidos diretamente:", directData);
        const formattedProducts = formatDbProducts(directData);
        toast({
          title: "Verificação de produtos",
          description: `${directData.length} produtos encontrados no banco de dados.`
        });
        return formattedProducts;
      }
      
      console.log("Consulta direta falhou, tentando com edge function check-products");
      
      // If direct query fails, try the edge function
      const { data, error } = await supabase.functions.invoke('check-products');
      
      if (error) {
        console.error("Erro ao invocar função check-products:", error);
        throw error;
      }
      
      console.log("Resposta da verificação de produtos:", data);
      
      if (!data) {
        throw new Error("Resposta vazia da função check-products");
      }
      
      if (data.success) {
        const formattedProducts = formatDbProducts(data.data);
        toast({
          title: "Verificação de produtos",
          description: `${data.count} produtos encontrados no banco de dados.`
        });
        
        return formattedProducts;
      } else {
        throw new Error(data.error || "Erro ao verificar produtos");
      }
    } catch (error: any) {
      console.error("Erro ao verificar produtos:", error);
      
      let errorMessage = error.message || "Não foi possível verificar os produtos.";
      
      if (error.name === 'FunctionsHttpError') {
        errorMessage = "Erro ao conectar com a função check-products. Certifique-se de que a função está implantada corretamente.";
      }
      
      toast({
        variant: "destructive",
        title: "Erro",
        description: errorMessage
      });
      return null;
    }
  };
  
  return { checkProducts };
};
