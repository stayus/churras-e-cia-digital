
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, ArrowRight, Users } from 'lucide-react';

const NewPopularSection = () => {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();

  const popularItems = [
    {
      id: 1,
      name: "Churrasquinho Tradicional",
      description: "Carne bovina premium grelhada na perfeição com temperos especiais da casa",
      image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop",
      price: 14.90,
      orders_count: 2847,
      is_out_of_stock: false,
      category: 'lanche'
    },
    {
      id: 2,
      name: "X-Bacon Gourmet",
      description: "Hambúrguer artesanal 180g + bacon crocante + queijo derretido + molho especial",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      price: 26.90,
      orders_count: 1923,
      is_out_of_stock: false,
      category: 'lanche'
    },
    {
      id: 3,
      name: "Espetinho de Frango",
      description: "Frango temperado com ervas finas, grelhado no ponto ideal e suculento",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
      price: 9.90,
      orders_count: 1592,
      is_out_of_stock: false,
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
      window.location.href = '/login';
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
      description: `${product.name} foi adicionado ao carrinho.`,
    });
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-16 animate-fade-in-up">
          <div className="text-center lg:text-left mb-6 lg:mb-0">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <TrendingUp className="h-8 w-8 text-red-600" />
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Mais Pedidos
              </h2>
            </div>
            <p className="text-xl text-gray-600">
              Os favoritos absolutos dos nossos clientes
            </p>
          </div>
          
          <Link to="/catalogo">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-8 py-4 transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-full"
            >
              Ver Cardápio Completo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {popularItems.map((item, index) => (
            <Card 
              key={item.id} 
              className="group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up bg-white border-0 rounded-2xl"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold px-3 py-1 text-sm shadow-lg flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {item.orders_count.toLocaleString()} pedidos
                </Badge>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                  {item.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(item.price)}
                  </span>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Top #{popularItems.indexOf(item) + 1}
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleAddToCart(item)}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-full"
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
