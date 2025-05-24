
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="bg-black pt-20 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Título Principal */}
        <h1 className="text-6xl md:text-8xl font-bold mb-6">
          <span className="text-yellow-400">Churrasquinho</span>
          <br />
          <span className="text-red-500">& Cia</span>
        </h1>
        
        {/* Slogan */}
        <h2 className="text-3xl md:text-4xl text-white font-bold mb-6">
          O sabor que você ama!
        </h2>
        
        {/* Subtítulo */}
        <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
          Há mais de 10 anos oferecemos produtos de alta qualidade, 
          preparados com ingredientes frescos e muito carinho. 
          Sabor autêntico que conquista.
        </p>
        
        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-4 text-lg">
            <Link to="/catalogo">Ver Cardápio</Link>
          </Button>
          <Button asChild size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-4 text-lg">
            <Link to="/catalogo">Promoções</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
