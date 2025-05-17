
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
    <CustomerLayout>
      <Helmet>
        <title>Minha Conta - Churrasquinho & Cia</title>
      </Helmet>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <h1 className="text-3xl font-bold mb-6">Minha Conta</h1>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Nome</h3>
                    <p className="text-lg">{user?.name || 'Não informado'}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="text-lg">{user?.email || 'Não informado'}</p>
                  </div>

                  <div className="pt-4">
                    <Button variant="outline" className="mr-2">
                      Atualizar Perfil
                    </Button>
                    <Button variant="outline" className="mr-2">
                      Alterar Senha
                    </Button>
                    <Button variant="destructive" onClick={handleLogout}>
                      Sair da Conta
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/pedidos')}>
                    Meus Pedidos
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/catalogo')}>
                    Ver Cardápio
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/carrinho')}>
                    Meu Carrinho
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default AccountPage;
