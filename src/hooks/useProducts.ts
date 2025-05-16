
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
  extras?: ProductExtra[];
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('name');
          
        if (error) {
          throw error;
        }
        
        // Transform the data to match our Product type
        const formattedProducts: Product[] = data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          image_url: item.image_url,
          is_out_of_stock: item.is_out_of_stock,
          promotion_price: item.promotion_price,
          extras: Array.isArray(item.extras) ? item.extras as unknown as ProductExtra[] : []
        }));
        
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
    
    fetchProducts();
    
    // Configurar escuta em tempo real para atualizações de produtos
    const subscription = supabase
      .channel('public:products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
        // Atualizar a lista de produtos quando houver alterações
        fetchProducts();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);
  
  return { products, loading, error };
};
