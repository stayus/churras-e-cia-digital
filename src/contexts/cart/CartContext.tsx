
import React, { createContext, useReducer, ReactNode } from 'react';
import { cartReducer, initialState } from './cartReducer';
import { 
  CartContextType, 
  Product, 
  CartExtra, 
  Address, 
  PaymentMethod
} from './types';

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (product: Product, extras: CartExtra[]) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, extras } });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const setAddress = (address: Address) => {
    dispatch({ type: 'SET_ADDRESS', payload: address });
    // After setting address, we would ideally recalculate shipping
    calculateShipping(address);
  };

  const setPaymentMethod = (method: PaymentMethod) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: method });
  };

  const setObservations = (observations: string) => {
    dispatch({ type: 'SET_OBSERVATIONS', payload: observations });
  };

  // This function would use the Google Maps API to calculate shipping based on distance
  const calculateShipping = (address: Address) => {
    // This would be replaced with actual distance calculation logic
    // For now we'll use a fixed fee of 5
    const mockShippingFee = 5;
    dispatch({ type: 'CALCULATE_SHIPPING', payload: mockShippingFee });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{
      cart,
      addItem,
      removeItem,
      updateQuantity,
      setAddress,
      setPaymentMethod,
      setObservations,
      calculateShipping,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}
