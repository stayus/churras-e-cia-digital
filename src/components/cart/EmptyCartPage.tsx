
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import CustomerLayout from '@/components/customer/CustomerLayout';
import SimpleFooter from '@/components/shared/SimpleFooter';

const EmptyCartPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <CustomerLayout>
          <Helmet>
            <title>Carrinho - Churrasquinho & Cia</title>
          </Helmet>
          <div className="content-container">
            <div className="text-center py-16 animate-fade-in">
              <div className="brand-card max-w-lg mx-auto p-12">
                <div className="text-6xl mb-6">🛒</div>
                <h2 className="heading-lg text-white mb-6">
                  Seu carrinho está <span className="gradient-text">vazio</span>
                </h2>
                <p className="text-gray-300 mb-8 text-body">
                  Adicione alguns produtos deliciosos ao seu carrinho
                </p>
                <Button 
                  onClick={() => window.location.href = '/cardapio'}
                  className="brand-button-primary"
                >
                  Ver Cardápio
                </Button>
              </div>
            </div>
          </div>
        </CustomerLayout>
      </div>
      <SimpleFooter />
    </div>
  );
};

export default EmptyCartPage;
