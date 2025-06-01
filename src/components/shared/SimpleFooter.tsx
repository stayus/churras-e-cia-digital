import React from 'react';

const SimpleFooter = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16 w-full">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <div className="mb-3">
            <h3 className="text-lg sm:text-xl font-bold">
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
