
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
      <div className="flex h-screen items-center justify-center bg-muted">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <span className="text-lg font-medium">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-white shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="logo-text text-2xl md:text-3xl">Churrasquinho & Cia</h1>
            <p className="text-sm text-muted-foreground">Painel do Funcionário</p>
          </div>
          <Button variant="outline" className="gap-2 hover:bg-muted/80" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl md:text-2xl font-bold text-brand-black">Bem-vindo, {user?.name}</h2>
          <p className="text-muted-foreground mt-1">Função: {user?.role}</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-6 overflow-x-auto flex-wrap bg-background shadow-sm border">
            {showOrdersTab && (
              <TabsTrigger value="orders" className="flex-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Alterar Status do Pedido
              </TabsTrigger>
            )}
            {showPromotionsTab && (
              <TabsTrigger value="promotions" className="flex-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Colocar Produtos em Promoção
              </TabsTrigger>
            )}
            {showStockTab && (
              <TabsTrigger value="stock" className="flex-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Alterar Status do Produto
              </TabsTrigger>
            )}
            {showExportsTab && (
              <TabsTrigger value="exports" className="flex-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Exportação de Relatório em PDF
              </TabsTrigger>
            )}
          </TabsList>

          {showOrdersTab && (
            <TabsContent value="orders" className="animate-fade-in">
              <Card className="shadow-md border-border">
                <CardHeader className="bg-muted/40 border-b">
                  <CardTitle className="text-xl md:text-2xl">Gerenciamento de Pedidos</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <OrdersList />
                </CardContent>
              </Card>
            </TabsContent>
          )}
          
          {showPromotionsTab && (
            <TabsContent value="promotions" className="animate-fade-in">
              <Card className="shadow-md border-border">
                <CardHeader className="bg-muted/40 border-b">
                  <CardTitle className="text-xl md:text-2xl">Gerenciar Promoções</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ProductsPromotions />
                </CardContent>
              </Card>
            </TabsContent>
          )}
          
          {showStockTab && (
            <TabsContent value="stock" className="animate-fade-in">
              <Card className="shadow-md border-border">
                <CardHeader className="bg-muted/40 border-b">
                  <CardTitle className="text-xl md:text-2xl">Gerenciar Estoque</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ProductsManagement />
                </CardContent>
              </Card>
            </TabsContent>
          )}
          
          {showExportsTab && (
            <TabsContent value="exports" className="animate-fade-in">
              <Card className="shadow-md border-border">
                <CardHeader className="bg-muted/40 border-b">
                  <CardTitle className="text-xl md:text-2xl">Exportação de Relatórios</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
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
