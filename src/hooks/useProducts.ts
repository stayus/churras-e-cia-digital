
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

export interface ProductExtra {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_out_of_stock: boolean;
  promotion_price: number | null;
  extras: ProductExtra[];
}

export interface AddProductData {
  name: string;
  description: string;
  price: number;
  image_url?: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Buscando produtos do Supabase...");
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
        
      if (error) {
        throw error;
      }
      
      console.log("Produtos recebidos:", data);
      
      // Transform the data to match our Product type
      const formattedProducts: Product[] = data.map(item => {
        // Parse extras properly
        let parsedExtras: ProductExtra[] = [];
        if (item.extras) {
          // Handle different possible formats of extras in the database
          if (Array.isArray(item.extras)) {
            // Type assertion to ensure each item has the correct properties
            parsedExtras = (item.extras as any[]).map(extra => ({
              id: extra.id?.toString() || '',
              name: extra.name?.toString() || '',
              price: typeof extra.price === 'number' ? extra.price : 0
            }));
          } else if (typeof item.extras === 'string') {
            try {
              // Parse string and validate the structure
              const parsedData = JSON.parse(item.extras);
              if (Array.isArray(parsedData)) {
                parsedExtras = parsedData.map(extra => ({
                  id: extra.id?.toString() || '',
                  name: extra.name?.toString() || '',
                  price: typeof extra.price === 'number' ? extra.price : 0
                }));
              }
            } catch (e) {
              console.error('Error parsing extras:', e);
            }
          }
        }
        
        return {
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          image_url: item.image_url,
          is_out_of_stock: item.is_out_of_stock,
          promotion_price: item.promotion_price,
          extras: parsedExtras
        };
      });
      
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
  };
  
  // Função para adicionar um produto utilizando a edge function
  const addProduct = async (productData: AddProductData): Promise<Product | null> => {
    try {
      setLoading(true);
      
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
      
      // Atualiza a lista local de produtos
      await fetchProducts();
      
      toast({
        title: "Produto adicionado",
        description: "O produto foi adicionado com sucesso."
      });
      
      return data.data;
    } catch (error: any) {
      console.error("Erro ao adicionar produto:", error);
      setError(error.message || "Erro ao adicionar produto");
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível adicionar o produto."
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
    
    // Configurar escuta em tempo real para atualizações de produtos
    const channel = supabase
      .channel('public:products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
        console.log('Alteração detectada na tabela products:', payload);
        // Atualizar a lista de produtos quando houver alterações
        fetchProducts();
      })
      .subscribe();
      
    console.log('Escuta em tempo real configurada para a tabela products');
    
    return () => {
      console.log('Removendo escuta em tempo real');
      supabase.removeChannel(channel);
    };
  }, []);
  
  return { 
    products, 
    loading, 
    error, 
    fetchProducts,
    addProduct
  };
};
