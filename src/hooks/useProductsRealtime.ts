
import { useRealtimeSetup, useRealtimeSubscription } from './realtime';

/**
 * Composite hook to handle product realtime subscriptions
 * This maintains backward compatibility with existing code
 */
export const useProductsRealtime = (onProductChange: () => void) => {
  const { setupRealtime } = useRealtimeSetup();
  
  // Set up subscription to product changes
  useRealtimeSubscription(onProductChange);

  return { setupRealtime };
};
