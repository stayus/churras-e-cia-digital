
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useProducts } from '@/hooks/useProducts';
import CustomerLayout from '@/components/customer/CustomerLayout';
import ProductGrid from '@/components/customer/ProductGrid';

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
            <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md">
              <p className="text-red-600 mb-6 text-lg">Erro ao carregar produtos:</p>
              <p className="text-gray-600 mb-6">{error}</p>
              <button 
                onClick={fetchProducts}
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <Helmet>
        <title>Cardápio - Churrasquinho & Cia</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nosso Cardápio
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Sabores autênticos que conquistam seu paladar. Feitos com ingredientes premium 
            e muito amor para você!
          </p>
        </div>

        <ProductGrid products={products} />
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Churrasquinho&Cia. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </CustomerLayout>
  );
};

export default CardapioPage;
