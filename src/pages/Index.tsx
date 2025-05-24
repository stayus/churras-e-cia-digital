
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingBag, User, LogIn, Star, Clock, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();

  // Produtos em destaque (simulado - pode ser integrado com dados reais depois)
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
      {/* Header/Navigation com design melhorado */}
      <header className="bg-black/90 backdrop-blur-sm shadow-lg border-b border-red-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
                  Churrasquinho & Cia
                </span>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-white hover:text-yellow-400 transition-colors font-medium">
                Home
              </Link>
              <Link to="/catalogo" className="text-white hover:text-yellow-400 transition-colors font-medium">
                Cardápio
              </Link>
              {isAuthenticated && user?.role === 'customer' && (
                <Link to="/pedidos" className="text-white hover:text-yellow-400 transition-colors font-medium">
                  Meus Pedidos
                </Link>
              )}
            </nav>

            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <Link 
                  to={
                    user?.role === 'admin' ? '/admin' : 
                    user?.role === 'employee' ? '/employee' : 
                    user?.role === 'motoboy' ? '/motoboy' : 
                    '/catalogo'
                  } 
                  className="flex items-center text-white hover:text-yellow-400 transition-colors"
                >
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline font-medium">{user?.name?.split(' ')[0]}</span>
                </Link>
              ) : (
                <Link to="/login">
                  <Button variant="outline" size="sm" className="gap-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
                    <LogIn className="h-4 w-4" /> Entrar
                  </Button>
                </Link>
              )}
              <Link to="/carrinho" className="relative text-white hover:text-yellow-400 transition-colors">
                <ShoppingBag className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 h-5 w-5 text-xs flex items-center justify-center bg-red-600 text-white rounded-full font-bold">
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section com imagem de fundo */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background com overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=1920&h=1080&fit=crop')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-red-900/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl">
              O melhor{' '}
              <span className="bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
                churrasquinho
              </span>
              <br />da região!
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200 drop-shadow-lg">
              Deliciosos churrasquinhos, hambúrgueres e muito mais para você e sua família.
              <span className="block mt-2 text-yellow-400 font-semibold">
                🔥 Sabor autêntico que você vai amar!
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-8 py-3 text-lg shadow-xl transform hover:scale-105 transition-all">
                <Link to="/catalogo" className="gap-3">
                  <ShoppingBag className="h-6 w-6" />
                  Ver Cardápio Completo
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold px-8 py-3 text-lg">
                <Link to="/catalogo">
                  Promoções do Dia
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Produtos em Destaque */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Produtos em{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                Destaque
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Confira nossos produtos mais pedidos e as promoções especiais da semana
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <Card 
                key={product.id} 
                className="group overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900 border-gray-700 hover:border-red-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {product.isPromotion && (
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold animate-pulse">
                      🔥 PROMOÇÃO
                    </Badge>
                  )}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 rounded-full px-2 py-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-white text-sm font-bold">{product.rating}</span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-yellow-400 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-400">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">{product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold transform hover:scale-105 transition-all">
                    Adicionar ao Carrinho
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold px-8 py-3">
              <Link to="/catalogo">
                Ver Cardápio Completo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Por que escolher o{' '}
              <span className="bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
                Churrasquinho & Cia?
              </span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Há mais de 10 anos satisfazendo nossos clientes com produtos de qualidade e sabor inigualável.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 bg-gradient-to-b from-gray-800 to-gray-900 border-gray-700 hover:border-yellow-400 transition-all duration-300 transform hover:scale-105 animate-fade-in">
              <div className="bg-gradient-to-br from-red-600 to-red-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.38a48.474 48.474 0 0 0-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Zm-3 0a.375.375 0 1 1-.53 0L9 2.845l.265.265Zm6 0a.375.375 0 1 1-.53 0L15 2.845l.265.265Z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Qualidade Premium</h3>
              <p className="text-gray-300 leading-relaxed">
                Utilizamos apenas ingredientes frescos e de qualidade superior para proporcionar um sabor inigualável.
              </p>
            </Card>
            
            <Card className="text-center p-8 bg-gradient-to-b from-gray-800 to-gray-900 border-gray-700 hover:border-yellow-400 transition-all duration-300 transform hover:scale-105 animate-fade-in" style={{ animationDelay: '150ms' }}>
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Entrega Rápida</h3>
              <p className="text-gray-300 leading-relaxed">
                Entrega rápida e eficiente para garantir que sua comida chegue quente e saborosa em sua casa.
              </p>
            </Card>
            
            <Card className="text-center p-8 bg-gradient-to-b from-gray-800 to-gray-900 border-gray-700 hover:border-yellow-400 transition-all duration-300 transform hover:scale-105 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="bg-gradient-to-br from-green-600 to-green-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">100% Satisfação</h3>
              <p className="text-gray-300 leading-relaxed">
                Nossos clientes são nossa prioridade. Trabalhamos para garantir sua satisfação em cada pedido.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-gradient-to-r from-red-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Faça seu pedido{' '}
                <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                  agora mesmo!
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Experimente nossas delícias e desfrute do melhor sabor da cidade. Entregamos em toda a região!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-8 py-3">
                  <Link to="/catalogo" className="gap-3">
                    <ShoppingBag className="h-5 w-5" />
                    Pedir Agora
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold px-8 py-3">
                  <Link to="/catalogo">
                    Ver Promoções
                  </Link>
                </Button>
              </div>
            </div>
            
            <Card className="bg-gradient-to-b from-gray-800 to-gray-900 border-yellow-400 border-2 shadow-2xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-center text-yellow-400">Horário de Funcionamento</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                    <span className="font-semibold text-white">Segunda a Sexta</span>
                    <span className="text-yellow-400 font-bold">17:00 - 23:00</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                    <span className="font-semibold text-white">Sábado</span>
                    <span className="text-yellow-400 font-bold">17:00 - 00:00</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-700 pb-2">
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

      {/* Footer */}
      <footer className="bg-black text-white py-12 border-t border-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
                Churrasquinho & Cia
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                O melhor sabor para você e sua família. Qualidade, tradição e sabor em cada pedaço.
              </p>
            </div>
            <div className="flex justify-center md:justify-end space-x-6">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors transform hover:scale-110">
                <span className="sr-only">Facebook</span>
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors transform hover:scale-110">
                <span className="sr-only">Instagram</span>
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors transform hover:scale-110">
                <span className="sr-only">WhatsApp</span>
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
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
