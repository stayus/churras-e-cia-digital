
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatDbProducts } from '@/utils/productUtils';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_out_of_stock: boolean;
  promotion_price?: number;
  category: 'lanche' | 'bebida' | 'refeicao' | 'sobremesa' | 'outro';
  extras: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}

export interface AddProductData {
  name: string;
  description: string;
  price: number;
  category: 'lanche' | 'bebida' | 'refeicao' | 'sobremesa' | 'outro';
  image_url?: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('useProducts: Iniciando busca de produtos...');
      
      // Always try edge function first for better reliability
      console.log('useProducts: Usando edge function get-products');
      
      const { data, error } = await supabase.functions.invoke('get-products');
      
      if (error) {
        console.error('useProducts: Erro ao invocar get-products:', error);
        throw error;
      }
      
      console.log('useProducts: Resposta da função get-products:', data);
      
      if (data?.success && data?.data && Array.isArray(data.data)) {
        const formattedProducts = formatDbProducts(data.data);
        setProducts(formattedProducts);
        console.log('useProducts: Produtos formatados da edge function:', formattedProducts);
      } else {
        // If edge function fails, try direct database query as fallback
        console.log('useProducts: Edge function falhou, tentando consulta direta');
        
        const { data: directData, error: directError } = await supabase
          .from('products')
          .select('*')
          .order('name');
          
        if (!directError && directData && Array.isArray(directData)) {
          console.log('useProducts: Produtos obtidos diretamente do banco:', directData);
          const formattedProducts = formatDbProducts(directData);
          setProducts(formattedProducts);
          console.log('useProducts: Produtos formatados:', formattedProducts);
        } else {
          console.error('useProducts: Erro na consulta direta:', directError);
          throw new Error('Nenhum produto encontrado');
        }
      }
    } catch (err) {
      console.error('useProducts: Erro ao carregar produtos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
      
      toast({
        variant: "destructive",
        title: "Erro ao carregar produtos",
        description: err instanceof Error ? err.message : 'Erro desconhecido'
      });
    } finally {
      setLoading(false);
    }
  };

  const checkProducts = async (): Promise<Product[] | null> => {
    try {
      console.log('useProducts: Verificando produtos no banco...');
      
      const { data, error } = await supabase.functions.invoke('check-products');
      
      if (error) {
        console.error('useProducts: Erro ao verificar produtos:', error);
        throw error;
      }
      
      if (data?.success && data?.data) {
        const formattedProducts = formatDbProducts(data.data);
        console.log('useProducts: Produtos verificados:', formattedProducts);
        return formattedProducts;
      }
      
      return null;
    } catch (error) {
      console.error('useProducts: Erro na verificação:', error);
      throw error;
    }
  };

  const setupRealtime = async () => {
    try {
      console.log('useProducts: Configurando realtime...');
      
      const { data, error } = await supabase.functions.invoke('enable-realtime');
      
      if (error) {
        console.error('useProducts: Erro ao configurar realtime:', error);
        throw error;
      }
      
      console.log('useProducts: Realtime configurado:', data);
      return true;
    } catch (error) {
      console.error('useProducts: Erro ao configurar realtime:', error);
      throw error;
    }
  };

  const addProduct = async (productData: AddProductData): Promise<Product | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('add-product', {
        body: productData
      });

      if (error) throw error;

      if (data?.success && data?.product) {
        await fetchProducts();
        toast({
          title: "Produto adicionado",
          description: "Produto adicionado com sucesso!"
        });
        return data.product;
      }
      
      return null;
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar produto",
        description: error instanceof Error ? error.message : 'Erro desconhecido'
      });
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<AddProductData>): Promise<Product | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('update-product', {
        body: { id, ...updates }
      });

      if (error) throw error;

      if (data?.success && data?.product) {
        await fetchProducts();
        toast({
          title: "Produto atualizado",
          description: "Produto atualizado com sucesso!"
        });
        return data.product;
      }
      
      return null;
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar produto",
        description: error instanceof Error ? error.message : 'Erro desconhecido'
      });
      throw error;
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('delete-product', {
        body: { id }
      });

      if (error) throw error;

      if (data?.success) {
        await fetchProducts();
        toast({
          title: "Produto removido",
          description: "Produto removido com sucesso!"
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        variant: "destructive",
        title: "Erro ao remover produto",
        description: error instanceof Error ? error.message : 'Erro desconhecido'
      });
      return false;
    }
  };

  const toggleProductStock = async (id: string, isOutOfStock: boolean): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_out_of_stock: isOutOfStock })
        .eq('id', id);

      if (error) throw error;

      await fetchProducts();
      toast({
        title: "Status atualizado",
        description: `Produto ${isOutOfStock ? 'marcado como esgotado' : 'disponível novamente'}`
      });
      return true;
    } catch (error) {
      console.error('Error toggling product stock:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar status",
        description: error instanceof Error ? error.message : 'Erro desconhecido'
      });
      return false;
    }
  };

  useEffect(() => {
    console.log('useProducts: useEffect executado, iniciando fetchProducts');
    fetchProducts();

    // Set up realtime subscription
    const channel = supabase
      .channel('products-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('useProducts: Mudança realtime detectada:', payload);
          fetchProducts();
          toast({
            title: "Realtime ativado",
            description: "Produtos atualizados em tempo real!"
          });
        }
      )
      .subscribe((status) => {
        console.log('useProducts: Status da subscrição realtime:', status);
        if (status === 'SUBSCRIBED') {
          console.log('useProducts: Realtime ativo para produtos');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStock,
    checkProducts,
    setupRealtime
  };
};
