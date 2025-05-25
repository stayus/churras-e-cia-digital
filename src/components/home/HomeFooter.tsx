
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

const HomeFooter = () => {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {/* Coluna 1: Informações da Marca */}
          <div className="animate-fade-in">
            <div className="mb-6">
              <h3 className="text-3xl font-bold mb-4">
                <span className="text-yellow-400">Churrasquinho</span>
                <span className="text-red-500">&Cia</span>
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                Hambúrgueres artesanais e lanches deliciosos para você. 
                Entrega rápida e atendimento de qualidade.
              </p>
            </div>
          </div>
          
          {/* Coluna 2: Links */}
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h4 className="text-xl font-semibold mb-6 text-yellow-400">Links</h4>
            <div className="space-y-3">
              <Link 
                to="/" 
                className="block text-gray-300 hover:text-white transition-colors duration-300 text-lg hover:translate-x-2 transform"
              >
                Início
              </Link>
              <Link 
                to="/catalogo" 
                className="block text-gray-300 hover:text-white transition-colors duration-300 text-lg hover:translate-x-2 transform"
              >
                Cardápio
              </Link>
              <a 
                href="#sobre" 
                className="block text-gray-300 hover:text-white transition-colors duration-300 text-lg hover:translate-x-2 transform"
              >
                Sobre nós
              </a>
              <a 
                href="#contato" 
                className="block text-gray-300 hover:text-white transition-colors duration-300 text-lg hover:translate-x-2 transform"
              >
                Contato
              </a>
            </div>
          </div>
          
          {/* Coluna 3: Contato */}
          <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
            <h4 className="text-xl font-semibold mb-6 text-yellow-400">Contato</h4>
            <div className="space-y-4">
              <div className="flex items-start group">
                <MapPin className="h-6 w-6 text-red-500 mr-4 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-gray-300 text-lg">
                  <div>Rua dos Hambúrgueres, 123</div>
                  <div>Bairro Central</div>
                  <div>São Paulo - SP</div>
                </div>
              </div>
              
              <div className="flex items-center group">
                <Phone className="h-6 w-6 text-red-500 mr-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-gray-300 text-lg">Tel: (11) 99999-9999</span>
              </div>
              
              <div className="flex items-center group">
                <Mail className="h-6 w-6 text-red-500 mr-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-gray-300 text-lg">Email: email@churrasquinho.com</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Linha de Separação e Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center animate-fade-in" style={{ animationDelay: '600ms' }}>
          <p className="text-gray-400 text-lg">
            © 2025 Churrasquinho&Cia. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
