
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Clock, Truck, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ContactCTA = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-red-900 via-black to-red-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              Faça seu pedido{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                agora mesmo!
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Não perca tempo! Nossos pratos estão esperando por você. 
              Sabor autêntico a um clique de distância.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button asChild size="lg" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-8 py-4">
                <Link to="/catalogo" className="flex items-center gap-3">
                  <ShoppingBag className="h-5 w-5" />
                  Pedir Agora
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold px-8 py-4">
                <Link to="/catalogo">
                  Ver Promoções
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-6 text-gray-300">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-400" />
                <span>Aberto agora</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-yellow-400" />
                <span>Entrega grátis</span>
              </div>
            </div>
          </div>
          
          <Card className="bg-gradient-to-b from-gray-900 to-black border-2 border-yellow-400/50 shadow-2xl">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold mb-6 text-center text-yellow-400">Horário de Funcionamento</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                  <span className="font-semibold text-white">Segunda e Sexta</span>
                  <span className="text-yellow-400 font-bold">Fechado</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                  <span className="font-semibold text-white">Terça a Quinta</span>
                  <span className="text-yellow-400 font-bold">18:30 - 22:00</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                  <span className="font-semibold text-white">Sábado</span>
                  <span className="text-yellow-400 font-bold">18:00 - 22:00</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                  <span className="font-semibold text-white">Domingo</span>
                  <span className="text-yellow-400 font-bold">18:00 - 22:00</span>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-700 space-y-3">
                <div className="flex items-center text-gray-300">
                  <MapPin className="h-5 w-5 text-red-500 mr-3" />
                  <span><strong className="text-white">Endereço:</strong> Rua Exemplo, 123 - Centro</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Phone className="h-5 w-5 text-red-500 mr-3" />
                  <span><strong className="text-white">Tel:</strong> (98) 98853-0154</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
