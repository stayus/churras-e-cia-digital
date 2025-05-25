
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

const PopularSection = () => {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();

  const popularItems = [
    {
      id: 1,
      name: "Churrasquinho Tradicional",
      description: "Carne bovina selecionada grelhada na perfeição",
      image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop",
      price: 12.90,
      rating: 4.8,
      orders_count: 150,
      is_out_of_stock: false,
      category: 'lanche'
    },
    {
      id: 2,
      name: "X-Bacon Supreme",
      description: "Hambúrguer duplo com bacon crocante e queijo",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      price: 22.90,
      rating: 4.9,
      orders_count: 120,
      is_out_of_stock: false,
      category: 'lanche'
    },
    {
      id: 3,
      name: "Espetinho de Frango",
      description: "Frango temperado com ervas especiais da casa",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
      price: 8.50,
      rating: 4.7,
      orders_count: 100,
      is_out_of_stock: true,
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
      return;
    }

    if (product.is_out_of_stock) {
      toast({
        title: "Produto esgotado",
        description: "Este produto não está disponível no momento.",
        variant: "destructive"
      });
      return;
    }

    const productForCart = {
      id: product.id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image,
      is_out_of_stock: product.is_out_of_stock,
      promotion_price: null,
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
        <div className="flex justify-between items-center mb-12 animate-fade-in">
          <div>
            <h2 className="text-4xl font-bold text-black mb-4">
              ⭐ Mais Pedidos
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl">
              Os pratos mais amados pelos nossos clientes
            </p>
          </div>
          
          <Link to="/catalogo">
            <Button className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 transition-all duration-300 hover:scale-105">
              Ver Cardápio Completo
            </Button>
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {popularItems.map((item, index) => (
            <Card 
              key={item.id} 
              className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 animate-fade-in group"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className={`w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700 ${item.is_out_of_stock ? 'grayscale' : ''}`}
                />
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/80 rounded-full px-3 py-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-white text-sm font-bold">{item.rating}</span>
                </div>
                <Badge className="absolute top-4 left-4 bg-green-600 text-white font-bold">
                  {item.orders_count} pedidos
                </Badge>
                {item.is_out_of_stock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge className="bg-gray-600 text-white font-bold text-lg px-4 py-2">
                      ESGOTADO
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-black">{item.name}</h3>
                <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                
                <div className="mb-4">
                  <span className="text-2xl font-bold text-green-600">{formatCurrency(item.price)}</span>
                </div>
                
                {item.is_out_of_stock ? (
                  <Button disabled className="bg-gray-400 text-white font-semibold w-full cursor-not-allowed">
                    Esgotado
                  </Button>
                ) : isAuthenticated ? (
                  <Button 
                    onClick={() => handleAddToCart(item)}
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
      </div>
    </section>
  );
};

export default PopularSection;
