
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CustomerLayout from '@/components/customer/CustomerLayout';
import ProductGrid from '@/components/customer/ProductGrid';
import { useProducts } from '@/hooks/useProducts';
import { RefreshCw } from 'lucide-react';

const CustomerDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { products, loading, error, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRefreshProducts = () => {
    fetchProducts();
  };

  // Se não estiver autenticado, redirecionar para login apenas se estiver tentando acessar área protegida
  if (!isAuthenticated && window.location.pathname !== '/') {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-red-900">
        <CustomerLayout>
          <div className="flex justify-center items-center h-64">
            <div className="text-center animate-fade-in">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
              <p className="text-white text-lg">Carregando produtos deliciosos...</p>
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
            <div className="text-center py-12 animate-fade-in">
              <p className="text-red-400 mb-4 text-lg">Erro ao carregar produtos: {error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-8 py-3 transition-all duration-300 hover:scale-105"
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
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              {isAuthenticated ? (
                <>
                  Bem-vindo(a),{' '}
                  <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                    {user?.name?.split(' ')[0] || 'Cliente'}!
                  </span>
                </>
              ) : (
                <>
                  Bem-vindo ao{' '}
                  <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                    Churrasquinho & Cia!
                  </span>
                </>
              )}
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed">
              Confira nossos produtos fresquinhos e faça seu pedido agora mesmo
            </p>
            
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleRefreshProducts} 
              className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold px-8 py-3 transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: '200ms' }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar Produtos
            </Button>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
            <ProductGrid products={products} />
          </div>
        </div>
      </CustomerLayout>
    </div>
  );
};

export default CustomerDashboard;
