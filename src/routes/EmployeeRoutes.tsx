
import React from 'react';
import { Route } from 'react-router-dom';

// Employee pages
import EmployeePanel from "@/pages/employee/EmployeePanel";

import { ProtectedRoute } from './ProtectedRoute';

// Export a fragment containing all employee routes
const EmployeeRoutes = (
  <>
    <Route 
      path="/employee" 
      element={<ProtectedRoute element={<EmployeePanel />} allowedRoles={['employee', 'tesoureiro', 'analista', 'cozinheira', 'motoboy']} />} 
    />
    <Route 
      path="/employee/reports" 
      element={<ProtectedRoute element={<EmployeePanel />} allowedRoles={['employee', 'tesoureiro', 'analista', 'cozinheira', 'motoboy']} />} 
    />
    <Route 
      path="/employee/promotions" 
      element={<ProtectedRoute element={<EmployeePanel />} allowedRoles={['employee', 'tesoureiro', 'analista', 'cozinheira', 'motoboy']} />} 
    />
    <Route 
      path="/employee/stock" 
      element={<ProtectedRoute element={<EmployeePanel />} allowedRoles={['employee', 'tesoureiro', 'analista', 'cozinheira', 'motoboy']} />} 
    />
    <Route 
      path="/employee/exports" 
      element={<ProtectedRoute element={<EmployeePanel />} allowedRoles={['employee', 'tesoureiro', 'analista', 'cozinheira', 'motoboy']} />} 
    />
  </>
);

export default EmployeeRoutes;
