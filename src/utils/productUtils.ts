
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
  if (!data || data.length === 0) return [];
  
  return data.map(item => {
    // Parse the category to ensure it's a valid value
    const validCategories = ['lanche', 'bebida', 'refeicao', 'sobremesa', 'outro'];
    const category = validCategories.includes(item.category) 
      ? (item.category as 'lanche' | 'bebida' | 'refeicao' | 'sobremesa' | 'outro')
      : 'outro';
      
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image_url: item.image_url,
      is_out_of_stock: item.is_out_of_stock,
      promotion_price: item.promotion_price,
      category: category,
      extras: parseProductExtras(item.extras)
    };
  });
};
