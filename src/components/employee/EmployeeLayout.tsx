
import React, { ReactNode } from 'react';
import EmployeeSidebar from '@/components/employee/EmployeeSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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
    <div className="flex h-screen bg-gray-100">
      <EmployeeSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default EmployeeLayout;
