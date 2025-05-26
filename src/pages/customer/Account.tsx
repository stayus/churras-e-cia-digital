
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomerLayout from '@/components/customer/CustomerLayout';
import { useNavigate } from 'react-router-dom';

const AccountPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-red-900">
      <CustomerLayout>
        <Helmet>
          <title>Minha Conta - Churrasquinho & Cia</title>
        </Helmet>

        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Minha{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                Conta
              </span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
              Gerencie suas informações pessoais e preferências
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            <div className="md:col-span-2">
              <Card className="bg-gray-900/90 border-gray-700 shadow-2xl animate-fade-in" style={{ animationDelay: '200ms' }}>
                <CardHeader>
                  <CardTitle className="text-yellow-400 text-xl">Informações Pessoais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Nome</h3>
                      <p className="text-lg text-white font-medium">{user?.name || 'Não informado'}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Email</h3>
                      <p className="text-lg text-white font-medium">{user?.email || 'Não informado'}</p>
                    </div>

                    <div className="pt-6 flex flex-wrap gap-4">
                      <Button variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300">
                        Atualizar Perfil
                      </Button>
                      <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-all duration-300">
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
              <Card className="bg-gray-900/90 border-gray-700 shadow-2xl animate-fade-in" style={{ animationDelay: '400ms' }}>
                <CardHeader>
                  <CardTitle className="text-yellow-400 text-xl">Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-gray-600 text-white hover:bg-gray-800 transition-all duration-300" 
                      onClick={() => navigate('/pedidos')}
                    >
                      📦 Meus Pedidos
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-gray-600 text-white hover:bg-gray-800 transition-all duration-300" 
                      onClick={() => navigate('/cardapio')}
                    >
                      🍔 Ver Cardápio
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-gray-600 text-white hover:bg-gray-800 transition-all duration-300" 
                      onClick={() => navigate('/carrinho')}
                    >
                      🛒 Meu Carrinho
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
