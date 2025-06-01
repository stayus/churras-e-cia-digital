
import React from 'react';

const SimpleFooter = () => {
  return (
    <footer className="bg-gray-900 text-white w-full">
      <div className="px-6 py-4">
        <div className="text-center">
          <div className="mb-2">
            <h3 className="text-lg font-bold">
              <span className="text-red-500">Churrasquinho</span>
              <span className="text-yellow-400">&Cia</span>
            </h3>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 Churrasquinho&Cia. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SimpleFooter;
