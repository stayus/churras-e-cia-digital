
import { Json } from '@/integrations/supabase/types';
import { Product, ProductExtra } from '@/types/product';

/**
 * Parse extras data from database to proper typed format
 */
export const parseProductExtras = (extras: any): ProductExtra[] => {
  let parsedExtras: ProductExtra[] = [];
  
  if (!extras) return parsedExtras;
  
  if (Array.isArray(extras)) {
    parsedExtras = extras.map(extra => ({
      id: extra.id?.toString() || '',
      name: extra.name?.toString() || '',
      price: typeof extra.price === 'number' ? extra.price : 0
    }));
  } else if (typeof extras === 'string') {
    try {
      const parsedData = JSON.parse(extras);
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
  
  return parsedExtras;
};

/**
 * Format database product data to match Product type
 */
export const formatDbProducts = (data: any[]): Product[] => {
  console.log("formatDbProducts recebeu dados:", data);
  
  if (!data || data.length === 0) return [];
  
  const formattedProducts = data.map(item => {
    // Ensure all required fields exist with default values if missing
    const category = item.category || 'outro';
    const extras = item.extras || [];
    const is_out_of_stock = !!item.is_out_of_stock;
    const image_url = item.image_url || '';
    
    const product: Product = {
      id: item.id || '',
      name: item.name || '',
      description: item.description || '',
      price: typeof item.price === 'number' ? item.price : 0,
      image_url: image_url,
      is_out_of_stock: is_out_of_stock,
      promotion_price: item.promotion_price || null,
      category: category as 'lanche' | 'bebida' | 'refeicao' | 'sobremesa' | 'outro',
      extras: parseProductExtras(extras)
    };
    
    return product;
  });
  
  console.log("formatDbProducts retornou produtos formatados:", formattedProducts);
  return formattedProducts;
};
