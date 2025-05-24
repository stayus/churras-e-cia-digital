
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Clock, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      {/* Background com múltiplas camadas */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=1920&h=1080&fit=crop')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-red-900/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black" />
      </div>

      {/* Content principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <Badge className="mb-6 bg-red-600/20 text-red-400 border-red-500 px-4 py-2 text-sm font-semibold">
            🔥 Agora com delivery grátis
          </Badge>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
            <span className="text-white drop-shadow-2xl">Sabor</span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-red-600 bg-clip-text text-transparent">
              Autêntico
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-gray-200 leading-relaxed">
            Há mais de 10 anos trazendo o melhor da culinária brasileira para sua mesa.
            <br />
            <span className="text-yellow-400 font-semibold">Tradição, qualidade e sabor em cada mordida.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button size="lg" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-10 py-4 text-lg shadow-2xl transform hover:scale-105 transition-all duration-300">
              <Link to="/catalogo" className="flex items-center gap-3">
                <ShoppingBag className="h-6 w-6" />
                Fazer Pedido Agora
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold px-10 py-4 text-lg bg-black/30 backdrop-blur-sm">
              <Link to="/catalogo" className="flex items-center gap-3">
                Ver Promoções
              </Link>
            </Button>
          </div>

          {/* Stats rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">10+</div>
              <div className="text-gray-300">Anos de Tradição</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">5000+</div>
              <div className="text-gray-300">Clientes Satisfeitos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">30min</div>
              <div className="text-gray-300">Entrega Rápida</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
