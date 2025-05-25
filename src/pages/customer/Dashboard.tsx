
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
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
  const { products, loading, refetch } = useProducts();

  useEffect(() => {
    refetch();
  }, []);

  const handleRefreshProducts = () => {
    refetch();
  };

  // Se não estiver autenticado, redirecionar para login apenas se estiver tentando acessar área protegida
  if (!isAuthenticated && window.location.pathname !== '/') {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex justify-center items-center h-64">
          <p>Carregando produtos...</p>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {isAuthenticated ? `Bem-vindo(a), ${user?.name?.split(' ')[0] || 'Cliente'}!` : 'Bem-vindo ao Churrasquinho & Cia!'}
            </h1>
            <p className="text-gray-600">Confira nossos produtos e faça seu pedido</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshProducts} 
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
        </div>

        <ProductGrid products={products} />
      </div>
    </CustomerLayout>
  );
};

export default CustomerDashboard;
