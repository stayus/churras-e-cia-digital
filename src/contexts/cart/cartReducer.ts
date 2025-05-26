
import { CartState, CartAction } from './types';

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === product.id
      );

      if (existingItemIndex !== -1) {
        // Update existing item quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        
        const total = updatedItems.reduce((sum, item) => {
          const price = item.product.promotion_price || item.product.price;
          return sum + (price * item.quantity);
        }, 0);

        return {
          items: updatedItems,
          total
        };
      } else {
        // Add new item
        const newItem = {
          id: product.id,
          product,
          quantity,
          extras: [],
          price: product.promotion_price || product.price,
          name: product.name,
          imageUrl: product.image_url
        };
        
        const newItems = [...state.items, newItem];
        const total = newItems.reduce((sum, item) => {
          const price = item.product.promotion_price || item.product.price;
          return sum + (price * item.quantity);
        }, 0);

        return {
          items: newItems,
          total
        };
      }
    }

    case 'REMOVE_ITEM': {
      const productId = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === productId
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...state.items];
        if (updatedItems[existingItemIndex].quantity > 1) {
          // Decrease quantity
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity - 1
          };
        } else {
          // Remove item completely
          updatedItems.splice(existingItemIndex, 1);
        }

        const total = updatedItems.reduce((sum, item) => {
          const price = item.product.promotion_price || item.product.price;
          return sum + (price * item.quantity);
        }, 0);

        return {
          items: updatedItems,
          total
        };
      }
      return state;
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: id });
      }

      const updatedItems = state.items.map(item =>
        item.product.id === id ? { ...item, quantity } : item
      );

      const total = updatedItems.reduce((sum, item) => {
        const price = item.product.promotion_price || item.product.price;
        return sum + (price * item.quantity);
      }, 0);

      return {
        items: updatedItems,
        total
      };
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0
      };

    default:
      return state;
  }
};
