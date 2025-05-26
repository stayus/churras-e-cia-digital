
import { useContext } from 'react';
import { CartContext } from './CartContext';

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  
  // Ensure cart object exists for backward compatibility
  if (!context.cart) {
    context.cart = {
      items: context.items || [],
      total: context.total || 0
    };
  }
  
  return context;
}
