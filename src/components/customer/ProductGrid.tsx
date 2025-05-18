
import React, { useState } from 'react';
import { Product } from '@/hooks/useProducts';
import ProductCard from '@/components/customer/ProductCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  if (!products || products.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-sm">
        <p className="text-gray-500">Nenhum produto disponível no momento.</p>
      </div>
    );
  }

  // Group products by category
  const categories = {
    all: products,
    lanche: products.filter(p => p.category === 'lanche'),
    bebida: products.filter(p => p.category === 'bebida'),
    refeicao: products.filter(p => p.category === 'refeicao'),
    sobremesa: products.filter(p => p.category === 'sobremesa'),
    outro: products.filter(p => p.category === 'outro'),
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="w-full mb-6 flex flex-wrap">
          <TabsTrigger value="all" className="flex-1">
            Todos
          </TabsTrigger>
          <TabsTrigger value="lanche" className="flex-1">
            Lanches
          </TabsTrigger>
          <TabsTrigger value="bebida" className="flex-1">
            Bebidas
          </TabsTrigger>
          <TabsTrigger value="refeicao" className="flex-1">
            Refeições
          </TabsTrigger>
          <TabsTrigger value="sobremesa" className="flex-1">
            Sobremesas
          </TabsTrigger>
          {categories.outro.length > 0 && (
            <TabsTrigger value="outro" className="flex-1">
              Outros
            </TabsTrigger>
          )}
        </TabsList>

        {Object.entries(categories).map(([category, categoryProducts]) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categoryProducts.length > 0 ? (
                categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500 py-12">
                  Nenhum produto nesta categoria
                </p>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ProductGrid;
