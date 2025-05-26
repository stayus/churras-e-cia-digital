
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
  id: string;
  product: CartProduct;
  quantity: number;
  extras: CartExtra[];
  price: number;
  name: string;
  imageUrl: string;
  totalPrice: number;
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

// Additional types for compatibility
export interface Address {
  id: string;
  street: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
  zip: string;
  complement?: string;
  label?: string;
}

export type PaymentMethod = 'pix' | 'dinheiro' | 'cartao';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_out_of_stock: boolean;
  promotion_price: number | null;
  category: 'lanche' | 'bebida' | 'refeicao' | 'sobremesa' | 'outro';
  extras: CartExtra[];
  created_at?: string;
}

export interface CartContextType {
  items: CartItem[];
  total: number;
  addItem: (product: CartProduct, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getItemQuantity: (productId: string) => number;
  clearCart: () => void;
  cart: CartState;
}
