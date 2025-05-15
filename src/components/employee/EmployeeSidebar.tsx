
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from '@/components/ui/sidebar';
import {
  List, 
  Percent,
  Package,
  FileExport,
  LogOut
} from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const EmployeeSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  // Determinar quais menus mostrar com base nas permissões
  const showOrdersMenu = user?.permissions?.changeOrderStatus;
  const showPromotionsMenu = user?.permissions?.promotionProducts;
  const showStockMenu = user?.permissions?.manageStock;
  const showExportsMenu = user?.permissions?.exportOrderReportPDF;

  // Filtrar itens de menu com base nas permissões
  const menuItems = [
    {
      name: 'Pedidos',
      path: '/employee',
      icon: List,
      show: showOrdersMenu
    },
    {
      name: 'Promoções',
      path: '/employee/promotions',
      icon: Percent,
      show: showPromotionsMenu
    },
    {
      name: 'Estoque',
      path: '/employee/stock',
      icon: Package,
      show: showStockMenu
    },
    {
      name: 'Exportações',
      path: '/employee/exports',
      icon: FileExport,
      show: showExportsMenu
    }
  ].filter(item => item.show);

  const handleLogout = () => {
    logout();
    navigate('/employee-login');
  };

  return (
    <>
      <SidebarHeader className="bg-primary/5 border-b">
        <div className="p-4">
          <h1 className="logo-text">Churrasquinho & Cia</h1>
          <p className="text-xs text-muted-foreground mt-1">Painel do Funcionário</p>
        </div>
      </SidebarHeader>

      <SidebarGroup>
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton 
                isActive={location.pathname === item.path}
                tooltip={item.name}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>

      <SidebarFooter className="mt-auto p-4">
        <Separator className="my-2" />
        <Button variant="outline" className="w-full gap-2 justify-start" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </Button>
      </SidebarFooter>
    </>
  );
};

export default EmployeeSidebar;
