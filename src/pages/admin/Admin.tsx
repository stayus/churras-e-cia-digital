
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Package,
  Users,
  FileBarChart,
  Settings,
  ShoppingCart,
  TrendingUp,
  Clock,
  Ban,
  CheckCircle,
  Calendar
} from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  const { user } = useAuth();

  // Mock data for the dashboard
  const summaryData = {
    totalSales: 'R$ 15.420,50',
    ordersToday: 48,
    outOfStockItems: 3,
    pendingOrders: 12
  };

  const recentOrdersData = [
    { id: '#12345', customer: 'Carlos Oliveira', total: 'R$ 75,90', status: 'preparing' },
    { id: '#12344', customer: 'Ana Silva', total: 'R$ 42,00', status: 'received' },
    { id: '#12343', customer: 'Rafael Costa', total: 'R$ 108,50', status: 'delivering' },
    { id: '#12342', customer: 'Julia Santos', total: 'R$ 64,00', status: 'completed' },
    { id: '#12341', customer: 'Marcos Pereira', total: 'R$ 37,90', status: 'completed' },
  ];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'received':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'delivering':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'received':
        return 'Recebido';
      case 'preparing':
        return 'Preparando';
      case 'delivering':
        return 'Entregando';
      case 'completed':
        return 'Concluído';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'received':
        return <Clock className="h-4 w-4" />;
      case 'preparing':
        return <TrendingUp className="h-4 w-4" />;
      case 'delivering':
        return <ShoppingCart className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Ban className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">
              Bem-vindo, {user?.name}! Aqui está um resumo do seu negócio hoje.
            </p>
          </div>
          <div className="text-sm text-gray-500">
            <Calendar className="h-4 w-4 inline-block mr-1" />
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-brand-red">
                <TrendingUp className="h-5 w-5 mr-2" />
                Vendas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{summaryData.totalSales}</p>
              <p className="text-xs text-muted-foreground">+15% em relação ao mês anterior</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-green-600">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Pedidos Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{summaryData.ordersToday}</p>
              <p className="text-xs text-muted-foreground">+8% em relação à semana passada</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-amber-600">
                <Ban className="h-5 w-5 mr-2" />
                Itens em Falta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{summaryData.outOfStockItems}</p>
              <p className="text-xs text-muted-foreground">Atualize seu estoque</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-blue-600">
                <Clock className="h-5 w-5 mr-2" />
                Pedidos Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{summaryData.pendingOrders}</p>
              <p className="text-xs text-muted-foreground">Precisam de atenção</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Link to="/admin/produtos">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6">
                <CardTitle className="text-lg">Gerenciar Produtos</CardTitle>
                <Package className="h-6 w-6 text-brand-red" />
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Adicione, edite ou remova produtos do cardápio.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/admin/funcionarios">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6">
                <CardTitle className="text-lg">Equipe</CardTitle>
                <Users className="h-6 w-6 text-brand-red" />
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Gerencie funcionários e motoboys da sua equipe.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/admin/relatorios">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6">
                <CardTitle className="text-lg">Relatórios</CardTitle>
                <FileBarChart className="h-6 w-6 text-brand-red" />
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Visualize relatórios de vendas e desempenho.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/admin/pedidos">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6">
                <CardTitle className="text-lg">Pedidos</CardTitle>
                <ShoppingCart className="h-6 w-6 text-brand-red" />
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Acompanhe e gerencie os pedidos em andamento.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/admin/configuracoes">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6">
                <CardTitle className="text-lg">Configurações</CardTitle>
                <Settings className="h-6 w-6 text-brand-red" />
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Configure informações da loja e taxas de entrega.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Pedidos Recentes</CardTitle>
            <CardDescription>
              Os últimos 5 pedidos recebidos pela lanchonete.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">ID</th>
                    <th className="text-left py-3 px-4 font-medium">Cliente</th>
                    <th className="text-left py-3 px-4 font-medium">Total</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrdersData.map((order, index) => (
                    <tr key={order.id} className={index !== recentOrdersData.length - 1 ? "border-b" : ""}>
                      <td className="py-3 px-4">{order.id}</td>
                      <td className="py-3 px-4">{order.customer}</td>
                      <td className="py-3 px-4">{order.total}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{getStatusLabel(order.status)}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/50 px-6 py-3">
            <Button variant="link" className="ml-auto" asChild>
              <Link to="/admin/pedidos">Ver todos os pedidos</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
