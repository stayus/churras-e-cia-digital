import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import type { DashboardStats as DashboardStatsType } from '@/types/dashboard';

interface DashboardStatsProps {
  stats: DashboardStatsType;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const data = [
    { name: 'Pedidos', value: stats.totalOrders },
    { name: 'Vendas', value: stats.totalSales },
    { name: 'Clientes', value: stats.totalCustomers },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas do Dia</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground justify-between">
        <span>Total de pedidos: {stats.totalOrders}</span>
        <span>Total de vendas: R$ {stats.totalSales.toFixed(2)}</span>
        <span>Total de clientes: {stats.totalCustomers}</span>
      </CardFooter>
    </Card>
  );
};
