
import React, { useState } from 'react';
import { Product } from '@/types/product';
import ProductCard from './ProductCard';
import CartSidebar from './CartSidebar';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCartOpen = () => {
    setIsCartOpen(true);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Nenhum produto encontrado.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onCartOpen={handleCartOpen}
          />
        ))}
      </div>
      <CartSidebar isOpen={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  );
};

export default ProductGrid;
