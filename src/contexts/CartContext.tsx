
import React, { createContext, useContext, useState, useReducer, ReactNode } from 'react';

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
    name: string;
    price: number;
  }>;
}

export interface CartExtra {
  name: string;
  price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  extras: CartExtra[];
  totalPrice: number;
}

export interface Address {
  street: string;
  number: string;
  city: string;
  zip: string;
  lat?: number;
  lng?: number;
}

export type PaymentMethod = 'pix' | 'dinheiro' | 'cartao';

interface CartState {
  items: CartItem[];
  totalPrice: number;
  selectedAddress: Address | null;
  paymentMethod: PaymentMethod | null;
  observations: string;
  shippingFee: number;
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: { product: Product; extras: CartExtra[] } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'SET_ADDRESS'; payload: Address }
  | { type: 'SET_PAYMENT_METHOD'; payload: PaymentMethod }
  | { type: 'SET_OBSERVATIONS'; payload: string }
  | { type: 'CALCULATE_SHIPPING'; payload: number }
  | { type: 'CLEAR_CART' };

interface CartContextType {
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

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

// Initial state
const initialState: CartState = {
  items: [],
  totalPrice: 0,
  selectedAddress: null,
  paymentMethod: null,
  observations: '',
  shippingFee: 0
};

// Calculate the total price of an item
const calculateItemTotal = (product: Product, quantity: number, extras: CartExtra[]): number => {
  const basePrice = product.promotion_price || product.price;
  const extrasTotal = extras.reduce((sum, extra) => sum + extra.price, 0);
  return (basePrice + extrasTotal) * quantity;
};

// Reducer function
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, extras } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...state.items];
        const existingItem = updatedItems[existingItemIndex];
        const updatedItem = {
          ...existingItem,
          quantity: existingItem.quantity + 1,
          extras: extras,
          totalPrice: calculateItemTotal(product, existingItem.quantity + 1, extras)
        };
        updatedItems[existingItemIndex] = updatedItem;

        const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
        
        return {
          ...state,
          items: updatedItems,
          totalPrice: newTotalPrice
        };
      } else {
        // Add new item
        const newItem: CartItem = {
          product,
          quantity: 1,
          extras,
          totalPrice: calculateItemTotal(product, 1, extras)
        };

        const newTotalPrice = state.totalPrice + newItem.totalPrice;
        
        return {
          ...state,
          items: [...state.items, newItem],
          totalPrice: newTotalPrice
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.product.id !== action.payload.productId);
      const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
      
      return {
        ...state,
        items: updatedItems,
        totalPrice: newTotalPrice
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { productId } });
      }
      
      const updatedItems = state.items.map(item => {
        if (item.product.id === productId) {
          return {
            ...item,
            quantity,
            totalPrice: calculateItemTotal(item.product, quantity, item.extras)
          };
        }
        return item;
      });
      
      const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
      
      return {
        ...state,
        items: updatedItems,
        totalPrice: newTotalPrice
      };
    }
    
    case 'SET_ADDRESS':
      return {
        ...state,
        selectedAddress: action.payload
      };
    
    case 'SET_PAYMENT_METHOD':
      return {
        ...state,
        paymentMethod: action.payload
      };
    
    case 'SET_OBSERVATIONS':
      return {
        ...state,
        observations: action.payload
      };
    
    case 'CALCULATE_SHIPPING':
      return {
        ...state,
        shippingFee: action.payload
      };
    
    case 'CLEAR_CART':
      return initialState;
    
    default:
      return state;
  }
};

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
