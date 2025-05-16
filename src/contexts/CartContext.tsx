
// This file is a wrapper for backward compatibility
// Eventually we should update all imports to use the new path
export { CartProvider, useCart } from './cart';
export type { 
  Product, 
  CartExtra, 
  CartItem, 
  Address, 
  PaymentMethod,
  CartContextType,
  CartState,
  CartAction 
} from './cart';
