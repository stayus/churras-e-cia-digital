
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from 'lucide-react';

const EmptyCart = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Seu Carrinho</h1>
      
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="flex flex-col items-center justify-center py-10">
            <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Seu carrinho está vazio</h2>
            <p className="text-gray-500 mb-6">Adicione alguns produtos para começar</p>
            <Button onClick={() => navigate('/')}>
              Ver produtos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyCart;
