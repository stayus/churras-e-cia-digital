
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingBag, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomeHeader = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="fixed top-0 w-full bg-black/95 backdrop-blur-md shadow-xl border-b border-red-600/30 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
                  Churrasquinho & Cia
                </h1>
                <p className="text-xs text-gray-400">O melhor da região</p>
              </div>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-yellow-400 transition-all duration-300 font-medium relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/catalogo" className="text-white hover:text-yellow-400 transition-all duration-300 font-medium relative group">
              Cardápio
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            {isAuthenticated && user?.role === 'customer' && (
              <Link to="/pedidos" className="text-white hover:text-yellow-400 transition-all duration-300 font-medium relative group">
                Meus Pedidos
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Link 
                to={
                  user?.role === 'admin' ? '/admin' : 
                  user?.role === 'employee' ? '/employee' : 
                  user?.role === 'motoboy' ? '/motoboy' : 
                  '/catalogo'
                } 
                className="flex items-center text-white hover:text-yellow-400 transition-all duration-300"
              >
                <User className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline font-medium">{user?.name?.split(' ')[0]}</span>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="sm" className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold border-0 shadow-lg">
                  <LogIn className="h-4 w-4 mr-2" /> Entrar
                </Button>
              </Link>
            )}
            <Link to="/carrinho" className="relative text-white hover:text-yellow-400 transition-all duration-300">
              <ShoppingBag className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 h-5 w-5 text-xs flex items-center justify-center bg-red-600 text-white rounded-full font-bold">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
