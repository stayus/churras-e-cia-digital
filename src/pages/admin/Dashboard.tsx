
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Package, CheckCircle, Clock, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalOrders: number;
  openOrders: number;
  completedOrders: number;
  openOrdersList: Array<{
    id: string;
    customer_name: string;
    customer_phone: string;
    status: string;
    created_at: string;
    total: number;
  }>;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    openOrders: 0,
    completedOrders: 0,
    openOrdersList: []
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get today's date
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      // Fetch today's orders
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', `${todayStr}T00:00:00`)
        .lte('created_at', `${todayStr}T23:59:59`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const totalOrders = orders?.length || 0;
      const openOrders = orders?.filter(order => 
        order.status === 'received' || order.status === 'preparing' || order.status === 'delivering'
      ).length || 0;
      const completedOrders = orders?.filter(order => order.status === 'completed').length || 0;
      
      // Get open orders with customer info
      const openOrdersList = orders?.filter(order => 
        order.status === 'received' || order.status === 'preparing' || order.status === 'delivering'
      ).map(order => {
        // Safely parse the address JSON
        let addressData: any = {};
        try {
          addressData = typeof order.address === 'string' ? JSON.parse(order.address) : order.address || {};
        } catch (e) {
          console.error('Error parsing address:', e);
        }

        return {
          id: order.id,
          customer_name: addressData.name || 'Cliente',
          customer_phone: addressData.phone || 'Não informado',
          status: order.status,
          created_at: order.created_at,
          total: order.total
        };
      }) || [];

      setStats({
        totalOrders,
        openOrders,
        completedOrders,
        openOrdersList
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('dashboard-orders')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' },
        () => fetchDashboardData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      'received': 'Recebido',
      'preparing': 'Preparando',
      'delivering': 'Entregando',
      'completed': 'Finalizado'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-red-600 mr-2" />
          <span className="text-gray-700">Carregando dashboard...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-md border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Total de Pedidos Hoje
              </CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalOrders}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Pedidos em Aberto
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.openOrders}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Pedidos Finalizados
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completedOrders}</div>
            </CardContent>
          </Card>
        </div>

        {/* Open Orders List */}
        <Card className="bg-white shadow-md border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Pedidos em Aberto
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.openOrdersList.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                Nenhum pedido em aberto no momento.
              </p>
            ) : (
              <div className="space-y-4">
                {stats.openOrdersList.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{order.customer_name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'received' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'preparing' ? 'bg-orange-100 text-orange-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <Phone className="h-4 w-4" />
                          <span>{order.customer_phone}</span>
                        </div>
                        <div className="text-sm text-gray-700">
                          Pedido #{order.id.substring(0, 8)} - {formatCurrency(order.total)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(order.created_at).toLocaleString('pt-BR')}
                        </div>
                      </div>
                      <Link 
                        to={`/admin/pedidos?order=${order.id}`}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
