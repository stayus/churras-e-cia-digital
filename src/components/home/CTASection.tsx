
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock, Truck } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-24 bg-red-500 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Tá com fome? 
        </h2>
        <p className="text-xl md:text-2xl text-white mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
          Faça seu pedido agora e receba em casa quentinho e saboroso!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
          <Button 
            asChild 
            size="lg" 
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-12 py-6 text-xl rounded-full transition-all duration-300 hover:scale-110 hover:rotate-1 hover:shadow-2xl transform"
          >
            <Link to="/catalogo">
              Pedir Agora
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-white">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
            <Truck className="h-6 w-6 text-yellow-400" />
            <span className="text-lg font-medium">Entrega grátis acima de R$ 30</span>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
            <Clock className="h-6 w-6 text-yellow-400" />
            <span className="text-lg font-medium">Entrega em até 45 minutos</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
