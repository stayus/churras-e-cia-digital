
import React, { useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import NewHomeHeader from '@/components/home/NewHomeHeader';
import NewHeroSection from '@/components/home/NewHeroSection';
import NewPromotionsSection from '@/components/home/NewPromotionsSection';
import NewPopularSection from '@/components/home/NewPopularSection';
import NewCTASection from '@/components/home/NewCTASection';
import NewHomeFooter from '@/components/home/NewHomeFooter';
import ProductGrid from '@/components/customer/ProductGrid';

const Home = () => {
  const { products, loading, error, fetchProducts } = useProducts();

  useEffect(() => {
    console.log('Home: Componente montado, carregando produtos...');
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <NewHomeHeader />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-6"></div>
            <p className="text-gray-600 text-xl font-medium">Carregando produtos deliciosos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <NewHomeHeader />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
          <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-md">
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
    );
  }

  return (
    <div className="page-container">
      <NewHomeHeader />
      <main>
        <NewHeroSection />
        <NewPromotionsSection />
        
        {/* Seção do Cardápio */}
        <section id="cardapio" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Nosso Cardápio
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Sabores autênticos que conquistam seu paladar. Feitos com ingredientes premium 
                e muito amor para você!
              </p>
            </div>
            <ProductGrid products={products} />
          </div>
        </section>
        
        <NewPopularSection />
        <NewCTASection />
      </main>
      <NewHomeFooter />
    </div>
  );
};

export default Home;
