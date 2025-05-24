
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, User, Home, BookOpen, Package, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import CartSidebar from './CartSidebar';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-red-900">
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-sm shadow-lg border-b border-red-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
                  Churrasquinho & Cia
                </span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-white hover:text-yellow-400 hover:bg-gray-800 flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Início
                </Button>
              </Link>
              <Link to="/catalogo">
                <Button variant="ghost" size="sm" className="text-white hover:text-yellow-400 hover:bg-gray-800 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Cardápio
                </Button>
              </Link>
              <Link to="/pedidos">
                <Button variant="ghost" size="sm" className="text-white hover:text-yellow-400 hover:bg-gray-800 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Pedidos
                </Button>
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              {/* Cart Button */}
              <Button
                variant="outline"
                size="sm"
                className="relative flex items-center gap-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600">
                    {totalItems}
                  </Badge>
                )}
                <span className="hidden sm:inline">Carrinho</span>
              </Button>

              {/* User Menu */}
              <div className="flex items-center space-x-2">
                <Link to="/minha-conta">
                  <Button variant="ghost" size="sm" className="text-white hover:text-yellow-400 hover:bg-gray-800 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user?.name?.split(' ')[0] || 'Conta'}</span>
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onOpenChange={setIsCartOpen} />
    </div>
  );
};

export default CustomerLayout;
