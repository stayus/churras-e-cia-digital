
import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const FeaturedProducts = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Churrasquinho Misto",
      price: "R$ 12,99",
      originalPrice: "R$ 15,99",
      image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop",
      isPromotion: true,
      rating: 4.8
    },
    {
      id: 2,
      name: "Hambúrguer Artesanal",
      price: "R$ 18,90",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      isPromotion: false,
      rating: 4.9
    },
    {
      id: 3,
      name: "Espetinho de Carne",
      price: "R$ 8,50",
      originalPrice: "R$ 10,00",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
      isPromotion: true,
      rating: 4.7
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-yellow-500/20 text-yellow-400 border-yellow-500">
            ⭐ Mais Pedidos
          </Badge>
          <h2 className="text-5xl font-bold text-white mb-6">
            Nossos{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
              Destaques
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Os pratos mais amados pelos nossos clientes, preparados com ingredientes frescos e muito carinho
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {featuredProducts.map((product, index) => (
            <Card 
              key={product.id} 
              className="group overflow-hidden bg-gradient-to-b from-gray-900 to-black border border-gray-800 hover:border-red-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {product.isPromotion && (
                  <Badge className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold animate-pulse shadow-lg">
                    🔥 PROMOÇÃO
                  </Badge>
                )}
                
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/80 rounded-full px-3 py-1 backdrop-blur-sm">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-white text-sm font-bold">{product.rating}</span>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-yellow-400 transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-green-400">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-400 line-through">{product.originalPrice}</span>
                    )}
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 transform hover:scale-105 transition-all duration-300 shadow-lg">
                  Adicionar ao Carrinho
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button asChild size="lg" className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold px-8 py-4">
            <Link to="/catalogo">
              Ver Cardápio Completo
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
