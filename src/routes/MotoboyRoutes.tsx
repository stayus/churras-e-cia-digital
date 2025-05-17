
import React from 'react';
import { Route } from 'react-router-dom';

// Motoboy pages
import MotoboyPanel from "@/pages/motoboy/MotoboyPanel";

import { ProtectedRoute } from './ProtectedRoute';

// Export a fragment containing all motoboy routes
const MotoboyRoutes = (
  <>
    <Route 
      path="/motoboy" 
      element={<ProtectedRoute element={<MotoboyPanel />} allowedRoles={['motoboy']} />} 
    />
  </>
);

export default MotoboyRoutes;
