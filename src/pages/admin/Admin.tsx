
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { DashboardStats } from '@/components/admin/dashboard/DashboardStats';
import { supabase } from '@/integrations/supabase/client';
import { DashboardStats as DashboardStatsType } from '@/types/dashboard';
import { useToast } from '@/components/ui/use-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStatsType>({
    dailyRevenue: 0,
    totalOrders: 0,
    canceledOrders: 0,
    totalSales: 0,
    totalCustomers: 0,
    paymentMethods: {
      pix: 0,
      cartao: 0,
      dinheiro: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      try {
        // Obtenha a data de hoje no formato ISO
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayISO = today.toISOString();
        
        // Busca pedidos de hoje
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .gte('created_at', todayISO);
          
        if (ordersError) {
          throw ordersError;
        }
        
        // Calcula as estatísticas
        const totalOrders = ordersData.length;
        const canceledOrders = ordersData.filter(order => order.status === 'canceled').length;
        
        const pixPayments = ordersData.filter(order => order.payment_method === 'pix').length;
        const cardPayments = ordersData.filter(order => order.payment_method === 'cartao').length;
        const cashPayments = ordersData.filter(order => order.payment_method === 'dinheiro').length;
        
        // Calcula receita
        const dailyRevenue = ordersData
          .filter(order => order.status !== 'canceled')
          .reduce((sum, order) => sum + order.total, 0);
        
        // Busca clientes únicos que fizeram pedidos hoje
        const uniqueCustomers = new Set(ordersData.map(order => order.customer_id));
        
        setStats({
          dailyRevenue,
          totalOrders,
          canceledOrders,
          totalSales: dailyRevenue, // Use dailyRevenue for totalSales
          totalCustomers: uniqueCustomers.size,
          paymentMethods: {
            pix: pixPayments,
            cartao: cardPayments,
            dinheiro: cashPayments
          }
        });
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao carregar estatísticas',
          description: 'Não foi possível carregar as estatísticas do dashboard.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
    
    // Atualiza a cada 5 minutos
    const intervalId = setInterval(fetchDashboardStats, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [toast]);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <DashboardStats stats={stats} isLoading={isLoading} />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
