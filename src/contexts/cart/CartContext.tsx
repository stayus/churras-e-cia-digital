
import React, { createContext, useReducer, ReactNode } from 'react';
import { CartContextType, CartState, CartProduct } from './types';
import { cartReducer } from './cartReducer';

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = {
  items: [],
  total: 0
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (product: CartProduct, quantity: number) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const getItemQuantity = (productId: string): number => {
    const item = state.items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const value: CartContextType = {
    items: state.items,
    total: state.total,
    addItem,
    removeItem,
    updateQuantity,
    getItemQuantity,
    clearCart,
    cart: state
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext };
