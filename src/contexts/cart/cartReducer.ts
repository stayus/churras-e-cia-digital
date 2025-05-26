
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
export const calculateItemTotal = (product: Product, quantity: number): number => {
  const basePrice = product.promotion_price || product.price;
  return basePrice * quantity;
};

// Reducer function
export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...state.items];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;
        const updatedItem = {
          ...existingItem,
          quantity: newQuantity,
          totalPrice: calculateItemTotal(product, newQuantity)
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
          quantity: quantity,
          extras: [],
          imageUrl: product.image_url,
          totalPrice: calculateItemTotal(product, quantity)
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
      const { productId } = action.payload;
      const itemToRemove = state.items.find(item => item.id === productId);
      
      if (!itemToRemove) return state;
      
      if (itemToRemove.quantity > 1) {
        // Decrease quantity by 1
        const updatedItems = state.items.map(item => {
          if (item.id === productId) {
            const newQuantity = item.quantity - 1;
            return {
              ...item,
              quantity: newQuantity,
              totalPrice: (item.price * newQuantity)
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
      } else {
        // Remove item completely
        const updatedItems = state.items.filter(item => item.id !== productId);
        const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
        
        return {
          ...state,
          items: updatedItems,
          totalPrice: newTotalPrice
        };
      }
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        const updatedItems = state.items.filter(item => item.id !== productId);
        const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
        
        return {
          ...state,
          items: updatedItems,
          totalPrice: newTotalPrice
        };
      }
      
      const updatedItems = state.items.map(item => {
        if (item.id === productId) {
          const itemTotalPrice = item.price * quantity;
          
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
