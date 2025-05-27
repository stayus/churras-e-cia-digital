
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomerLayout from '@/components/customer/CustomerLayout';
import { useNavigate } from 'react-router-dom';
import { User, ShoppingBag, Package, Settings } from 'lucide-react';

const AccountPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="page-container">
      <CustomerLayout>
        <Helmet>
          <title>Minha Conta - Churrasquinho & Cia</title>
        </Helmet>

        <div className="content-container">
          <div className="page-header">
            <h1 className="page-title">
              Minha <span className="gradient-text">Conta</span>
            </h1>
            <p className="page-subtitle">
              Gerencie suas informações pessoais e preferências
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            <div className="md:col-span-2">
              <Card className="brand-card animate-fade-in" style={{ animationDelay: '200ms' }}>
                <CardHeader>
                  <CardTitle className="text-yellow-400 heading-sm flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Nome</h3>
                        <p className="text-lg text-white font-medium">{user?.name || 'Não informado'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Email</h3>
                        <p className="text-lg text-white font-medium">{user?.email || 'Não informado'}</p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-700 flex flex-wrap gap-4">
                      <Button className="brand-button-secondary">
                        <Settings className="h-4 w-4 mr-2" />
                        Atualizar Perfil
                      </Button>
                      <Button className="brand-button-outline">
                        Alterar Senha
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 transition-all duration-300"
                      >
                        Sair da Conta
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="brand-card animate-fade-in" style={{ animationDelay: '400ms' }}>
                <CardHeader>
                  <CardTitle className="text-yellow-400 heading-sm">Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button 
                      className="w-full brand-button-outline justify-start"
                      onClick={() => navigate('/pedidos')}
                    >
                      <Package className="h-4 w-4 mr-3" />
                      Meus Pedidos
                    </Button>
                    <Button 
                      className="w-full brand-button-outline justify-start"
                      onClick={() => navigate('/cardapio')}
                    >
                      <ShoppingBag className="h-4 w-4 mr-3" />
                      Ver Cardápio
                    </Button>
                    <Button 
                      className="w-full brand-button-outline justify-start"
                      onClick={() => navigate('/carrinho')}
                    >
                      <ShoppingBag className="h-4 w-4 mr-3" />
                      Meu Carrinho
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </CustomerLayout>
    </div>
  );
};

export default AccountPage;
