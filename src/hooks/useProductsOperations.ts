
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AddProductData, Product } from '@/types/product';

/**
 * Hook for product CRUD operations
 */
export const useProductOperations = () => {
  const { toast } = useToast();
  
  // Função para verificar produtos diretamente no banco de dados
  const checkProducts = async () => {
    try {
      console.log("Verificando produtos direto no banco de dados...");
      
      const { data, error } = await supabase.functions.invoke('check-products', {
        body: {}
      });
      
      if (error) {
        console.error("Erro ao invocar função check-products:", error);
        throw error;
      }
      
      console.log("Resposta da verificação de produtos:", data);
      
      if (!data) {
        throw new Error("Resposta vazia da função check-products");
      }
      
      if (data.success) {
        toast({
          title: "Verificação de produtos",
          description: `${data.count} produtos encontrados no banco de dados.`
        });
        
        return data.data;
      } else {
        throw new Error(data.error || "Erro ao verificar produtos");
      }
    } catch (error: any) {
      console.error("Erro ao verificar produtos:", error);
      
      let errorMessage = error.message || "Não foi possível verificar os produtos.";
      
      // Verificar se é um erro específico da função edge
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
  
  // Função para adicionar um produto utilizando a edge function
  const addProduct = async (productData: AddProductData): Promise<Product | null> => {
    try {
      console.log("Chamando edge function para adicionar produto:", productData);
      
      // Tenta usar a edge function primeiro
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
      
      // Verificar se é um erro específico da função edge
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

  // Function to update a product
  const updateProduct = async (productId: string, data: Partial<Product>): Promise<Product | null> => {
    try {
      console.log(`Atualizando produto ${productId} com dados:`, data);
      
      const { data: response, error } = await supabase.functions.invoke('update-product', {
        body: { productId, data }
      });
      
      if (error) {
        console.error("Erro ao atualizar produto:", error);
        throw error;
      }
      
      if (!response.success) {
        throw new Error(response.error || "Erro ao atualizar produto");
      }
      
      toast({
        title: "Produto atualizado",
        description: "O produto foi atualizado com sucesso."
      });
      
      return response.data;
    } catch (error: any) {
      console.error("Erro ao atualizar produto:", error);
      
      let errorMessage = error.message || "Não foi possível atualizar o produto.";
      
      // Verificar se é um erro específico da função edge
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
  
  return { checkProducts, addProduct, updateProduct };
};
