import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useProducts } from '@/hooks/useProducts';
import CustomerLayout from '@/components/customer/CustomerLayout';
import ProductGrid from '@/components/customer/ProductGrid';
import NewHomeFooter from '@/components/customer/NewHomeFooter'; // <= importar o footer

const CardapioPage = () => {
  const { products, loading, error, fetchProducts } = useProducts();

  useEffect(() => {
    console.log('Cardapio: Componente montado, carregando produtos...');
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <CustomerLayout>
        <Helmet>
          <title>Cardápio - Churrasquinho & Cia</title>
        </Helmet>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-6"></div>
              <p className="text-gray-600 text-xl font-medium">Carregando cardápio delicioso...</p>
            </div>
          </div>
        </div>
        <NewHomeFooter /> {/* <= aqui está o footer mesmo no estado de loading */}
      </CustomerLayout>
    );
  }

  if (error) {
    return (
      <CustomerLayout>
        <Helmet>
          <title>Cardápio - Churrasquinho & Cia</title>
        </Helmet>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <p className="text-red-600 font-bold">Erro ao carregar produtos. Tente novamente mais tarde.</p>
          </div>
        </div>
        <NewHomeFooter /> {/* <= aqui também */}
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <Helmet>
        <title>Cardápio - Churrasquinho & Cia</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <ProductGrid products={products} />
      </div>
      <NewHomeFooter /> {/* <= e aqui no caso de sucesso */}
    </CustomerLayout>
  );
};

export default CardapioPage;
