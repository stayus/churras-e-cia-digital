
import React, { ReactNode, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, BarChart3, Package, FileText, ShoppingBag } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    
    if (!isAuthenticated) {
      navigate('/adm-login');
      return;
    }

    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/adm-login');
  };

  const isActive = (path: string) => location.pathname === path;

  if (isLoading || !isAuthenticated || !user || user.role !== 'admin') {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <p className="text-gray-600 text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Churrasquinho & Cia</h1>
              <p className="text-sm text-gray-600">Painel Administrativo</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="gap-2 hover:bg-gray-100 text-gray-700 border-gray-300" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8">
            <Link 
              to="/admin" 
              className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                isActive('/admin') 
                  ? 'border-red-600 text-red-600' 
                  : 'border-transparent text-gray-700 hover:text-red-600 hover:border-red-600'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Link>
            <Link 
              to="/admin/produtos" 
              className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                isActive('/admin/produtos') 
                  ? 'border-red-600 text-red-600' 
                  : 'border-transparent text-gray-700 hover:text-red-600 hover:border-red-600'
              }`}
            >
              <Package className="h-4 w-4" />
              Produtos
            </Link>
            <Link 
              to="/admin/pedidos" 
              className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                isActive('/admin/pedidos') 
                  ? 'border-red-600 text-red-600' 
                  : 'border-transparent text-gray-700 hover:text-red-600 hover:border-red-600'
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              Pedidos
            </Link>
            <Link 
              to="/admin/relatorios" 
              className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                isActive('/admin/relatorios') 
                  ? 'border-red-600 text-red-600' 
                  : 'border-transparent text-gray-700 hover:text-red-600 hover:border-red-600'
              }`}
            >
              <FileText className="h-4 w-4" />
              Relatórios
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
