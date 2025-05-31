
import React, { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { ShoppingCart, User, Package, Home, UtensilsCrossed, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart';

interface CustomerLayoutProps {
  children: ReactNode;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { getTotalItems } = useCart();

  const totalItems = getTotalItems();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { 
      label: 'Início', 
      path: '/', 
      icon: Home 
    },
    { 
      label: 'Cardápio', 
      path: '/cardapio', 
      icon: UtensilsCrossed 
    },
    { 
      label: 'Pedidos', 
      path: '/pedidos', 
      icon: Package 
    },
    { 
      label: 'Carrinho', 
      path: '/carrinho', 
      icon: ShoppingCart,
      badge: totalItems > 0 ? totalItems : undefined
    },
    { 
      label: 'Conta', 
      path: '/minha-conta', 
      icon: User 
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold">
                <span className="text-red-600">Churrasquinho</span>
                <span className="text-yellow-500">&Cia</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    onClick={() => navigate(item.path)}
                    className={`relative ${
                      isActive 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                    {item.badge && (
                      <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </Button>
                );
              })}
              
              {isAuthenticated && (
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="ml-4 text-gray-700 border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => {/* Mobile menu logic */}}
            >
              <span className="sr-only">Menu</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="grid grid-cols-3 gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    onClick={() => navigate(item.path)}
                    className={`relative flex flex-col h-auto py-3 ${
                      isActive 
                        ? 'bg-red-600 text-white' 
                        : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-xs">{item.label}</span>
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
            
            {isAuthenticated && (
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full mt-3 text-gray-700 border-gray-300 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 md:pt-24">
        {children}
      </main>
    </div>
  );
};

export default CustomerLayout;
