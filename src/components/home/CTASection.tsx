
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock, Truck } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-24 bg-red-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Tá com fome? 
        </h2>
        <p className="text-2xl text-white mb-8 opacity-90 max-w-2xl mx-auto">
          Faça seu pedido agora e receba em casa quentinho e saboroso!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button asChild size="lg" className="bg-white hover:bg-gray-100 text-red-500 font-bold px-12 py-6 text-xl rounded-full">
            <Link to="/catalogo">
              Ver Cardápio Completo
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-white">
          <div className="flex items-center gap-2">
            <Truck className="h-6 w-6" />
            <span className="text-lg font-medium">Entrega grátis acima de R$ 30</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6" />
            <span className="text-lg font-medium">Entrega em até 45 minutos</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
