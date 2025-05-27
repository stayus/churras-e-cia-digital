
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
      <div className="page-container">
        <CustomerLayout>
          <div className="content-container">
            <div className="flex justify-center items-center h-64">
              <div className="text-center animate-fade-in">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-400 mx-auto mb-6"></div>
                <p className="text-white text-xl font-medium">Carregando cardápio delicioso...</p>
              </div>
            </div>
          </div>
        </CustomerLayout>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <CustomerLayout>
          <div className="content-container">
            <div className="text-center py-16 animate-fade-in">
              <div className="brand-card max-w-md mx-auto p-8">
                <p className="text-red-400 mb-6 text-lg">Erro ao carregar produtos:</p>
                <p className="text-gray-300 mb-6">{error}</p>
                <Button 
                  onClick={handleRefreshProducts}
                  className="brand-button-primary"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar novamente
                </Button>
              </div>
            </div>
          </div>
        </CustomerLayout>
      </div>
    );
  }

  return (
    <div className="page-container">
      <CustomerLayout>
        <Helmet>
          <title>Cardápio - Churrasquinho & Cia</title>
        </Helmet>
        
        <div className="content-container">
          <div className="page-header">
            <h1 className="page-title">
              Nosso <span className="gradient-text">Cardápio</span>
            </h1>
            <p className="page-subtitle mb-8">
              Sabores autênticos que conquistam seu paladar. Feitos com ingredientes premium 
              e muito amor para você!
            </p>
            
            <div className="flex justify-center">
              <Button 
                onClick={handleRefreshProducts} 
                className="brand-button-secondary animate-fade-in"
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
