
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDbProducts } from '@/utils/productUtils';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  promotion_price?: number;
  image_url: string;
  category: string;
  is_out_of_stock: boolean;
  extras?: Array<{
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
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProducts = formatDbProducts(data || []);
      setProducts(formattedProducts);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar produtos",
        description: "Não foi possível carregar os produtos"
      });
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: AddProductData) => {
    try {
      const { data, error } = await supabase.functions.invoke('add-product', {
        body: productData
      });

      if (error) throw error;

      toast({
        title: "Produto adicionado",
        description: "Produto adicionado com sucesso!"
      });

      await fetchProducts();
      return true;
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar produto",
        description: error.message || "Não foi possível adicionar o produto"
      });
      return false;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const { data, error } = await supabase.functions.invoke('update-product', {
        body: { id, ...productData }
      });

      if (error) throw error;

      toast({
        title: "Produto atualizado",
        description: "Produto atualizado com sucesso!"
      });

      await fetchProducts();
      return true;
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar produto",
        description: error.message || "Não foi possível atualizar o produto"
      });
      return false;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('delete-product', {
        body: { id }
      });

      if (error) throw error;

      toast({
        title: "Produto excluído",
        description: "Produto excluído com sucesso!"
      });

      await fetchProducts();
      return true;
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir produto",
        description: error.message || "Não foi possível excluir o produto"
      });
      return false;
    }
  };

  const setupRealtime = () => {
    // Setup realtime subscription
    const subscription = supabase
      .channel('products-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const checkProducts = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-products');
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error checking products:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchProducts();

    // Set up realtime subscription
    const cleanup = setupRealtime();

    return cleanup;
  }, []);

  return {
    products,
    loading,
    refetch: fetchProducts,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    setupRealtime,
    checkProducts
  };
};
