
import React from 'react';
import { ChefHat, Truck, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">
            Por que nos{' '}
            <span className="bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
              Escolher?
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Mais de uma década de experiência trazendo o melhor sabor para você
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center p-8 bg-gradient-to-b from-gray-900 to-black border border-gray-800 hover:border-yellow-400/50 transition-all duration-500 transform hover:scale-105 group">
            <div className="bg-gradient-to-br from-red-600 to-red-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-red-500/50 transition-all duration-300">
              <ChefHat className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-yellow-400 transition-colors">Qualidade Premium</h3>
            <p className="text-gray-300 leading-relaxed">
              Ingredientes selecionados e preparo artesanal garantem sabor autêntico em cada prato.
            </p>
          </Card>
          
          <Card className="text-center p-8 bg-gradient-to-b from-gray-900 to-black border border-gray-800 hover:border-yellow-400/50 transition-all duration-500 transform hover:scale-105 group">
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-yellow-500/50 transition-all duration-300">
              <Truck className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-yellow-400 transition-colors">Entrega Rápida</h3>
            <p className="text-gray-300 leading-relaxed">
              Delivery expresso para sua casa. Comida quentinha e saborosa no tempo certo.
            </p>
          </Card>
          
          <Card className="text-center p-8 bg-gradient-to-b from-gray-900 to-black border border-gray-800 hover:border-yellow-400/50 transition-all duration-500 transform hover:scale-105 group">
            <div className="bg-gradient-to-br from-green-600 to-green-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-green-500/50 transition-all duration-300">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-yellow-400 transition-colors">100% Satisfação</h3>
            <p className="text-gray-300 leading-relaxed">
              Compromisso total com a sua satisfação. Sua felicidade é nossa prioridade.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
