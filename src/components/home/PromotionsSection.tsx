
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Percent, ArrowRight } from 'lucide-react';

const PromotionsSection = () => {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();

  const promotions = [
    {
      id: 1,
      name: "Combo Família",
      description: "4 Churrasquinhos + 2 Refrigerantes + Batata Frita Grande",
      image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop",
      price: 39.90,
      originalPrice: 52.90,
      category: 'lanche',
      is_promotion: true,
      discount: 25
    },
    {
      id: 2,
      name: "X-Bacon Duplo",
      description: "Dois hambúrgueres artesanais + Bacon + Queijo + Molho especial",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      price: 24.90,
      originalPrice: 32.90,
      category: 'lanche',
      is_promotion: true,
      discount: 24
    },
    {
      id: 3,
      name: "Festival de Espetinhos",
      description: "6 Espetinhos variados + Farofa + Vinagrete + Pão de alho",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
      price: 29.90,
      originalPrice: 38.90,
      category: 'lanche',
      is_promotion: true,
      discount: 23
    }
  ];

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

    const productForCart = {
      id: product.id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image,
      is_out_of_stock: false,
      promotion_price: product.price,
      category: product.category,
      extras: []
    };

    addItem(productForCart, 1);
    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao carrinho.`,
    });
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Percent className="h-8 w-8 text-red-600" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Promoções
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Aproveite nossas ofertas especiais! Sabor excepcional com preços irresistíveis.
          </p>
        </div>
        
        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {promotions.map((promo, index) => (
            <Card 
              key={promo.id} 
              className="group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up bg-white border-0 rounded-2xl"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={promo.image} 
                  alt={promo.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Promotion Badge */}
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold px-3 py-1 text-sm shadow-lg animate-pulse">
                  -{promo.discount}% OFF
                </Badge>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                  {promo.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {promo.description}
                </p>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-green-600">
                      {formatCurrency(promo.price)}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      De {formatCurrency(promo.originalPrice)}
                    </span>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Economize {formatCurrency(promo.originalPrice - promo.price)}
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleAddToCart(promo)}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-full"
                >
                  Adicionar ao Carrinho
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Ver Todos Button */}
        <div className="text-center animate-fade-in-up">
          <Link to="/catalogo?categoria=promocoes">
            <Button 
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-full"
            >
              Ver Todas as Promoções
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PromotionsSection;
