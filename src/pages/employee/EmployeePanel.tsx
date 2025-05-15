
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, LogOut } from "lucide-react";
import OrdersList from "@/components/employee/OrdersList";
import ProductsManagement from "@/components/employee/ProductsManagement";
import ProductsPromotions from "@/components/employee/ProductsPromotions";
import OrderExports from "@/components/employee/OrderExports";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const EmployeePanel = () => {
  const { user, logout } = useAuth();
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

  // Determine which tabs to display based on user permissions
  const showOrdersTab = user?.permissions?.changeOrderStatus;
  const showPromotionsTab = user?.permissions?.promotionProducts;
  const showStockTab = user?.permissions?.manageStock;
  const showExportsTab = user?.permissions?.exportOrderReportPDF;

  const handleLogout = () => {
    logout();
    navigate('/employee-login');
  };

  // Default to the first available tab
  useEffect(() => {
    if (!loading) {
      if (showOrdersTab) setActiveTab("orders");
      else if (showPromotionsTab) setActiveTab("promotions");
      else if (showStockTab) setActiveTab("stock");
      else if (showExportsTab) setActiveTab("exports");
    }
  }, [loading, showOrdersTab, showPromotionsTab, showStockTab, showExportsTab]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-brand-black">Churrasquinho & Cia</h1>
            <p className="text-sm text-muted-foreground">Painel do Funcionário</p>
          </div>
          <Button variant="outline" className="gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-brand-black">Bem-vindo, {user?.name}</h2>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-6 overflow-x-auto flex-wrap">
            {showOrdersTab && (
              <TabsTrigger value="orders" className="flex-1">
                Alterar Status do Pedido
              </TabsTrigger>
            )}
            {showPromotionsTab && (
              <TabsTrigger value="promotions" className="flex-1">
                Colocar Produtos em Promoção
              </TabsTrigger>
            )}
            {showStockTab && (
              <TabsTrigger value="stock" className="flex-1">
                Alterar Status do Produto
              </TabsTrigger>
            )}
            {showExportsTab && (
              <TabsTrigger value="exports" className="flex-1">
                Exportação de Relatório em PDF
              </TabsTrigger>
            )}
          </TabsList>

          {showOrdersTab && (
            <TabsContent value="orders">
              <Card>
                <CardHeader className="bg-muted/40">
                  <CardTitle>Gerenciamento de Pedidos</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <OrdersList />
                </CardContent>
              </Card>
            </TabsContent>
          )}
          
          {showPromotionsTab && (
            <TabsContent value="promotions">
              <Card>
                <CardHeader className="bg-muted/40">
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
                <CardHeader className="bg-muted/40">
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
                <CardHeader className="bg-muted/40">
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
    </div>
  );
};

export default EmployeePanel;
