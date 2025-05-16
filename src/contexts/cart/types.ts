
import { Json } from '@/integrations/supabase/types';

// Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_out_of_stock: boolean;
  promotion_price?: number;
  extras: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}

export interface CartExtra {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  extras?: CartExtra[];
  imageUrl?: string;
  totalPrice: number;
}

export interface Address {
  id: string;
  street: string;
  number: string;
  city: string;
  zip: string;
  complement?: string;
  label?: string;
}

export type PaymentMethod = 'pix' | 'dinheiro' | 'cartao';

export interface CartState {
  items: CartItem[];
  totalPrice: number;
  selectedAddress: Address | null;
  paymentMethod: PaymentMethod | null;
  observations: string;
  shippingFee: number;
}

export type CartAction = 
  | { type: 'ADD_ITEM'; payload: { product: Product; extras: CartExtra[] } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'SET_ADDRESS'; payload: Address }
  | { type: 'SET_PAYMENT_METHOD'; payload: PaymentMethod }
  | { type: 'SET_OBSERVATIONS'; payload: string }
  | { type: 'CALCULATE_SHIPPING'; payload: number }
  | { type: 'CLEAR_CART' };

export interface CartContextType {
  cart: CartState;
  addItem: (product: Product, extras: CartExtra[]) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setAddress: (address: Address) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setObservations: (observations: string) => void;
  calculateShipping: (address: Address) => void;
  clearCart: () => void;
}
