
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  ChevronRight,
  LayoutDashboard,
  Package,
  Users,
  FileBarChart,
  Settings,
  ShoppingCart,
  LogOut
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

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
    navigate('/login');
  };

  return (
    <aside className="w-64 h-screen bg-white border-r flex flex-col">
      <div className="p-4">
        <h1 className="logo-text">Churrasquinho & Cia</h1>
        <p className="text-xs text-muted-foreground mt-1">Painel de administração</p>
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

export default AdminSidebar;
