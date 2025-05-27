
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

  if (!isAuthenticated && window.location.pathname !== '/') {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="page-container">
        <CustomerLayout>
          <div className="flex justify-center items-center h-64">
            <div className="text-center animate-fade-in">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-400 mx-auto mb-6"></div>
              <p className="text-white text-xl font-medium">Carregando produtos deliciosos...</p>
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
                  onClick={() => window.location.reload()} 
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
        <div className="content-container">
          <div className="page-header">
            <h1 className="page-title">
              {isAuthenticated ? (
                <>
                  Bem-vindo(a), <span className="gradient-text">{user?.name?.split(' ')[0] || 'Cliente'}!</span>
                </>
              ) : (
                <>
                  Bem-vindo ao <span className="gradient-text">Churrasquinho & Cia!</span>
                </>
              )}
            </h1>
            <p className="page-subtitle mb-8">
              Confira nossos produtos fresquinhos e faça seu pedido agora mesmo
            </p>
            
            <Button 
              onClick={handleRefreshProducts} 
              className="brand-button-secondary animate-fade-in"
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
