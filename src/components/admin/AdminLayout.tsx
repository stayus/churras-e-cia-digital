
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
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Verify if the user is authenticated and is an administrator
  // Use effect to avoid redirection issues during rendering
  useEffect(() => {
    if (!isAuthenticated) {
      console.log("Redirecting to login: User not authenticated");
      navigate('/employee-login');
      return;
    }

    if (!user || user.role !== 'admin') {
      console.log("Redirecting to login: User not admin", user?.role);
      navigate('/employee-login');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // If we're still checking authentication, show nothing
  if (!isAuthenticated || !user || user.role !== 'admin') {
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
