
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock, Star, Truck } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-black via-gray-900 to-black pt-20 py-20 min-h-screen flex items-center overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo de texto */}
          <div className="text-center lg:text-left animate-fade-in-up">
            {/* Slogan principal */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-yellow-400">Sabor que</span>
              <br />
              <span className="text-red-500">Conquistou</span>
              <br />
              <span className="text-white">a Cidade!</span>
            </h1>
            
            {/* Descrição */}
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              Experimente nossos <span className="text-yellow-400 font-semibold">churrasquinhos artesanais</span> e 
              <span className="text-red-400 font-semibold"> hambúrgueres gourmet</span>. 
              Feitos com ingredientes premium e entregues quentinhos na sua porta!
            </p>
            
            {/* Destaques */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8 text-sm md:text-base">
              <div className="bg-red-600/20 text-red-300 px-4 py-2 rounded-full border border-red-500/30 flex items-center gap-2">
                <Star className="h-4 w-4" />
                Qualidade Premium
              </div>
              <div className="bg-yellow-600/20 text-yellow-300 px-4 py-2 rounded-full border border-yellow-500/30 flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Entrega Rápida
              </div>
              <div className="bg-green-600/20 text-green-300 px-4 py-2 rounded-full border border-green-500/30 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Sempre Fresquinho
              </div>
            </div>
            
            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                asChild 
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-full"
              >
                <Link to="/catalogo">
                  Ver Cardápio
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline"
                size="lg" 
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold px-8 py-4 text-lg transition-all duration-300 hover:scale-105 rounded-full"
              >
                <Link to="/catalogo?categoria=promocoes">
                  Promoções
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Imagem */}
          <div className="hidden lg:block animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&h=500&fit=crop&crop=center" 
                alt="Churrasquinho delicioso grelhado na perfeição" 
                className="w-full h-96 lg:h-[500px] object-cover rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-700"
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-red-600/30 to-yellow-400/20 rounded-3xl"></div>
              
              {/* Floating card */}
              <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-white font-semibold">4.9/5</span>
                </div>
                <p className="text-white font-semibold text-lg">
                  🔥 Mais de 10.000 clientes satisfeitos!
                </p>
                <p className="text-gray-300 text-sm">
                  Grelhado no ponto certo, temperado com amor
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
