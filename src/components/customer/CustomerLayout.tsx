
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, User, Home, BookOpen, Package, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { useCart } from '@/contexts/cart';
import CartSidebar from './CartSidebar';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      {/* Fixed Header */}
      <header className="fixed top-0 w-full bg-black/95 backdrop-blur-md shadow-2xl border-b border-red-600/30 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <div className="text-xl font-bold">
                  <span className="text-red-500">Churrasquinho</span>
                  <span className="text-yellow-400">&Cia</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="nav-link">
                <Home className="h-4 w-4" />
                Início
              </Link>
              <Link to="/cardapio" className="nav-link">
                <BookOpen className="h-4 w-4" />
                Cardápio
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/pedidos" className="nav-link">
                    <Package className="h-4 w-4" />
                    Pedidos
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="relative brand-button-secondary"
                    onClick={() => setIsCartOpen(true)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {totalItems > 0 && (
                      <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600">
                        {totalItems}
                      </Badge>
                    )}
                    Carrinho
                  </Button>
                  <Link to="/minha-conta" className="nav-link">
                    <User className="h-4 w-4" />
                    Conta
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout}
                    className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </Button>
                </>
              )}
              {!isAuthenticated && (
                <Link to="/login">
                  <Button size="sm" className="brand-button-primary">
                    Entrar
                  </Button>
                </Link>
              )}
            </nav>

            {/* Mobile menu button and cart */}
            <div className="flex items-center space-x-3 md:hidden">
              {isAuthenticated && (
                <Button
                  variant="outline"
                  size="sm"
                  className="relative brand-button-secondary"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {totalItems > 0 && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-yellow-400 transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-700 py-4 bg-black/95 backdrop-blur-md">
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className="nav-link-mobile"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="h-4 w-4" />
                  Início
                </Link>
                <Link 
                  to="/cardapio" 
                  className="nav-link-mobile"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <BookOpen className="h-4 w-4" />
                  Cardápio
                </Link>
                
                {isAuthenticated && (
                  <>
                    <Link 
                      to="/pedidos" 
                      className="nav-link-mobile"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Package className="h-4 w-4" />
                      Pedidos
                    </Link>
                    <Link 
                      to="/minha-conta" 
                      className="nav-link-mobile"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Conta
                    </Link>
                  </>
                )}
                
                <div className="border-t border-gray-700 pt-4">
                  {isAuthenticated ? (
                    <Button 
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </Button>
                  ) : (
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full brand-button-primary">
                        Entrar
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 flex-1">
        {children}
      </main>

      {/* Cart Sidebar */}
      {isAuthenticated && (
        <CartSidebar isOpen={isCartOpen} onOpenChange={setIsCartOpen} />
      )}
    </div>
  );
};

export default CustomerLayout;
