
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import OrdersList from "@/components/employee/OrdersList";
import SalesReport from "@/components/employee/SalesReport";
import ProductsManagement from "@/components/employee/ProductsManagement";
import ProductsPromotions from "@/components/employee/ProductsPromotions";
import OrderExports from "@/components/employee/OrderExports";
import { useNavigate } from "react-router-dom";

const EmployeePanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("orders");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Verificar se o usuário está autenticado e não é cliente
  const isEmployee = user && user.role !== 'customer';
  
  // Redirecionar se não for funcionário
  useEffect(() => {
    if (!loading && !isEmployee) {
      navigate('/login');
    }
  }, [loading, isEmployee, navigate]);

  // Determine which tabs to display based on user permissions
  const showOrdersTab = user?.permissions?.changeOrderStatus;
  const showReportsTab = user?.permissions?.viewReports;
  const showPromotionsTab = user?.permissions?.promotionProducts;
  const showStockTab = user?.permissions?.manageStock;
  const showExportsTab = user?.permissions?.exportOrderReportPDF;

  // Default to the first available tab
  useEffect(() => {
    if (!loading) {
      if (showOrdersTab) setActiveTab("orders");
      else if (showReportsTab) setActiveTab("reports");
      else if (showPromotionsTab) setActiveTab("promotions");
      else if (showStockTab) setActiveTab("stock");
      else if (showExportsTab) setActiveTab("exports");
    }
  }, [loading, showOrdersTab, showReportsTab, showPromotionsTab, showStockTab, showExportsTab]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando...</span>
      </div>
    );
  }

  // Se não for funcionário, não renderize nada (o redirecionamento já foi tratado acima)
  if (!isEmployee) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">Bem-vindo, {user?.name}</h1>
        <p className="text-muted-foreground">Painel do Funcionário</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-6 overflow-x-auto flex-wrap">
          {showOrdersTab && (
            <TabsTrigger value="orders" className="flex-1">
              Gerenciar Pedidos
            </TabsTrigger>
          )}
          {showReportsTab && (
            <TabsTrigger value="reports" className="flex-1">
              Relatório de Vendas
            </TabsTrigger>
          )}
          {showPromotionsTab && (
            <TabsTrigger value="promotions" className="flex-1">
              Gerenciar Promoções
            </TabsTrigger>
          )}
          {showStockTab && (
            <TabsTrigger value="stock" className="flex-1">
              Gerenciar Estoque
            </TabsTrigger>
          )}
          {showExportsTab && (
            <TabsTrigger value="exports" className="flex-1">
              Exportar Relatórios
            </TabsTrigger>
          )}
        </TabsList>

        {showOrdersTab && (
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                <OrdersList />
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        {showReportsTab && (
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Relatório de Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <SalesReport />
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        {showPromotionsTab && (
          <TabsContent value="promotions">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Promoções</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductsPromotions />
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        {showStockTab && (
          <TabsContent value="stock">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Estoque</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductsManagement />
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        {showExportsTab && (
          <TabsContent value="exports">
            <Card>
              <CardHeader>
                <CardTitle>Exportação de Relatórios</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderExports />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default EmployeePanel;
