
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatDbProducts } from '@/utils/productUtils';

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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (fetchError) {
        throw fetchError;
      }

      const formattedProducts = formatDbProducts(data || []);
      setProducts(formattedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: AddProductData): Promise<Product | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('add-product', {
        body: productData
      });

      if (error) throw error;

      if (data?.success && data?.product) {
        await fetchProducts(); // Refresh the list
        return data.product;
      }
      
      return null;
    } catch (error) {
      console.error('Error adding product:', error);
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
        await fetchProducts(); // Refresh the list
        return data.product;
      }
      
      return null;
    } catch (error) {
      console.error('Error updating product:', error);
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
        await fetchProducts(); // Refresh the list
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  };

  const checkProducts = async (): Promise<Product[] | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('check-products');

      if (error) throw error;

      if (data?.success && data?.data) {
        return formatDbProducts(data.data);
      }
      
      return null;
    } catch (error) {
      console.error('Error checking products:', error);
      throw error;
    }
  };

  const setupRealtime = async (): Promise<void> => {
    try {
      const { data, error } = await supabase.functions.invoke('enable-realtime', {
        body: { table: 'products' }
      });

      if (error) throw error;

      console.log('Realtime setup successful:', data);
    } catch (error) {
      console.error('Error setting up realtime:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();

    // Set up realtime subscription silently (no toast notifications)
    const channel = supabase
      .channel('products-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => {
          // Silently refetch products when changes occur
          fetchProducts();
        }
      )
      .subscribe();

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
    checkProducts,
    setupRealtime
  };
};
