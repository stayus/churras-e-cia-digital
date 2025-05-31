import React, { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useCart } from '@/contexts/cart';
import {
  ShoppingCart,
  User,
  Package,
  Home,
  UtensilsCrossed,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CustomerLayoutProps {
  children: ReactNode;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isAuthenticated } = useAuth();
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const navItems = [
    { label: 'Início', path: '/', icon: Home },
    { label: 'Cardápio', path: '/cardapio', icon: UtensilsCrossed },
    { label: 'Pedidos', path: '/pedidos', icon: Package },
    { label: 'Carrinho', path: '/carrinho', icon: ShoppingCart, badge: totalItems },
    { label: 'Conta', path: '/minha-conta', icon: User }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-lg z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="text-xl sm:text-2xl font-bold">
                <span className="text-red-600">Churrasquinho</span>
                <span className="text-yellow-500">&Cia</span>
              </div>
            </div>

            {/* Desktop Nav - Ícones apenas */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
              {navItems.map(({ path, icon: Icon, badge }) => (
                <div key={path} className="relative">
                  <button
                    onClick={() => navigate(path)}
                    className={`text-gray-700 hover:text-red-600 transition-colors ${
                      location.pathname === path ? 'text-red-600' : ''
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {badge > 0 && path === '/carrinho' && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-4 w-4 p-0 text-[10px] flex items-center justify-center"
                      >
                        {badge}
                      </Badge>
                    )}
                  </button>
                </div>
              ))}
            </nav>

            {/* Auth Button */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated && (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-sm"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Mobile Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-red-600"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu - Ícones apenas */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 py-4 bg-white/95 backdrop-blur-md">
              <div className="flex flex-wrap justify-around gap-4">
                {navItems.map(({ path, icon: Icon, badge }) => (
                  <button
                    key={path}
                    onClick={() => {
                      navigate(path);
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-gray-700 hover:text-red-600 transition-colors relative"
                  >
                    <Icon className="h-6 w-6" />
                    {badge > 0 && path === '/carrinho' && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-2 h-4 w-4 p-0 text-[10px] flex items-center justify-center"
                      >
                        {badge}
                      </Badge>
                    )}
                  </button>
                ))}
                {isAuthenticated && (
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white mt-4"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</main>
    </div>
  );
};

export default CustomerLayout;
