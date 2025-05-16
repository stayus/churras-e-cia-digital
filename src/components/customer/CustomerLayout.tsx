
import React, { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag, User, LogOut, Menu, X, Home, ClipboardList } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface CustomerLayoutProps {
  children: ReactNode;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const { logout, user } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  const menuItems = [
    { label: 'Início', icon: <Home size={20} />, href: '/' },
    { label: 'Meus Pedidos', icon: <ClipboardList size={20} />, href: '/pedidos' },
    { label: 'Minha Conta', icon: <User size={20} />, href: '/minha-conta' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate('/')} className="p-0 hover:bg-transparent">
              <span className="font-bold text-xl">Churrasquinho & Cia</span>
            </Button>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map((item, index) => (
              <Button 
                key={index} 
                variant="ghost" 
                className="flex items-center" 
                onClick={() => navigate(item.href)}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Button>
            ))}

            <Button 
              variant="ghost" 
              onClick={() => navigate('/carrinho')}
              className="relative"
            >
              <ShoppingBag size={20} />
              <span className="ml-2">Carrinho</span>
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>

            <Button 
              variant="ghost" 
              className="flex items-center" 
              onClick={handleLogout}
            >
              <LogOut size={20} />
              <span className="ml-2">Sair</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-4 md:hidden">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/carrinho')}
              className="relative p-2"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center py-4 border-b">
                    <span className="font-semibold">Menu</span>
                    <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                      <X size={18} />
                    </Button>
                  </div>
                  
                  <div className="flex flex-col space-y-4 pt-8">
                    {menuItems.map((item, index) => (
                      <Button 
                        key={index} 
                        variant="ghost" 
                        className="flex justify-start items-center w-full" 
                        onClick={() => {
                          navigate(item.href);
                          setMobileMenuOpen(false);
                        }}
                      >
                        {item.icon}
                        <span className="ml-2">{item.label}</span>
                      </Button>
                    ))}

                    <Button 
                      variant="ghost" 
                      className="flex justify-start items-center w-full" 
                      onClick={() => {
                        navigate('/carrinho');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <ShoppingBag size={20} />
                      <span className="ml-2">Carrinho ({totalItems})</span>
                    </Button>

                    <div className="flex-grow"></div>
                    
                    <Button 
                      variant="ghost" 
                      className="flex justify-start items-center w-full mt-auto" 
                      onClick={handleLogout}
                    >
                      <LogOut size={20} />
                      <span className="ml-2">Sair</span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="font-bold text-lg mb-2">Churrasquinho & Cia</h3>
              <p className="text-sm text-gray-400">O melhor churrasquinho da região!</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Contato</h4>
              <p className="text-sm text-gray-400">WhatsApp: (00) 00000-0000</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-sm text-gray-400">
            &copy; 2025 Churrasquinho & Cia. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;
