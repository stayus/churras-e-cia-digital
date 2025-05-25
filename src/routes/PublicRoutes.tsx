
import React from 'react';
import { Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import EmployeeLogin from '@/pages/EmployeeLogin';
import Register from '@/pages/Register';
import RegisterSuccess from '@/pages/RegisterSuccess';
import EmailConfirmed from '@/pages/EmailConfirmed';
import PasswordChange from '@/pages/PasswordChange';
import Catalog from '@/pages/Catalog';
import NotFound from '@/pages/NotFound';

const PublicRoutes = [
  <Route key="index" path="/" element={<Index />} />,
  <Route key="home" path="/home" element={<Home />} />,
  <Route key="login" path="/login" element={<Login />} />,
  <Route key="employee-login" path="/employee-login" element={<EmployeeLogin />} />,
  <Route key="register" path="/register" element={<Register />} />,
  <Route key="register-success" path="/register-success" element={<RegisterSuccess />} />,
  <Route key="email-confirmed" path="/email-confirmed" element={<EmailConfirmed />} />,
  <Route key="password-change" path="/password-change" element={<PasswordChange />} />,
  <Route key="catalogo" path="/catalogo" element={<Catalog />} />,
  <Route key="not-found" path="*" element={<NotFound />} />
];

export default PublicRoutes;
