
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
  category: 'lanche' | 'bebida' | 'refeicao' | 'sobremesa' | 'outro';
  extras: ProductExtra[];
}

export interface AddProductData {
  name: string;
  description: string;
  price: number;
  category: 'lanche' | 'bebida' | 'refeicao' | 'sobremesa' | 'outro';
  image_url?: string;
}
