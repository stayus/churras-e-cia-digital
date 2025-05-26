
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
              <p className="text-white text-lg">Carregando produtos...</p>
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
          <Card className="mb-6 bg-gray-900/90 border-gray-700">
            <div className="pt-6 px-6 pb-6">
              <p className="text-red-400">Erro ao carregar produtos: {error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
              >
                Tentar novamente
              </Button>
            </div>
          </Card>
        </CustomerLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-red-900">
      <CustomerLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex justify-between items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold mb-2 text-white">
                {isAuthenticated ? `Bem-vindo(a), ${user?.name?.split(' ')[0] || 'Cliente'}!` : 'Bem-vindo ao Churrasquinho & Cia!'}
              </h1>
              <p className="text-gray-300 text-lg">Confira nossos produtos e faça seu pedido</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefreshProducts} 
              className="flex items-center gap-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black animate-fade-in"
              style={{ animationDelay: '200ms' }}
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar
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
