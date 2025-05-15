
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
import EmployeeSidebar from '@/components/employee/EmployeeSidebar';

interface EmployeeLayoutProps {
  children: ReactNode;
}

const EmployeeLayout: React.FC<EmployeeLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Verifica se o usuário está autenticado e não é um cliente
  // Qualquer usuário que não seja 'customer' é considerado funcionário
  const isEmployee = user && user.role !== 'customer';

  // Redireciona se não for funcionário
  if (!isEmployee) {
    navigate('/login');
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-100">
        <Sidebar variant="inset" side="left">
          <SidebarContent>
            <EmployeeSidebar />
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="overflow-y-auto">
          <div className="flex justify-between items-center p-4 bg-white border-b">
            <div className="flex items-center">
              <SidebarTrigger />
              <h2 className="text-xl font-semibold ml-2 text-brand-red">Painel do Funcionário</h2>
            </div>
          </div>
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default EmployeeLayout;
