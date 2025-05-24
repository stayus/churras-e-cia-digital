
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-red-900/60 to-black/80"></div>
      
      <div className="text-center relative z-10 animate-fade-in">
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mb-8 shadow-2xl animate-pulse">
          <span className="text-white font-bold text-3xl">!</span>
        </div>
        
        <h1 className="text-8xl font-bold bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent mb-6">
          404
        </h1>
        
        <h2 className="text-3xl font-bold text-white mb-4">
          Oops! Página não encontrada
        </h2>
        
        <p className="text-xl text-gray-300 mb-8 max-w-md mx-auto">
          A página que você está procurando não existe ou foi movida.
        </p>
        
        <Button asChild size="lg" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-8 py-3">
          <Link to="/" className="gap-3">
            <Home className="h-5 w-5" />
            Voltar para Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
