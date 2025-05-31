
import React from 'react';
import { Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import AdmLogin from '@/pages/AdmLogin';
import Register from '@/pages/Register';
import RegisterSuccess from '@/pages/RegisterSuccess';
import EmailConfirmed from '@/pages/EmailConfirmed';
import PasswordChange from '@/pages/PasswordChange';
import Cardapio from '@/pages/Cardapio';
import NotFound from '@/pages/NotFound';

const PublicRoutes = [
  <Route key="index" path="/" element={<Index />} />,
  <Route key="home" path="/home" element={<Home />} />,
  <Route key="login" path="/login" element={<Login />} />,
  <Route key="adm-login" path="/adm-login" element={<AdmLogin />} />,
  <Route key="register" path="/register" element={<Register />} />,
  <Route key="register-success" path="/register-success" element={<RegisterSuccess />} />,
  <Route key="email-confirmed" path="/email-confirmed" element={<EmailConfirmed />} />,
  <Route key="password-change" path="/password-change" element={<PasswordChange />} />,
  <Route key="cardapio" path="/cardapio" element={<Cardapio />} />,
  <Route key="not-found" path="*" element={<NotFound />} />
];

export default PublicRoutes;
