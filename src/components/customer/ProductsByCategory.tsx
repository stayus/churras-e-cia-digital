
import React, { useMemo } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types/product';

interface ProductsByCategoryProps {
  products: Product[];
}

const ProductsByCategory: React.FC<ProductsByCategoryProps> = ({ products }) => {
  const productsByCategory = useMemo(() => {
    const categories: { [key: string]: Product[] } = {};
    
    products.forEach(product => {
      const category = product.category || 'Outros';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(product);
    });
    
    return categories;
  }, [products]);

  const categoryOrder = ['Hambúrgueres', 'Lanches', 'Bebidas', 'Sobremesas', 'Outros'];
  const sortedCategories = Object.keys(productsByCategory).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });

  if (sortedCategories.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Nenhum produto disponível
          </h3>
          <p className="text-gray-600">
            Em breve teremos deliciosos produtos para você!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {sortedCategories.map(category => (
        <div key={category} className="animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {category}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-yellow-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {productsByCategory[category].map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                className="animate-fade-in-up"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsByCategory;
