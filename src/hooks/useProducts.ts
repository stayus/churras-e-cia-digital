
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Product, AddProductData } from '@/types/product';
import { formatDbProducts } from '@/utils/productUtils';
import { useProductsRealtime } from './useProductsRealtime';
import { useProductOperations } from './useProductsOperations';

export type { Product, ProductExtra, AddProductData } from '@/types/product';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Fetch products from database
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Buscando produtos do Supabase...");
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      console.log("Produtos recebidos:", data);
      
      if (!data || data.length === 0) {
        console.log("Nenhum produto encontrado no banco de dados");
        setProducts([]);
        return;
      }
      
      // Transform the data to match our Product type
      const formattedProducts = formatDbProducts(data);
      
      console.log("Produtos formatados:", formattedProducts);
      setProducts(formattedProducts);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      setError(error.message || 'Erro ao carregar produtos');
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os produtos. Tente novamente mais tarde."
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);
  
  // Set up realtime updates
  const { setupRealtime } = useProductsRealtime(fetchProducts);
  
  // Set up product operations
  const { checkProducts, addProduct, updateProduct } = useProductOperations();
  
  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  return { 
    products, 
    loading, 
    error, 
    fetchProducts,
    addProduct,
    updateProduct,
    setupRealtime,
    checkProducts
  };
};
