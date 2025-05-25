
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock, Truck, Phone, MapPin } from 'lucide-react';

const NewCTASection = () => {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-red-600 via-red-700 to-red-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
          Fome Chegou? 
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl text-white mb-6 sm:mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
          Não perca tempo! Faça seu pedido agora e receba em casa quentinho, saboroso e no tempo certo.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-12">
          <Button 
            asChild 
            size="lg" 
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl rounded-full transition-all duration-300 hover:scale-110 hover:rotate-1 hover:shadow-2xl transform shadow-lg"
          >
            <Link to="/catalogo">
              🍔 Pedir Agora
            </Link>
          </Button>
          
          <Button 
            asChild 
            variant="outline"
            size="lg" 
            className="border-2 border-white text-white hover:bg-white hover:text-red-600 font-bold px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
          >
            <Link to="tel:(11)99999-9999">
              <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Ligar Agora
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-white">
          <div className="flex flex-col items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-3 sm:px-6 py-3 sm:py-4">
            <Truck className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" />
            <div className="text-center">
              <span className="text-sm sm:text-lg font-bold block">Entrega Grátis</span>
              <span className="text-xs sm:text-sm opacity-80">Acima de R$ 35</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-3 sm:px-6 py-3 sm:py-4">
            <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" />
            <div className="text-center">
              <span className="text-sm sm:text-lg font-bold block">Entrega Rápida</span>
              <span className="text-xs sm:text-sm opacity-80">Em até 40 min</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-3 sm:px-6 py-3 sm:py-4">
            <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" />
            <div className="text-center">
              <span className="text-sm sm:text-lg font-bold block">Cobertura Total</span>
              <span className="text-xs sm:text-sm opacity-80">Toda a cidade</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-3 sm:px-6 py-3 sm:py-4">
            <div className="text-xl sm:text-2xl">💳</div>
            <div className="text-center">
              <span className="text-sm sm:text-lg font-bold block">Pague Online</span>
              <span className="text-xs sm:text-sm opacity-80">Cartão ou PIX</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewCTASection;
