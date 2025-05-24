
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PromotionsSection = () => {
  const promotions = [
    {
      id: 1,
      name: "Combo Especial",
      description: "2 Churrasquinhos + Refrigerante + Batata Frita",
      image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop",
      price: "R$ 24,90",
      originalPrice: "R$ 32,90"
    },
    {
      id: 2,
      name: "Hambúrguer Artesanal",
      description: "Hambúrguer 200g + Batata + Bebida",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      price: "R$ 19,90",
      originalPrice: "R$ 26,90"
    },
    {
      id: 3,
      name: "Espetinho Duplo",
      description: "2 Espetinhos de carne + Farofa + Vinagrete",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
      price: "R$ 16,50",
      originalPrice: "R$ 21,00"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-red-500 text-white text-lg px-4 py-2">
            🔥 PROMOÇÕES
          </Badge>
          <h2 className="text-4xl font-bold text-black mb-4">
            Ofertas Imperdíveis
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Aproveite nossas promoções especiais e economize nos seus pratos favoritos
          </p>
        </div>
        
        <div className="grid md:grid-cols-1 gap-8 max-w-4xl mx-auto">
          {promotions.map((promo) => (
            <Card key={promo.id} className="flex flex-col md:flex-row overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white">
              <div className="relative md:w-80">
                <img 
                  src={promo.image} 
                  alt={promo.name}
                  className="w-full h-48 md:h-full object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-red-500 text-white font-bold text-sm px-3 py-1">
                  PROMOÇÃO
                </Badge>
              </div>
              
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-black">{promo.name}</h3>
                  <p className="text-gray-600 mb-4 text-lg">{promo.description}</p>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-3xl font-bold text-green-600">{promo.price}</span>
                    <span className="text-xl text-gray-400 line-through">{promo.originalPrice}</span>
                    <Badge className="bg-green-100 text-green-800 font-semibold">
                      Economize {((parseFloat(promo.originalPrice.replace('R$ ', '').replace(',', '.')) - parseFloat(promo.price.replace('R$ ', '').replace(',', '.'))) / parseFloat(promo.originalPrice.replace('R$ ', '').replace(',', '.')) * 100).toFixed(0)}%
                    </Badge>
                  </div>
                </div>
                
                <Link to="/catalogo">
                  <Button className="bg-red-500 hover:bg-red-600 text-white font-semibold w-full md:w-auto px-8 py-3 text-lg">
                    Ver no Cardápio
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionsSection;
