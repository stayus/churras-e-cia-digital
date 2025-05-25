
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

const HomeFooter = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Coluna 1: Informações da Marca */}
          <div className="animate-fade-in">
            <div className="mb-4">
              <h3 className="text-2xl font-bold">
                <span className="text-yellow-400">Churrasquinho</span>
                <span className="text-red-500"> & Cia</span>
              </h3>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Hambúrgueres artesanais e lanches deliciosos para você. 
              Entrega rápida e atendimento de qualidade.
            </p>
          </div>
          
          {/* Coluna 2: Links */}
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h4 className="text-lg font-semibold mb-4 text-yellow-400">Links</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-300 hover:text-white transition-colors">
                Início
              </Link>
              <Link to="/catalogo" className="block text-gray-300 hover:text-white transition-colors">
                Cardápio
              </Link>
              <a href="#sobre" className="block text-gray-300 hover:text-white transition-colors">
                Sobre nós
              </a>
              <a href="#contato" className="block text-gray-300 hover:text-white transition-colors">
                Contato
              </a>
            </div>
          </div>
          
          {/* Coluna 3: Contato */}
          <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
            <h4 className="text-lg font-semibold mb-4 text-yellow-400">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                <div className="text-gray-300">
                  <div>Rua dos Hambúrgueres, 123</div>
                  <div>Bairro Central</div>
                  <div>São Paulo - SP</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-gray-300">Tel: (11) 99999-9999</span>
              </div>
              
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-gray-300">Email: email@churrasquinho.com</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Linha de Separação e Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center animate-fade-in" style={{ animationDelay: '600ms' }}>
          <p className="text-gray-400">
            © 2025 Churrasquinho & Cia. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
