import { CartState, CartAction, Product, CartExtra, CartItem } from './types';

// Initial state
export const initialState: CartState = {
  items: [],
  totalPrice: 0,
  selectedAddress: null,
  paymentMethod: null,
  observations: '',
  shippingFee: 0
};

// Calculate the total price of an item
export const calculateItemTotal = (product: Product, quantity: number, extras: CartExtra[]): number => {
  const basePrice = product.promotion_price || product.price;
  const extrasTotal = extras.reduce((sum, extra) => sum + extra.price, 0);
  return (basePrice + extrasTotal) * quantity;
};

// Reducer function
export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, extras } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === product.id);
      
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
          id: product.id,
          name: product.name,
          price: product.promotion_price || product.price,
          quantity: 1,
          extras: extras,
          imageUrl: product.image_url,
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
      const updatedItems = state.items.filter(item => item.id !== action.payload.productId);
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
        if (item.id === productId) {
          // We need to recalculate the totalPrice here
          // Since we don't have access to the original product, we need to calculate based on unit price
          const unitPrice = item.price;
          const extrasTotal = item.extras ? item.extras.reduce((sum, extra) => sum + extra.price, 0) : 0;
          const itemTotalPrice = (unitPrice + extrasTotal) * quantity;
          
          return {
            ...item,
            quantity,
            totalPrice: itemTotalPrice
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
