
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Facebook, Instagram } from 'lucide-react';

const HomeFooter = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Coluna 1: Informações da Marca */}
          <div>
            <div className="mb-4">
              <h3 className="text-2xl font-bold">
                <span className="text-yellow-400">Churrasquinho</span>
                <span className="text-red-500"> & Cia</span>
              </h3>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Há mais de 10 anos levando o melhor da culinária brasileira até você. 
              Tradição, qualidade e sabor em cada mordida.
            </p>
            
            {/* Redes Sociais */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          {/* Coluna 2: Links Úteis */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-yellow-400">Links Úteis</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-300 hover:text-white transition-colors">
                Início
              </Link>
              <Link to="/catalogo" className="block text-gray-300 hover:text-white transition-colors">
                Cardápio
              </Link>
              <Link to="/pedidos" className="block text-gray-300 hover:text-white transition-colors">
                Meus Pedidos
              </Link>
              <Link to="/login" className="block text-gray-300 hover:text-white transition-colors">
                Entrar
              </Link>
            </div>
          </div>
          
          {/* Coluna 3: Contato */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-yellow-400">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300">
                  Rua dos Sabores, 123<br />
                  Centro - Cidade, SP<br />
                  CEP: 12345-678
                </span>
              </div>
              
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-gray-300">(11) 99999-9999</span>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-red-500 mr-3 mt-1" />
                <div className="text-gray-300">
                  <div>Seg-Sex: 17h às 23h</div>
                  <div>Sáb: 17h às 00h</div>
                  <div>Dom: 17h às 22h</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Linha de Separação e Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            &copy; 2025 Churrasquinho & Cia. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
