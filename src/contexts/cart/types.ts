
export interface CartExtra {
  id: string;
  name: string;
  price: number;
}

export interface CartProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_out_of_stock: boolean;
  promotion_price: number | null;
  category: 'lanche' | 'bebida' | 'refeicao' | 'sobremesa' | 'outro';
  extras: CartExtra[];
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
  extras: CartExtra[];
}

export interface CartState {
  items: CartItem[];
  total: number;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: CartProduct; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

export interface CartContextType {
  items: CartItem[];
  total: number;
  addItem: (product: CartProduct, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getItemQuantity: (productId: string) => number;
  clearCart: () => void;
}
