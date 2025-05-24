
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

const PopularSection = () => {
  const popularItems = [
    {
      id: 1,
      name: "Churrasquinho Tradicional",
      description: "Carne bovina selecionada na chapa",
      image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=300&h=200&fit=crop",
      price: "R$ 12,90",
      rating: 4.8,
      isOutOfStock: false
    },
    {
      id: 2,
      name: "X-Bacon Supreme",
      description: "Hambúrguer duplo com bacon crocante",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop",
      price: "R$ 22,90",
      rating: 4.9,
      isOutOfStock: false
    },
    {
      id: 3,
      name: "Espetinho de Frango",
      description: "Frango temperado com ervas especiais",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=200&fit=crop",
      price: "R$ 8,50",
      rating: 4.7,
      isOutOfStock: true
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12 text-black">
          ⭐ Mais Pedidos
        </h2>
        
        <div className="space-y-6">
          {popularItems.map((item) => (
            <Card key={item.id} className="flex flex-col md:flex-row overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative md:w-80">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-48 md:h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/80 rounded-full px-3 py-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-white text-sm font-bold">{item.rating}</span>
                </div>
              </div>
              
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-black">{item.name}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-green-600">{item.price}</span>
                  </div>
                </div>
                
                {item.isOutOfStock ? (
                  <Button disabled className="bg-gray-400 text-white font-semibold w-full md:w-auto cursor-not-allowed">
                    Esgotado
                  </Button>
                ) : (
                  <Button className="bg-red-500 hover:bg-red-600 text-white font-semibold w-full md:w-auto">
                    Adicionar ao Carrinho
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularSection;
