
import { useContext } from 'react';
import { CartContext } from './CartContext';

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  // Add getTotalItems method
  const getTotalItems = () => {
    return context.cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    ...context,
    getTotalItems
  };
};
