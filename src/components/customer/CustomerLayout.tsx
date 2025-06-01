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

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {navItems.map(({ label, path, icon: Icon, badge }) => (
                <div key={path} className="relative">
                  <button
                    onClick={() => navigate(path)}
                    className={`text-gray-700 hover:text-red-600 transition-colors font-medium text-sm lg:text-base flex items-center gap-1 ${
                      location.pathname === path ? 'text-red-600' : ''
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                    {badge > 0 && path === '/carrinho' && (
                      <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {badge}
                      </Badge>
                    )}
                  </button>
                </div>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated && (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-sm"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
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

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 py-4 bg-white/95 backdrop-blur-md">
              <div className="flex flex-col space-y-4">
                {navItems.map(({ label, path, icon: Icon, badge }) => (
                  <button
                    key={path}
                    onClick={() => {
                      navigate(path);
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left text-gray-700 hover:text-red-600 transition-colors font-medium flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                    {badge > 0 && path === '/carrinho' && (
                      <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {badge}
                      </Badge>
                    )}
                  </button>
                ))}

                {isAuthenticated && (
                  <div className="border-t border-gray-100 pt-4">
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </Button>
                  </div>
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
