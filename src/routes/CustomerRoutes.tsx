
import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from '@/pages/customer/Dashboard';
import Cart from '@/pages/Cart';
import Orders from '@/pages/Orders';
import Account from '@/pages/customer/Account';
import { ProtectedRoute } from './ProtectedRoute';

const CustomerRoutes = (
  <>
    <Route 
      path="/dashboard" 
      element={<ProtectedRoute element={<Dashboard />} allowedRoles={['customer']} />} 
    />
    <Route 
      path="/cart" 
      element={<Cart />} 
    />
    <Route 
      path="/pedidos" 
      element={<Orders />} 
    />
    <Route 
      path="/minha-conta" 
      element={<ProtectedRoute element={<Account />} allowedRoles={['customer']} />} 
    />
  </>
);

export default CustomerRoutes;
