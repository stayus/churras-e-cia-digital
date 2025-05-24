
import React from 'react';
import { Link } from 'react-router-dom';

const HomeFooter = () => {
  return (
    <footer className="bg-black border-t border-red-600/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
                  Churrasquinho & Cia
                </h2>
                <p className="text-gray-400 text-sm">Tradição e sabor</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Há mais de 10 anos levando o melhor da culinária brasileira até você.
            </p>
          </div>
          
          <div className="text-center">
            <h3 className="text-white font-semibold mb-4">Links Rápidos</h3>
            <div className="flex flex-col space-y-2">
              <Link to="/catalogo" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Cardápio
              </Link>
              <Link to="/pedidos" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Meus Pedidos
              </Link>
              <Link to="/login" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Entrar
              </Link>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <h3 className="text-white font-semibold mb-4">Redes Sociais</h3>
            <div className="flex justify-center md:justify-end space-x-4">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-all duration-300 transform hover:scale-110">
                <span className="sr-only">Facebook</span>
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-all duration-300 transform hover:scale-110">
                <span className="sr-only">Instagram</span>
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.328-1.297L6.391 14.42c.687.687 1.625 1.111 2.676 1.111 2.063 0 3.735-1.672 3.735-3.735 0-2.063-1.672-3.735-3.735-3.735-1.051 0-1.989.424-2.676 1.111L4.121 7.901c.88-.807 2.031-1.297 3.328-1.297 2.734 0 4.95 2.216 4.95 4.95s-2.216 4.95-4.95 4.95z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-all duration-300 transform hover:scale-110">
                <span className="sr-only">WhatsApp</span>
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 text-center text-gray-400 text-sm border-t border-gray-800">
          &copy; 2025 Churrasquinho & Cia. Todos os direitos reservados. | Feito com ❤️ para você
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
