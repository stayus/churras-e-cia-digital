
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, ShoppingCart, Package, LogOut, LogIn, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';

const NewHomeHeader = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-lg z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-2">
            <div className="text-xl sm:text-2xl font-bold">
              <span className="text-red-600">Churrasquinho</span>
              <span className="text-yellow-500">&Cia</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link to="/home" className="text-gray-700 hover:text-red-600 transition-colors font-medium text-sm lg:text-base">
              Início
            </Link>
            <Link to="/cardapio" className="text-gray-700 hover:text-red-600 transition-colors font-medium text-sm lg:text-base">
              Cardápio
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/pedidos" className="text-gray-700 hover:text-red-600 transition-colors font-medium text-sm lg:text-base">
                  Pedidos
                </Link>
                <div className="relative">
                  <Link to="/carrinho" className="text-gray-700 hover:text-red-600 transition-colors font-medium flex items-center gap-2 text-sm lg:text-base">
                    <ShoppingCart className="h-4 w-4" />
                    Carrinho
                    {totalItems > 0 && (
                      <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {totalItems}
                      </Badge>
                    )}
                  </Link>
                </div>
                <Link to="/minha-conta" className="text-gray-700 hover:text-red-600 transition-colors font-medium text-sm lg:text-base">
                  Conta
                </Link>
              </>
            ) : null}
          </nav>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <Button 
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all text-sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            ) : (
              <Link to="/login">
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  Entrar
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
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
              <Link 
                to="/home" 
                className="text-gray-700 hover:text-red-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Início
              </Link>
              <Link 
                to="/catalogo" 
                className="text-gray-700 hover:text-red-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cardápio
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link 
                    to="/pedidos" 
                    className="text-gray-700 hover:text-red-600 transition-colors font-medium flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Package className="h-4 w-4" />
                    Pedidos
                  </Link>
                  <Link 
                    to="/carrinho" 
                    className="text-gray-700 hover:text-red-600 transition-colors font-medium flex items-center gap-2"
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
                  <Link 
                    to="/minha-conta" 
                    className="text-gray-700 hover:text-red-600 transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Conta
                  </Link>
                </>
              )}
              
              <div className="border-t border-gray-100 pt-4">
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
                    <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold w-full">
                      <LogIn className="h-4 w-4 mr-2" />
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
  );
};

export default NewHomeHeader;
