
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogIn, Menu, X, ShoppingCart, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';

const HomeHeader = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full bg-black/95 backdrop-blur-sm shadow-lg z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold">
                <span className="text-yellow-400">Churrasquinho</span>
                <span className="text-red-500">&Cia</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-yellow-400 transition-colors font-medium">
              Início
            </Link>
            <Link to="/catalogo" className="text-white hover:text-yellow-400 transition-colors font-medium">
              Cardápio
            </Link>
            
            {/* Links apenas para usuários logados */}
            {isAuthenticated && (
              <>
                <Link to="/pedidos" className="text-white hover:text-yellow-400 transition-colors font-medium">
                  Pedidos
                </Link>
                <div className="relative">
                  <Link to="/carrinho" className="text-white hover:text-yellow-400 transition-colors font-medium flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Carrinho
                    {totalItems > 0 && (
                      <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {totalItems}
                      </Badge>
                    )}
                  </Link>
                </div>
              </>
            )}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/minha-conta" 
                  className="flex items-center text-white hover:text-yellow-400 transition-colors"
                >
                  <User className="h-5 w-5 mr-2" />
                  <span className="font-medium">{user?.name?.split(' ')[0]}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-white hover:text-red-400 transition-colors font-medium"
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link to="/login">
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold transition-all duration-300 hover:scale-105">
                  <LogIn className="h-4 w-4 mr-2" /> Entrar
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-yellow-400"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-white hover:text-yellow-400 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Início
              </Link>
              <Link 
                to="/catalogo" 
                className="text-white hover:text-yellow-400 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cardápio
              </Link>
              
              {/* Links apenas para usuários logados */}
              {isAuthenticated && (
                <>
                  <Link 
                    to="/pedidos" 
                    className="text-white hover:text-yellow-400 transition-colors font-medium flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Package className="h-4 w-4" />
                    Pedidos
                  </Link>
                  <Link 
                    to="/carrinho" 
                    className="text-white hover:text-yellow-400 transition-colors font-medium flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Carrinho
                    {totalItems > 0 && (
                      <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {totalItems}
                      </Badge>
                    )}
                  </Link>
                </>
              )}
              
              <div className="border-t border-gray-800 pt-4">
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-4">
                    <Link 
                      to="/minha-conta" 
                      className="flex items-center text-white hover:text-yellow-400 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5 mr-2" />
                      <span className="font-medium">{user?.name?.split(' ')[0]}</span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="text-white hover:text-red-400 transition-colors font-medium text-left"
                    >
                      Sair
                    </button>
                  </div>
                ) : (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold w-full">
                      <LogIn className="h-4 w-4 mr-2" /> Entrar
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default HomeHeader;
