
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingBag, User, LogIn, Star, Clock, MapPin, Phone, ChefHat, Truck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();

  // Produtos em destaque
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
    <div className="min-h-screen">
      {/* Header moderno */}
      <header className="fixed top-0 w-full bg-black/95 backdrop-blur-md shadow-xl border-b border-red-600/30 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
                    Churrasquinho & Cia
                  </h1>
                  <p className="text-xs text-gray-400">O melhor da região</p>
                </div>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-white hover:text-yellow-400 transition-all duration-300 font-medium relative group">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/catalogo" className="text-white hover:text-yellow-400 transition-all duration-300 font-medium relative group">
                Cardápio
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              {isAuthenticated && user?.role === 'customer' && (
                <Link to="/pedidos" className="text-white hover:text-yellow-400 transition-all duration-300 font-medium relative group">
                  Meus Pedidos
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link 
                  to={
                    user?.role === 'admin' ? '/admin' : 
                    user?.role === 'employee' ? '/employee' : 
                    user?.role === 'motoboy' ? '/motoboy' : 
                    '/catalogo'
                  } 
                  className="flex items-center text-white hover:text-yellow-400 transition-all duration-300"
                >
                  <User className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline font-medium">{user?.name?.split(' ')[0]}</span>
                </Link>
              ) : (
                <Link to="/login">
                  <Button size="sm" className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold border-0 shadow-lg">
                    <LogIn className="h-4 w-4 mr-2" /> Entrar
                  </Button>
                </Link>
              )}
              <Link to="/carrinho" className="relative text-white hover:text-yellow-400 transition-all duration-300">
                <ShoppingBag className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 h-5 w-5 text-xs flex items-center justify-center bg-red-600 text-white rounded-full font-bold">
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section com novo design */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Background com múltiplas camadas */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=1920&h=1080&fit=crop')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-red-900/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black" />
        </div>

        {/* Content principal */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <Badge className="mb-6 bg-red-600/20 text-red-400 border-red-500 px-4 py-2 text-sm font-semibold">
              🔥 Agora com delivery grátis
            </Badge>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              <span className="text-white drop-shadow-2xl">Sabor</span>
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                Autêntico
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-gray-200 leading-relaxed">
              Há mais de 10 anos trazendo o melhor da culinária brasileira para sua mesa.
              <br />
              <span className="text-yellow-400 font-semibold">Tradição, qualidade e sabor em cada mordida.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button size="lg" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-10 py-4 text-lg shadow-2xl transform hover:scale-105 transition-all duration-300">
                <Link to="/catalogo" className="flex items-center gap-3">
                  <ShoppingBag className="h-6 w-6" />
                  Fazer Pedido Agora
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold px-10 py-4 text-lg bg-black/30 backdrop-blur-sm">
                <Link to="/catalogo" className="flex items-center gap-3">
                  Ver Promoções
                </Link>
              </Button>
            </div>

            {/* Stats rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">10+</div>
                <div className="text-gray-300">Anos de Tradição</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">5000+</div>
                <div className="text-gray-300">Clientes Satisfeitos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">30min</div>
                <div className="text-gray-300">Entrega Rápida</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Produtos em Destaque */}
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

      {/* Seção de Diferenciais */}
      <section className="py-24 bg-gradient-to-b from-gray-900 via-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              Por que nos{' '}
              <span className="bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
                Escolher?
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Mais de uma década de experiência trazendo o melhor sabor para você
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 bg-gradient-to-b from-gray-900 to-black border border-gray-800 hover:border-yellow-400/50 transition-all duration-500 transform hover:scale-105 group">
              <div className="bg-gradient-to-br from-red-600 to-red-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-red-500/50 transition-all duration-300">
                <ChefHat className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-yellow-400 transition-colors">Qualidade Premium</h3>
              <p className="text-gray-300 leading-relaxed">
                Ingredientes selecionados e preparo artesanal garantem sabor autêntico em cada prato.
              </p>
            </Card>
            
            <Card className="text-center p-8 bg-gradient-to-b from-gray-900 to-black border border-gray-800 hover:border-yellow-400/50 transition-all duration-500 transform hover:scale-105 group">
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-yellow-500/50 transition-all duration-300">
                <Truck className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-yellow-400 transition-colors">Entrega Rápida</h3>
              <p className="text-gray-300 leading-relaxed">
                Delivery expresso para sua casa. Comida quentinha e saborosa no tempo certo.
              </p>
            </Card>
            
            <Card className="text-center p-8 bg-gradient-to-b from-gray-900 to-black border border-gray-800 hover:border-yellow-400/50 transition-all duration-500 transform hover:scale-105 group">
              <div className="bg-gradient-to-br from-green-600 to-green-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-green-500/50 transition-all duration-300">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-yellow-400 transition-colors">100% Satisfação</h3>
              <p className="text-gray-300 leading-relaxed">
                Compromisso total com a sua satisfação. Sua felicidade é nossa prioridade.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Seção de Contato/CTA */}
      <section className="py-24 bg-gradient-to-r from-red-900 via-black to-red-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
                Faça seu pedido{' '}
                <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                  agora mesmo!
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Não perca tempo! Nossos pratos estão esperando por você. 
                Sabor autêntico a um clique de distância.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button asChild size="lg" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-8 py-4">
                  <Link to="/catalogo" className="flex items-center gap-3">
                    <ShoppingBag className="h-5 w-5" />
                    Pedir Agora
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold px-8 py-4">
                  <Link to="/catalogo">
                    Ver Promoções
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-6 text-gray-300">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-400" />
                  <span>Aberto agora</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-yellow-400" />
                  <span>Entrega grátis</span>
                </div>
              </div>
            </div>
            
            <Card className="bg-gradient-to-b from-gray-900 to-black border-2 border-yellow-400/50 shadow-2xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold mb-6 text-center text-yellow-400">Horário de Funcionamento</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                    <span className="font-semibold text-white">Segunda a Sexta</span>
                    <span className="text-yellow-400 font-bold">17:00 - 23:00</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                    <span className="font-semibold text-white">Sábado</span>
                    <span className="text-yellow-400 font-bold">17:00 - 00:00</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                    <span className="font-semibold text-white">Domingo</span>
                    <span className="text-yellow-400 font-bold">17:00 - 22:00</span>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-700 space-y-3">
                  <div className="flex items-center text-gray-300">
                    <MapPin className="h-5 w-5 text-red-500 mr-3" />
                    <span><strong className="text-white">Endereço:</strong> Rua Exemplo, 123 - Centro</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Phone className="h-5 w-5 text-red-500 mr-3" />
                    <span><strong className="text-white">Tel:</strong> (00) 00000-0000</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer moderno */}
      <footer className="bg-black border-t border-red-600/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
                    Churrasquinho & Cia
                  </h2>
                  <p className="text-gray-400 text-sm">Tradição e sabor</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Há mais de 10 anos levando o melhor da culinária brasileira até você.
              </p>
            </div>
            
            <div className="text-center">
              <h3 className="text-white font-semibold mb-4">Links Rápidos</h3>
              <div className="flex flex-col space-y-2">
                <Link to="/catalogo" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Cardápio
                </Link>
                <Link to="/pedidos" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Meus Pedidos
                </Link>
                <Link to="/login" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Entrar
                </Link>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <h3 className="text-white font-semibold mb-4">Redes Sociais</h3>
              <div className="flex justify-center md:justify-end space-x-4">
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-all duration-300 transform hover:scale-110">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-all duration-300 transform hover:scale-110">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.328-1.297L6.391 14.42c.687.687 1.625 1.111 2.676 1.111 2.063 0 3.735-1.672 3.735-3.735 0-2.063-1.672-3.735-3.735-3.735-1.051 0-1.989.424-2.676 1.111L4.121 7.901c.88-.807 2.031-1.297 3.328-1.297 2.734 0 4.95 2.216 4.95 4.95s-2.216 4.95-4.95 4.95z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-all duration-300 transform hover:scale-110">
                  <span className="sr-only">WhatsApp</span>
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 text-center text-gray-400 text-sm border-t border-gray-800">
            &copy; 2025 Churrasquinho & Cia. Todos os direitos reservados. | Feito com ❤️ para você
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
