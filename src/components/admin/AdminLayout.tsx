
import React, { ReactNode, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
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
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  console.log("AdminLayout - Auth state:", { 
    isAuthenticated, 
    isLoading, 
    userRole: user?.role
  });

  // Verify if the user is authenticated and is an administrator
  useEffect(() => {
    if (isLoading) {
      return; // Wait until loading is complete
    }
    
    if (!isAuthenticated) {
      console.log("AdminLayout - Redirecting to employee login: User not authenticated");
      navigate('/employee-login');
      return;
    }

    if (!user || user.role !== 'admin') {
      console.log("AdminLayout - Redirecting to employee login: User not admin", user?.role);
      navigate('/employee-login');
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  // If we're still checking authentication or user doesn't have admin role, show loading
  if (isLoading || !isAuthenticated || !user || user.role !== 'admin') {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
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
