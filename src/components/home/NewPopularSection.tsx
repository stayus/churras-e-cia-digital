
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/useProducts';
import { TrendingUp, ArrowRight } from 'lucide-react';

const NewPopularSection = () => {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();
  const { products, loading } = useProducts();

  // Pegar os primeiros 3 produtos disponíveis (sem estar em falta)
  const popularItems = products
    .filter(product => !product.is_out_of_stock)
    .slice(0, 3);

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

    addItem(product, []);
    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao carrinho.`,
    });
  };

  if (loading || popularItems.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-12 sm:mb-16 animate-fade-in-up">
          <div className="text-center lg:text-left mb-6 lg:mb-0">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                Mais Pedidos
              </h2>
            </div>
            <p className="text-lg sm:text-xl text-gray-600">
              Os favoritos absolutos dos nossos clientes
            </p>
          </div>
          
          <Link to="/cardapio">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-full"
            >
              Ver Cardápio Completo
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {popularItems.map((item, index) => (
            <Card 
              key={item.id} 
              className="group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up bg-white border-0 rounded-2xl"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={item.image_url || "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop"} 
                  alt={item.name}
                  className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold px-2 sm:px-3 py-1 text-xs sm:text-sm shadow-lg flex items-center gap-1">
                  Top #{index + 1}
                </Badge>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                  {item.name}
                </h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm leading-relaxed line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <span className="text-xl sm:text-2xl font-bold text-green-600">
                    {formatCurrency(item.promotion_price || item.price)}
                  </span>
                  <div className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                    Popular
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleAddToCart(item)}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2 sm:py-3 text-sm sm:text-base transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-full"
                >
                  Adicionar ao Carrinho
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewPopularSection;
