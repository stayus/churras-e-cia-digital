
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="bg-black pt-20 py-20 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo de texto */}
          <div className="text-center lg:text-left animate-fade-in">
            {/* Slogan principal */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-yellow-400">Churrasquinho</span>
              <br />
              <span className="text-red-500">& Cia</span>
            </h1>
            
            {/* Slogan secundário */}
            <h2 className="text-3xl md:text-4xl text-white font-bold mb-6">
              O sabor que você ama!
            </h2>
            
            {/* Subtítulo */}
            <p className="text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
              Hambúrgueres artesanais e lanches deliciosos feitos com ingredientes frescos e muito carinho. 
              Entrega rápida e atendimento de qualidade que conquistam você.
            </p>
            
            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-4 text-lg transition-all duration-300 hover:scale-105">
                <Link to="/catalogo">Ver Cardápio</Link>
              </Button>
              <Button asChild size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-4 text-lg transition-all duration-300 hover:scale-105">
                <Link to="/catalogo">Promoções</Link>
              </Button>
            </div>
          </div>
          
          {/* Imagem chamativa */}
          <div className="hidden lg:block animate-scale-in">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&h=400&fit=crop&crop=center" 
                alt="Churrasquinho delicioso" 
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-red-500/20 to-yellow-400/20 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
