
import { useProductCheck } from './useProductCheck';
import { useProductAdd } from './useProductAdd';
import { useProductUpdate } from './useProductUpdate';
import { useProductDelete } from './useProductDelete';

/**
 * Combined hook for all product operations
 */
export const useProductOperations = () => {
  const { checkProducts } = useProductCheck();
  const { addProduct } = useProductAdd();
  const { updateProduct } = useProductUpdate();
  const { deleteProduct } = useProductDelete();
  
  return {
    checkProducts,
    addProduct,
    updateProduct,
    deleteProduct
  };
};

// Export individual hooks for more granular usage
export { useProductCheck, useProductAdd, useProductUpdate, useProductDelete };
