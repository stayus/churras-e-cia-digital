
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2 } from "lucide-react";

interface DashboardStats {
  dailyRevenue: number;
  totalOrders: number;
  canceledOrders: number;
  paymentMethods: {
    pix: number;
    cartao: number;
    dinheiro: number;
  };
  totalSales: number;
  totalCustomers: number;
  hourlyData: {
    hour: number;
    orders: number;
    revenue: number;
  }[];
  bestSellingProducts: {
    name: string;
    quantity: number;
    revenue: number;
  }[];
}

const PAYMENT_COLORS = ["#10b981", "#3b82f6", "#f59e0b"];

const SalesReport = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const today = new Date();

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Get today's date in YYYY-MM-DD format
      const todayStr = format(today, "yyyy-MM-dd");
      const startOfDay = `${todayStr}T00:00:00`;
      const endOfDay = `${todayStr}T23:59:59`;

      // Fetch orders for today
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .gte("created_at", startOfDay)
        .lte("created_at", endOfDay);

      if (ordersError) {
        throw ordersError;
      }

      // Initialize payment method counters
      const paymentMethods = {
        pix: 0,
        cartao: 0,
        dinheiro: 0,
      };

      // Count orders by payment method
      ordersData.forEach((order) => {
        paymentMethods[order.payment_method] += 1;
      });

      // Calculate daily revenue
      const dailyRevenue = ordersData.reduce(
        (total, order) => total + order.total,
        0
      );

      // Get unique customers for today
      const uniqueCustomers = new Set(
        ordersData.map((order) => order.customer_id)
      );

      // Initialize hourly data
      const hourlyData = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        orders: 0,
        revenue: 0,
      }));

      // Calculate orders and revenue by hour
      ordersData.forEach((order) => {
        const orderDate = new Date(order.created_at);
        const hour = orderDate.getHours();
        hourlyData[hour].orders += 1;
        hourlyData[hour].revenue += order.total;
      });

      // Calculate best selling products
      const productSales: Record<string, { quantity: number; revenue: number; name: string }> = {};
      
      // Aggregate product sales
      ordersData.forEach(order => {
        if (Array.isArray(order.items)) {
          order.items.forEach((item: any) => {
            if (!productSales[item.productId]) {
              productSales[item.productId] = {
                quantity: 0,
                revenue: 0,
                name: item.productName
              };
            }
            productSales[item.productId].quantity += item.quantity;
            productSales[item.productId].revenue += (item.price * item.quantity);
          });
        }
      });
      
      // Convert to array and sort by quantity
      const bestSellingProducts = Object.values(productSales)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      // Compile all stats
      const dashboardStats: DashboardStats = {
        dailyRevenue,
        totalOrders: ordersData.length,
        canceledOrders: 0, // Not tracking canceled orders in this implementation
        paymentMethods,
        totalSales: dailyRevenue,
        totalCustomers: uniqueCustomers.size,
        hourlyData: hourlyData.filter((data) => data.orders > 0), // Only show hours with orders
        bestSellingProducts
      };

      setStats(dashboardStats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar estatísticas",
        description:
          "Não foi possível obter os dados do relatório de vendas.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    
    // Set up a real-time subscription for orders
    const subscription = supabase
      .channel('orders-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchDashboardStats(); // Refresh stats when there's a change
        }
      )
      .subscribe();

    // Auto-refresh stats every 5 minutes
    const intervalId = setInterval(() => {
      fetchDashboardStats();
    }, 5 * 60 * 1000);

    return () => {
      subscription.unsubscribe();
      clearInterval(intervalId);
    };
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Carregando relatório...</span>
      </div>
    );
  }

  // If no stats or no orders, show empty state
  if (!stats || stats.totalOrders === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold mb-2">
          Nenhum pedido registrado hoje
        </h3>
        <p className="text-muted-foreground">
          Não há dados de vendas para exibir para {format(today, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>
    );
  }

  // Format payment methods data for the pie chart
  const paymentMethodsData = [
    { name: "PIX", value: stats.paymentMethods.pix },
    { name: "Cartão", value: stats.paymentMethods.cartao },
    { name: "Dinheiro", value: stats.paymentMethods.dinheiro },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Relatório de {format(today, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {formatCurrency(stats.dailyRevenue)}
            </div>
            <p className="text-muted-foreground">Receita Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-muted-foreground">Pedidos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalOrders > 0 ? stats.dailyRevenue / stats.totalOrders : 0)}
            </div>
            <p className="text-muted-foreground">Valor Médio</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-muted-foreground">Clientes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Vendas por Hora
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.hourlyData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="hour"
                    tickFormatter={(hour) => `${hour}h`}
                  />
                  <YAxis
                    tickFormatter={(value) => 
                      new Intl.NumberFormat("pt-BR", {
                        notation: "compact",
                        compactDisplay: "short",
                      }).format(value)
                    }
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "revenue") {
                        return [formatCurrency(value as number), "Receita"];
                      }
                      return [value, name === "orders" ? "Pedidos" : name];
                    }}
                    labelFormatter={(hour) => `${hour}:00 - ${hour}:59`}
                  />
                  <Legend
                    payload={[
                      { value: "Pedidos", type: "rect", color: "#3b82f6" },
                      { value: "Receita", type: "rect", color: "#10b981" },
                    ]}
                  />
                  <Bar dataKey="orders" fill="#3b82f6" />
                  <Bar dataKey="revenue" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Métodos de Pagamento
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {paymentMethodsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [value, "Pedidos"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Produtos Mais Vendidos
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left font-medium py-2">Produto</th>
                    <th className="text-right font-medium py-2">Quantidade</th>
                    <th className="text-right font-medium py-2">Receita</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.bestSellingProducts.length > 0 ? (
                    stats.bestSellingProducts.map((product, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-3">{product.name}</td>
                        <td className="text-right py-3">{product.quantity}</td>
                        <td className="text-right py-3">
                          {formatCurrency(product.revenue)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-muted-foreground">
                        Nenhum produto vendido hoje
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesReport;
