
import React from 'react';

const SimpleFooter = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center animate-fade-in-up">
          <div className="mb-6">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              <span className="text-red-500">Churrasquinho</span>
              <span className="text-yellow-400">&Cia</span>
            </h3>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-800 py-4 sm:py-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm sm:text-base">
              © 2025 Churrasquinho&Cia. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SimpleFooter;
