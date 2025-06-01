
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
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <h3 className="text-xl font-bold">Churrasquinho&Cia</h3>
              </div>
              <p className="text-gray-400">Sabor que conquista</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Links Úteis</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Redes Sociais</h4>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 py-4 sm:py-6 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm sm:text-base mb-4 md:mb-0">
              © 2025 Churrasquinho&Cia. Todos os direitos reservados.
            </p>
            <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
        </div>
      </footer>
    </CustomerLayout>
  );
};

export default CardapioPage;
