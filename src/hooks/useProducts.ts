
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductExtra, AddProductData } from '@/types/product';
import { formatDbProducts } from '@/utils/productUtils';

export type { Product, AddProductData } from '@/types/product';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("useProducts: Iniciando busca de produtos...");
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('useProducts: Erro ao buscar produtos:', error);
        setError('Erro ao carregar produtos: ' + error.message);
        return;
      }

      console.log("useProducts: Dados recebidos do banco:", data);
      
      if (!data || data.length === 0) {
        console.log("useProducts: Nenhum produto encontrado no banco de dados");
        setProducts([]);
        return;
      }

      // Use the utility function to format products properly
      const formattedProducts = formatDbProducts(data);
      console.log("useProducts: Produtos formatados:", formattedProducts);
      setProducts(formattedProducts);
    } catch (err) {
      console.error('useProducts: Erro inesperado:', err);
      setError('Erro inesperado ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: AddProductData) => {
    try {
      const { data, error } = await supabase.functions.invoke('add-product', {
        body: productData
      });

      if (error) {
        console.error('Error adding product:', error);
        throw new Error(error.message || 'Erro ao adicionar produto');
      }

      // Refresh products after adding
      await fetchProducts();
      return data;
    } catch (error: any) {
      console.error('Error in addProduct:', error);
      throw error;
    }
  };

  const updateProduct = async (productId: string, productData: Partial<Product>) => {
    try {
      const { data, error } = await supabase.functions.invoke('update-product', {
        body: { id: productId, ...productData }
      });

      if (error) {
        console.error('Error updating product:', error);
        throw new Error(error.message || 'Erro ao atualizar produto');
      }

      // Refresh products after updating
      await fetchProducts();
      return data;
    } catch (error: any) {
      console.error('Error in updateProduct:', error);
      throw error;
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase.functions.invoke('delete-product', {
        body: { id: productId }
      });

      if (error) {
        console.error('Error deleting product:', error);
        throw new Error(error.message || 'Erro ao excluir produto');
      }

      // Refresh products after deleting
      await fetchProducts();
      return true;
    } catch (error: any) {
      console.error('Error in deleteProduct:', error);
      return false;
    }
  };

  const checkProducts = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-products');
      
      if (error) {
        console.error('Error checking products:', error);
        throw new Error(error.message || 'Erro ao verificar produtos');
      }
      
      return data;
    } catch (error: any) {
      console.error('Error in checkProducts:', error);
      throw error;
    }
  };

  const setupRealtime = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('enable-realtime');
      
      if (error) {
        console.error('Error setting up realtime:', error);
        throw new Error(error.message || 'Erro ao configurar realtime');
      }
      
      return data;
    } catch (error: any) {
      console.error('Error in setupRealtime:', error);
      throw error;
    }
  };

  useEffect(() => {
    console.log("useProducts: Hook inicializado, iniciando fetchProducts...");
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error: error || '',
    refetch: fetchProducts,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    checkProducts,
    setupRealtime
  };
};
