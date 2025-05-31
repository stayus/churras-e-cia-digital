
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
    <CustomerLayout>
      <Helmet>
        <title>Minha Conta - Churrasquinho & Cia</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Minha Conta
          </h1>
          <p className="text-lg text-gray-600">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          <div className="md:col-span-2">
            <Card className="bg-white border border-gray-200 shadow-md">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-red-600 text-xl flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-2">Nome</h3>
                      <p className="text-lg text-gray-900 font-medium">{user?.name || 'Não informado'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-2">Email</h3>
                      <p className="text-lg text-gray-900 font-medium">{user?.email || 'Não informado'}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200 flex flex-wrap gap-4">
                    <Button className="bg-red-600 hover:bg-red-700 text-white">
                      <Settings className="h-4 w-4 mr-2" />
                      Atualizar Perfil
                    </Button>
                    <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                      Alterar Senha
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleLogout}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Sair da Conta
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-white border border-gray-200 shadow-md">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-red-600 text-xl">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Button 
                    className="w-full justify-start bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => navigate('/pedidos')}
                  >
                    <Package className="h-4 w-4 mr-3" />
                    Meus Pedidos
                  </Button>
                  <Button 
                    className="w-full justify-start bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => navigate('/cardapio')}
                  >
                    <ShoppingBag className="h-4 w-4 mr-3" />
                    Ver Cardápio
                  </Button>
                  <Button 
                    className="w-full justify-start bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
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
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Churrasquinho&Cia. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </CustomerLayout>
  );
};

export default AccountPage;
