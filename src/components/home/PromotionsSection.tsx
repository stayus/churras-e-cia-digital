
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
      category: 'lanche'
    },
    {
      id: 2,
      name: "Hambúrguer Artesanal",
      description: "Hambúrguer 200g + Batata + Bebida",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      price: 19.90,
      originalPrice: 26.90,
      category: 'lanche'
    },
    {
      id: 3,
      name: "Espetinho Duplo",
      description: "2 Espetinhos de carne + Farofa + Vinagrete",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
      price: 16.50,
      originalPrice: 21.00,
      category: 'lanche'
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
      toast({
        title: "Login necessário",
        description: "Faça login para adicionar produtos ao carrinho.",
        variant: "destructive"
      });
      // Redirecionar para login será feito pelo Link
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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold text-black mb-4">
            🔥 Promoções
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Aproveite nossas ofertas especiais e economize nos seus pratos favoritos
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {promotions.map((promo, index) => (
            <Card 
              key={promo.id} 
              className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 animate-fade-in group"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative">
                <img 
                  src={promo.image} 
                  alt={promo.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <Badge className="absolute top-4 right-4 bg-red-500 text-white font-bold animate-pulse">
                  PROMOÇÃO
                </Badge>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-black">{promo.name}</h3>
                <p className="text-gray-600 mb-4 text-sm">{promo.description}</p>
                
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-green-600">{formatCurrency(promo.price)}</span>
                  <span className="text-lg text-gray-400 line-through">{formatCurrency(promo.originalPrice)}</span>
                </div>
                
                {isAuthenticated ? (
                  <Button 
                    onClick={() => handleAddToCart(promo)}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold w-full transition-all duration-300 hover:scale-105"
                  >
                    Adicionar
                  </Button>
                ) : (
                  <Link to="/login" className="w-full">
                    <Button className="bg-red-500 hover:bg-red-600 text-white font-semibold w-full transition-all duration-300 hover:scale-105">
                      Adicionar
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center animate-fade-in">
          <Link to="/catalogo">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 transition-all duration-300 hover:scale-105">
              Ver Todas as Promoções
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PromotionsSection;
