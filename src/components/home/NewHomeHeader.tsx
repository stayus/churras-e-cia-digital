import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  UtensilsCrossed,
  Package,
  ShoppingCart,
  User,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { useCart } from '@/contexts/cart';
import { Badge } from '@/components/ui/badge';

const NewHomeHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isAuthenticated } = useAuth();
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  const navItems = [
    { label: 'Início', path: '/', icon: Home },
    { label: 'Cardápio', path: '/cardapio', icon: UtensilsCrossed },
    { label: 'Pedidos', path: '/pedidos', icon: Package },
    { label: 'Carrinho', path: '/carrinho', icon: ShoppingCart, badge: totalItems },
    { label: 'Conta', path: '/minha-conta', icon: User }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="w-full bg-white/95 backdrop-blur-md shadow-md fixed top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate('/')}
        >
          <span className="text-red-600">Churrasquinho</span>
          <span className="text-yellow-500">&Cia</span>
        </div>

        {/* Navegação */}
        <nav className="flex items-center space-x-6">
          {navItems.map(({ path, label, icon: Icon, badge }) => {
            const isActive = location.pathname === path;

            return (
              <div key={path} className="relative flex items-center space-x-1">
                <button
                  onClick={() => navigate(path)}
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                    isActive ? 'text-red-600' : 'text-gray-700 hover:text-red-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
                {badge > 0 && path === '/carrinho' && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-2 text-[10px] h-4 w-4 p-0 flex items-center justify-center"
                  >
                    {badge}
                  </Badge>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default NewHomeHeader;
