
import React, { ReactNode } from 'react';
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
    <div className="h-screen w-full bg-gray-100">
      {children}
    </div>
  );
};

export default EmployeeLayout;
