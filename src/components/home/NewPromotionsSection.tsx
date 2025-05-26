
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/useProducts';
import { Percent, ArrowRight } from 'lucide-react';

const NewPromotionsSection = () => {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();
  const { products, loading } = useProducts();

  // Filtrar apenas produtos em promoção (que tenham promotion_price)
  const promotionsProducts = products.filter(product => 
    product.promotion_price && product.promotion_price < product.price
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleAddToCart = (product: any) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    addItem(product, 1);
    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao carrinho.`,
    });
  };

  // Se não há produtos em promoção ou ainda está carregando, não exibe a seção
  if (loading || promotionsProducts.length === 0) {
    return null;
  }

  // Limitar a 3 produtos para melhor layout
  const displayedPromotions = promotionsProducts.slice(0, 3);

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Percent className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
              Promoções
            </h2>
          </div>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Aproveite nossas ofertas especiais! Sabor excepcional com preços irresistíveis.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {displayedPromotions.map((product, index) => (
            <Card 
              key={product.id} 
              className="group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up bg-white border-0 rounded-2xl"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={product.image_url || "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop"} 
                  alt={product.name}
                  className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold px-2 sm:px-3 py-1 text-xs sm:text-sm shadow-lg animate-pulse">
                  PROMOÇÃO
                </Badge>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm leading-relaxed line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex flex-col">
                    <span className="text-xl sm:text-2xl font-bold text-green-600">
                      {formatCurrency(product.promotion_price || product.price)}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-400 line-through">
                      De {formatCurrency(product.price)}
                    </span>
                  </div>
                  <div className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                    Economize {formatCurrency(product.price - (product.promotion_price || product.price))}
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2 sm:py-3 text-sm sm:text-base transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-full"
                >
                  Adicionar ao Carrinho
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center animate-fade-in-up">
          <Link to="/catalogo?categoria=promocoes">
            <Button 
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-full"
            >
              Ver Todas as Promoções
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewPromotionsSection;
