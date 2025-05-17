
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
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Efetuar refresh dos produtos quando a página carrega
  useEffect(() => {
    console.log("CustomerDashboard montado - buscando produtos");
    fetchProducts();
  }, []);

  const handleRefreshProducts = () => {
    console.log("Atualizando manualmente a lista de produtos");
    fetchProducts();
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex justify-center items-center h-64">
          <p>Carregando produtos...</p>
        </div>
      </CustomerLayout>
    );
  }

  if (error) {
    return (
      <CustomerLayout>
        <Card className="mb-6">
          <div className="pt-6 px-6 pb-6">
            <p className="text-red-500">Erro ao carregar produtos: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Tentar novamente
            </Button>
          </div>
        </Card>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Bem-vindo(a), {user?.name?.split(' ')[0] || 'Cliente'}!</h1>
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
