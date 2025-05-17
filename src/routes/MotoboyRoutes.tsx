
import React from 'react';
import { Route } from 'react-router-dom';

// Motoboy pages
import MotoboyPanel from "@/pages/motoboy/MotoboyPanel";

import { ProtectedRoute } from './ProtectedRoute';

const MotoboyRoutes: React.FC = () => (
  <>
    <Route 
      path="/motoboy" 
      element={<ProtectedRoute element={<MotoboyPanel />} allowedRoles={['motoboy']} />} 
    />
  </>
);

export default MotoboyRoutes;
