
import React, { useState } from 'react';
import { Product } from '@/hooks/useProducts';
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
      <div className="text-center py-16">
        <div className="brand-card max-w-lg mx-auto p-12">
          <div className="text-6xl mb-6">🍽️</div>
          <h3 className="heading-md text-white mb-4">Nenhum produto encontrado</h3>
          <p className="text-gray-400 text-body">
            Não conseguimos encontrar produtos no momento. Tente novamente mais tarde.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="products-grid">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ProductCard 
              product={product} 
              onCartOpen={handleCartOpen}
            />
          </div>
        ))}
      </div>
      <CartSidebar isOpen={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  );
};

export default ProductGrid;
