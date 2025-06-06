
import React from 'react';
import { Route } from 'react-router-dom';

// Admin pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/Products";
import AdminReports from "@/pages/admin/Reports";
import AdminOrders from "@/pages/admin/Orders";

import { ProtectedRoute } from './ProtectedRoute';

// Export a fragment containing all admin routes
const AdminRoutes = (
  <>
    <Route 
      path="/admin" 
      element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={['admin']} />} 
    />
    <Route 
      path="/admin/produtos" 
      element={<ProtectedRoute element={<AdminProducts />} allowedRoles={['admin']} />} 
    />
    <Route 
      path="/admin/relatorios" 
      element={<ProtectedRoute element={<AdminReports />} allowedRoles={['admin']} />} 
    />
    <Route 
      path="/admin/pedidos" 
      element={<ProtectedRoute element={<AdminOrders />} allowedRoles={['admin']} />} 
    />
  </>
);

export default AdminRoutes;
