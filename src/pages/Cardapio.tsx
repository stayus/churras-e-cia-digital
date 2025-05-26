
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useProducts } from '@/hooks/useProducts';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CustomerLayout from '@/components/customer/CustomerLayout';
import ProductGrid from '@/components/customer/ProductGrid';

const CardapioPage = () => {
  const { products, loading, error, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRefreshProducts = () => {
    fetchProducts();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-red-900">
        <CustomerLayout>
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                <p className="text-white text-lg">Carregando cardápio...</p>
              </div>
            </div>
          </div>
        </CustomerLayout>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-red-900">
        <CustomerLayout>
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">Erro ao carregar produtos: {error}</p>
              <Button 
                onClick={handleRefreshProducts}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
              >
                Tentar novamente
              </Button>
            </div>
          </div>
        </CustomerLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-red-900">
      <CustomerLayout>
        <Helmet>
          <title>Cardápio - Churrasquinho & Cia</title>
        </Helmet>
        
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
              Nosso{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                Cardápio
              </span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl animate-fade-in" style={{ animationDelay: '200ms' }}>
              Sabores autênticos que conquistam seu paladar
            </p>
            
            <div className="flex justify-center mt-6">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefreshProducts} 
                className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold animate-fade-in"
                style={{ animationDelay: '400ms' }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar Cardápio
              </Button>
            </div>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '600ms' }}>
            <ProductGrid products={products} />
          </div>
        </div>
      </CustomerLayout>
    </div>
  );
};

export default CardapioPage;
