
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

      // Try using the edge function first
      const { data: edgeResponse, error: edgeError } = await supabase.functions.invoke('get-products');

      if (!edgeError && edgeResponse?.success) {
        console.log("useProducts: Produtos recebidos pelo get-products:", edgeResponse);
        
        if (edgeResponse.data && Array.isArray(edgeResponse.data) && edgeResponse.data.length > 0) {
          const formattedProducts = formatDbProducts(edgeResponse.data);
          console.log("useProducts: Produtos formatados:", formattedProducts);
          setProducts(formattedProducts);
          setLoading(false);
          return;
        }
      }
      
      // If edge function fails, try direct query
      console.log("Edge function falhou ou não retornou dados, tentando consulta direta...");
      
      const { data, error } = await supabase
        .from('products')
        .select('*');
        
      if (error) {
        console.error('Erro na consulta direta:', error);
        
        // Try the check-products function as last resort
        console.log("Consulta direta falhou, tentando com check-products...");
        const { data: checkResponse, error: checkError } = await supabase.functions.invoke('check-products');
        
        if (checkError) {
          console.error('Erro com check-products:', checkError);
          throw new Error('Não foi possível obter produtos através de nenhum método disponível');
        }
        
        if (!checkResponse || !checkResponse.data) {
          console.log("check-products não retornou dados:", checkResponse);
          setProducts([]);
          setLoading(false);
          return;
        }
        
        console.log("Produtos recebidos da função check-products:", checkResponse.data);
        
        // Transform the data to match our Product type
        const formattedProducts = formatDbProducts(checkResponse.data);
        console.log("Produtos formatados (de check-products):", formattedProducts);
        setProducts(formattedProducts);
        setLoading(false);
        return;
      }
      
      console.log("useProducts: Produtos recebidos através de consulta direta:", data);
      
      if (!data || data.length === 0) {
        console.log("useProducts: Nenhum produto encontrado no banco de dados");
        setProducts([]);
        setLoading(false);
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
      setProducts([]);
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
