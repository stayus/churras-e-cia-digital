
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react';

const HomeFooter = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1 animate-fade-in-up">
            <div className="mb-6">
              <h3 className="text-3xl font-bold mb-4">
                <span className="text-red-500">Churrasquinho</span>
                <span className="text-yellow-400">&Cia</span>
              </h3>
              <p className="text-gray-300 leading-relaxed text-base">
                Hambúrgueres artesanais e lanches deliciosos para você. 
                Entrega rápida e atendimento de qualidade.
              </p>
            </div>
            
            {/* Social Media */}
            <div className="flex gap-4">
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-red-600 transition-colors duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-red-600 transition-colors duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-red-600 transition-colors duration-300">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Links Section */}
          <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h4 className="text-xl font-semibold mb-6 text-yellow-400">Links</h4>
            <div className="space-y-3">
              <Link 
                to="/" 
                className="block text-gray-300 hover:text-white transition-colors duration-300 text-base hover:translate-x-2 transform"
              >
                Início
              </Link>
              <Link 
                to="/catalogo" 
                className="block text-gray-300 hover:text-white transition-colors duration-300 text-base hover:translate-x-2 transform"
              >
                Cardápio
              </Link>
              <a 
                href="#sobre" 
                className="block text-gray-300 hover:text-white transition-colors duration-300 text-base hover:translate-x-2 transform"
              >
                Sobre nós
              </a>
              <a 
                href="#contato" 
                className="block text-gray-300 hover:text-white transition-colors duration-300 text-base hover:translate-x-2 transform"
              >
                Contato
              </a>
            </div>
          </div>
          
          {/* Contact Section */}
          <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <h4 className="text-xl font-semibold mb-6 text-yellow-400">Contato</h4>
            <div className="space-y-4">
              <div className="flex items-start group">
                <MapPin className="h-6 w-6 text-red-500 mr-4 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-gray-300 text-base">
                  <div>Rua dos Hambúrgueres, 123</div>
                  <div>Bairro Central</div>
                  <div>São Paulo - SP</div>
                </div>
              </div>
              
              <div className="flex items-center group">
                <Phone className="h-6 w-6 text-red-500 mr-4 group-hover:scale-110 transition-transform duration-300" />
                <a href="tel:(11)99999-9999" className="text-gray-300 hover:text-white text-base transition-colors">
                  (11) 99999-9999
                </a>
              </div>
              
              <div className="flex items-center group">
                <Mail className="h-6 w-6 text-red-500 mr-4 group-hover:scale-110 transition-transform duration-300" />
                <a href="mailto:email@churrasquinho.com" className="text-gray-300 hover:text-white text-base transition-colors">
                  email@churrasquinho.com
                </a>
              </div>
            </div>
          </div>
          
          {/* Hours Section */}
          <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <h4 className="text-xl font-semibold mb-6 text-yellow-400">Horário de Funcionamento</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-red-500 mr-3" />
                <div className="text-gray-300 text-base">
                  <div className="font-medium">Segunda e Sexta</div>
                  <div className="text-sm"> Fechado </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-red-500 mr-3" />
                <div className="text-gray-300 text-base">
                  <div className="font-medium">Terça a Quinta</div>
                  <div className="text-sm">18:30 - 22:00</div>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-red-500 mr-3" />
                <div className="text-gray-300 text-base">
                  <div className="font-medium">Sábados e Domingos</div>
                  <div className="text-sm">18:00 - 22:00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-base mb-4 md:mb-0">
              © 2025 Churrasquinho&Cia. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
