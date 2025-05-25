
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="bg-black pt-20 py-20 min-h-screen flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo de texto */}
          <div className="text-center lg:text-left animate-scroll-reveal">
            {/* Slogan principal */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-yellow-400">O Sabor que</span>
              <br />
              <span className="text-red-500">Você Ama!</span>
            </h1>
            
            {/* Palavras menores chamativas */}
            <p className="text-lg md:text-xl text-white mb-8 max-w-2xl leading-relaxed opacity-90">
              Experimente nossos <span className="text-yellow-400 font-semibold">churrasquinhos artesanais</span> e 
              <span className="text-red-400 font-semibold"> hambúrgueres deliciosos</span>. 
              Feitos com ingredientes frescos e muito carinho, entregues quentinhos na sua casa!
            </p>
            
            {/* Destaques menores */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8 text-sm md:text-base">
              <div className="bg-red-600/20 text-red-300 px-4 py-2 rounded-full border border-red-500/30">
                🔥 Grelhados na hora
              </div>
              <div className="bg-yellow-600/20 text-yellow-300 px-4 py-2 rounded-full border border-yellow-500/30">
                ⚡ Entrega rápida
              </div>
              <div className="bg-green-600/20 text-green-300 px-4 py-2 rounded-full border border-green-500/30">
                🏆 Qualidade premium
              </div>
            </div>
            
            {/* Botão de ação */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                asChild 
                size="lg" 
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <Link to="/catalogo">Ver Cardápio Completo</Link>
              </Button>
            </div>
          </div>
          
          {/* Imagem chamativa */}
          <div className="hidden lg:block animate-scroll-reveal" style={{ animationDelay: '300ms' }}>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&h=500&fit=crop&crop=center" 
                alt="Churrasquinho delicioso grelhado na perfeição" 
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-red-600/30 to-yellow-400/20 rounded-2xl"></div>
              
              {/* Overlay com destaque */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-4">
                <p className="text-white font-semibold text-lg">
                  🥩 Carne selecionada, tempero especial!
                </p>
                <p className="text-gray-300 text-sm">
                  Grelhado no ponto certo para você
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
