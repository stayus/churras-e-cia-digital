
import React from 'react';
import { Route } from 'react-router-dom';

// Admin pages
import AdminDashboard from "@/pages/admin/Admin";
import AdminProducts from "@/pages/admin/Products";
import AdminEmployees from "@/pages/admin/Employees";
import AdminReports from "@/pages/admin/Reports";
import AdminSettings from "@/pages/admin/Settings";
import AdminOrders from "@/pages/admin/Orders";

import { ProtectedRoute } from './ProtectedRoute';

const AdminRoutes: React.FC = () => (
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
      path="/admin/funcionarios" 
      element={<ProtectedRoute element={<AdminEmployees />} allowedRoles={['admin']} />} 
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
