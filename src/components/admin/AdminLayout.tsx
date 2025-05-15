
import React, { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarInset
} from '@/components/ui/sidebar';
import AdminSidebar from '@/components/AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Verifica se o usuário está autenticado e é um administrador
  const isAdmin = user && user.role === 'admin';

  // Redireciona se não for administrador
  if (!isAdmin) {
    navigate('/login');
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-100">
        <Sidebar variant="inset" side="left">
          <SidebarContent>
            <AdminSidebar />
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="overflow-y-auto">
          <div className="flex justify-between items-center p-4 bg-white border-b">
            <div className="flex items-center">
              <SidebarTrigger />
              <h2 className="text-xl font-semibold ml-2 text-brand-red">Painel de Administração</h2>
            </div>
          </div>
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
