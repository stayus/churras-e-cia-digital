
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
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <p className="text-white text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-red-900">
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <Sidebar variant="inset" side="left" className="bg-gray-900/90 border-r border-gray-700">
            <SidebarContent>
              <AdminSidebar />
            </SidebarContent>
          </Sidebar>
          <SidebarInset className="overflow-y-auto bg-gradient-to-b from-gray-900 to-black">
            <div className="flex justify-between items-center p-4 bg-gray-900/90 border-b border-gray-700 backdrop-blur-sm">
              <div className="flex items-center">
                <SidebarTrigger className="text-white hover:text-yellow-400" />
                <h2 className="text-xl font-semibold ml-2 bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
                  Painel de Administração
                </h2>
              </div>
            </div>
            <div className="p-6">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AdminLayout;
