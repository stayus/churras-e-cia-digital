
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomeHeader = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="fixed top-0 w-full bg-black shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold">
                <span className="text-yellow-400">Churrasquinho</span>
                <span className="text-red-500"> & Cia</span>
              </div>
            </Link>
          </div>
          
          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-yellow-400 transition-colors font-medium">
              Início
            </Link>
            <Link to="/catalogo" className="text-white hover:text-yellow-400 transition-colors font-medium">
              Cardápio
            </Link>
            <a href="#sobre" className="text-white hover:text-yellow-400 transition-colors font-medium">
              Sobre nós
            </a>
            <a href="#contato" className="text-white hover:text-yellow-400 transition-colors font-medium">
              Contato
            </a>
            
            {/* Mostrar links adicionais apenas se estiver logado */}
            {isAuthenticated && (
              <>
                <Link to="/pedidos" className="text-white hover:text-yellow-400 transition-colors font-medium">
                  Pedidos
                </Link>
                <Link to="/carrinho" className="text-white hover:text-yellow-400 transition-colors font-medium">
                  Carrinho
                </Link>
              </>
            )}
          </nav>

          {/* Ações de Login */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to={
                    user?.role === 'admin' ? '/admin' : 
                    user?.role === 'employee' ? '/employee' : 
                    user?.role === 'motoboy' ? '/motoboy' : 
                    '/catalogo'
                  } 
                  className="flex items-center text-white hover:text-yellow-400 transition-colors"
                >
                  <User className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline font-medium">{user?.name?.split(' ')[0]}</span>
                </Link>
                <button 
                  onClick={() => {/* implementar logout */}}
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
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
