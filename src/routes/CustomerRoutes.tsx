
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

// Customer pages
import CustomerDashboard from "@/pages/customer/Dashboard";
import AccountPage from "@/pages/customer/Account";
import CatalogPage from "@/pages/Catalog";
import CartPage from "@/pages/Cart";
import OrdersPage from "@/pages/Orders";

import { ProtectedRoute } from './ProtectedRoute';

// Export a fragment containing all customer routes
const CustomerRoutes = (
  <>
    <Route 
      path="/" 
      element={<CustomerDashboard />} 
    />
    <Route 
      path="/minha-conta" 
      element={<ProtectedRoute element={<AccountPage />} allowedRoles={['customer']} />} 
    />
    <Route 
      path="/catalogo" 
      element={<CatalogPage />} 
    />
    <Route 
      path="/carrinho" 
      element={<ProtectedRoute element={<CartPage />} allowedRoles={['customer']} />} 
    />
    <Route 
      path="/pedidos" 
      element={<ProtectedRoute element={<OrdersPage />} allowedRoles={['customer']} />} 
    />
  </>
);

export default CustomerRoutes;
