
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
      
      console.log("useProducts: Buscando produtos do Supabase...");
      
      // Try the standard approach first
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching products with standard approach, trying edge function:', error);
        
        // If standard approach fails, try the edge function
        console.log("Tentando alternativa com edge function get-products...");
        const { data: edgeData, error: edgeError } = await supabase.functions.invoke('get-products');
        
        if (edgeError) {
          console.error('Error with edge function approach too:', edgeError);
          throw edgeError;
        }
        
        if (!edgeData || !edgeData.data) {
          throw new Error('Dados não retornados pela função get-products');
        }
        
        console.log("Products received from edge function:", edgeData.data);
        
        // Transform the data to match our Product type
        const formattedProducts = formatDbProducts(edgeData.data);
        console.log("Produtos formatados (de edge function):", formattedProducts);
        setProducts(formattedProducts);
        setLoading(false);
        return;
      }
      
      console.log("useProducts: Produtos recebidos:", data);
      
      if (!data || data.length === 0) {
        console.log("useProducts: Nenhum produto encontrado no banco de dados");
        setProducts([]);
        return;
      }
      
      // Transform the data to match our Product type
      const formattedProducts = formatDbProducts(data);
      
      console.log("useProducts: Produtos formatados:", formattedProducts);
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
    console.log("useProducts: Hook montado, buscando produtos.");
    fetchProducts();
    
    // Configurar escuta em tempo real para atualizações de produtos
    const setupRealtimeFunc = async () => {
      try {
        await setupRealtime();
      } catch (err) {
        console.warn("Não foi possível configurar realtime, mas produtos serão carregados normalmente:", err);
      }
    };
    setupRealtimeFunc();
    
  }, [fetchProducts, setupRealtime]);
  
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
