
import { useProductCheck } from './useProductCheck';
import { useProductAdd } from './useProductAdd';
import { useProductUpdate } from './useProductUpdate';

/**
 * Combined hook for all product operations
 */
export const useProductOperations = () => {
  const { checkProducts } = useProductCheck();
  const { addProduct } = useProductAdd();
  const { updateProduct } = useProductUpdate();
  
  return {
    checkProducts,
    addProduct,
    updateProduct
  };
};

// Export individual hooks for more granular usage
export { useProductCheck, useProductAdd, useProductUpdate };
