
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
  LayoutDashboard,
  Package,
  Users,
  FileBarChart,
  Settings,
  ShoppingCart,
  LogOut
} from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard
    },
    {
      name: 'Produtos',
      path: '/admin/produtos',
      icon: Package
    },
    {
      name: 'Funcionários',
      path: '/admin/funcionarios',
      icon: Users
    },
    {
      name: 'Relatórios',
      path: '/admin/relatorios',
      icon: FileBarChart
    },
    {
      name: 'Pedidos',
      path: '/admin/pedidos',
      icon: ShoppingCart
    },
    {
      name: 'Configurações',
      path: '/admin/configuracoes',
      icon: Settings
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/employee-login');
  };

  return (
    <>
      <SidebarHeader className="bg-primary/5 border-b">
        <div className="p-4">
          <h1 className="logo-text">Churrasquinho & Cia</h1>
          <p className="text-xs text-muted-foreground mt-1">Painel de Administração</p>
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

export default AdminSidebar;
