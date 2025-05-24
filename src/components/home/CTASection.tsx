
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  return (
    <section className="py-20 bg-red-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Está com fome? 
        </h2>
        <p className="text-xl text-white mb-8 opacity-90">
          Faça seu pedido agora e receba em casa quentinho e saboroso!
        </p>
        
        <Button asChild size="lg" className="bg-white hover:bg-gray-100 text-red-500 font-bold px-10 py-4 text-xl">
          <Link to="/catalogo">
            Pedir Agora
          </Link>
        </Button>
        
        <p className="text-white mt-4 opacity-75">
          🚚 Entrega grátis acima de R$ 30,00
        </p>
      </div>
    </section>
  );
};

export default CTASection;
