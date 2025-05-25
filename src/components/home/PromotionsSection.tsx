
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

const PromotionsSection = () => {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();

  const promotions = [
    {
      id: 1,
      name: "Combo Especial",
      description: "2 Churrasquinhos + Refrigerante + Batata Frita",
      image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop",
      price: 24.90,
      originalPrice: 32.90,
      category: 'lanche',
      is_promotion: true
    },
    {
      id: 2,
      name: "X-Bacon Premium",
      description: "Hambúrguer duplo + Bacon + Queijo + Batata",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      price: 19.90,
      originalPrice: 26.90,
      category: 'lanche',
      is_promotion: true
    },
    {
      id: 3,
      name: "Espetinho Duplo",
      description: "2 Espetinhos de carne + Farofa + Vinagrete",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
      price: 16.50,
      originalPrice: 21.00,
      category: 'lanche',
      is_promotion: true
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
      // Redirecionar para login se não estiver logado
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

    addItem(productForCart, []);
    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao carrinho.`
    });
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-scroll-reveal">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            🔥 Promoções
          </h2>
          <p className="text-gray-600 text-lg">
            Aproveite nossas ofertas especiais por tempo limitado!
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {promotions.map((promo, index) => (
            <Card 
              key={promo.id} 
              className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-scroll-reveal group bg-white border border-gray-200"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={promo.image} 
                  alt={promo.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Badge de PROMOÇÃO substituindo categoria */}
                {promo.is_promotion && (
                  <Badge className="absolute top-3 right-3 bg-red-500 text-white font-bold px-3 py-1 text-sm animate-pulse shadow-lg">
                    PROMOÇÃO
                  </Badge>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-black group-hover:text-red-600 transition-colors duration-300">
                  {promo.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {promo.description}
                </p>
                
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(promo.price)}
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    {formatCurrency(promo.originalPrice)}
                  </span>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                    -{Math.round(((promo.originalPrice - promo.price) / promo.originalPrice) * 100)}%
                  </span>
                </div>
                
                <Button 
                  onClick={() => handleAddToCart(promo)}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold w-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Adicionar
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center animate-scroll-reveal">
          <Link to="/catalogo?categoria=promocoes">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              Ver Todos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PromotionsSection;
