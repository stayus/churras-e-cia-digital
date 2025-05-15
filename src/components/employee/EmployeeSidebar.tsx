
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  ChevronRight,
  ShoppingCart,
  FileBarChart,
  Package,
  Settings,
  LogOut
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const EmployeeSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  // Determinar quais menus mostrar com base nas permissões
  const showOrdersMenu = user?.permissions?.changeOrderStatus;
  const showReportsMenu = user?.permissions?.viewReports;
  const showPromotionsMenu = user?.permissions?.promotionProducts;
  const showStockMenu = user?.permissions?.manageStock;
  const showExportsMenu = user?.permissions?.exportOrderReportPDF;

  // Filtrar itens de menu com base nas permissões
  const menuItems = [
    {
      name: 'Pedidos',
      path: '/employee',
      icon: ShoppingCart,
      show: showOrdersMenu
    },
    {
      name: 'Relatórios',
      path: '/employee/reports',
      icon: FileBarChart,
      show: showReportsMenu
    },
    {
      name: 'Promoções',
      path: '/employee/promotions',
      icon: Package,
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
      icon: FileBarChart,
      show: showExportsMenu
    }
  ].filter(item => item.show);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 h-screen bg-white border-r flex flex-col">
      <div className="p-4">
        <h1 className="logo-text">Churrasquinho & Cia</h1>
        <p className="text-xs text-muted-foreground mt-1">Painel do Funcionário</p>
      </div>

      <Separator />

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 font-normal",
                  location.pathname === item.path && "bg-muted font-medium"
                )}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
                {location.pathname === item.path && (
                  <ChevronRight className="h-4 w-4 ml-auto" />
                )}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4">
        <Separator className="my-4" />
        <Button variant="outline" className="w-full gap-2 justify-start" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </Button>
      </div>
    </aside>
  );
};

export default EmployeeSidebar;
