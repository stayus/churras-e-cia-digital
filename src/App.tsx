
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider, useAuth } from "@/contexts/auth";
import { CartProvider } from "@/contexts/cart";

// Pages
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import RegisterSuccessPage from "@/pages/RegisterSuccess";
import EmailConfirmedPage from "@/pages/EmailConfirmed";
import EmployeeLoginPage from "@/pages/EmployeeLogin";
import HomePage from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import PasswordChangePage from "@/pages/PasswordChange";

// Admin pages
import AdminDashboard from "@/pages/admin/Admin";
import AdminProducts from "@/pages/admin/Products";
import AdminEmployees from "@/pages/admin/Employees";
import AdminReports from "@/pages/admin/Reports";
import AdminSettings from "@/pages/admin/Settings";
import AdminOrders from "@/pages/admin/Orders";

// Employee pages
import EmployeePanel from "@/pages/employee/EmployeePanel";

// Motoboy pages
import MotoboyPanel from "@/pages/motoboy/MotoboyPanel";

// Customer pages
import CustomerDashboard from "@/pages/customer/Dashboard";
import CatalogPage from "@/pages/Catalog";
import CartPage from "@/pages/Cart";
import OrdersPage from "@/pages/Orders";

const queryClient = new QueryClient();

// Protected route component that checks user authentication and role
interface ProtectedRouteProps {
  element: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ element, allowedRoles = [] }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if the user has one of the allowed roles
  // Se allowedRoles contém 'employee', consideramos todos os usuários não-customer como funcionários
  if (allowedRoles.length > 0 && user) {
    const isEmployee = user.role !== 'customer';
    
    // Se 'employee' está na lista de funções permitidas e o usuário é um funcionário, permitir acesso
    // Ou se a função específica do usuário está na lista de funções permitidas
    const hasAllowedRole = 
      (allowedRoles.includes('employee') && isEmployee) ||
      allowedRoles.includes(user.role);
    
    if (!hasAllowedRole) {
      // Redirect based on user role
      if (user.role === 'admin') {
        return <Navigate to="/admin" replace />;
      } else if (user.role !== 'customer') {
        // Qualquer funcionário (não cliente) vai para o painel de funcionário
        return <Navigate to="/employee" replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }
  }

  // Check if user needs to change password (first login)
  if (user?.isFirstLogin && window.location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />;
  }

  return <>{element}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <HelmetProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/registro" element={<RegisterPage />} />
                <Route path="/registro-concluido" element={<RegisterSuccessPage />} />
                <Route path="/email-confirmado" element={<EmailConfirmedPage />} />
                {/* Keep email-confirmation as a duplicate route to handle both URL formats */}
                <Route path="/email-confirmation" element={<EmailConfirmedPage />} />
                <Route path="/employee-login" element={<EmployeeLoginPage />} />
                
                {/* Protected routes with role-based access */}
                <Route 
                  path="/change-password" 
                  element={
                    <ProtectedRoute 
                      element={<PasswordChangePage />} 
                      // Permitir qualquer funcionário, não apenas aqueles com role específico
                      allowedRoles={['admin', 'employee', 'motoboy', 'tesoureiro', 'analista', 'cozinheira']} 
                    />
                  } 
                />
                
                {/* Admin routes */}
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
                
                {/* Employee routes - Permitir qualquer funcionário, não apenas com role "employee" */}
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
                
                {/* Motoboy routes */}
                <Route 
                  path="/motoboy" 
                  element={<ProtectedRoute element={<MotoboyPanel />} allowedRoles={['motoboy']} />} 
                />
                
                {/* Customer routes */}
                <Route 
                  path="/" 
                  element={<ProtectedRoute element={<CustomerDashboard />} allowedRoles={['customer']} />} 
                />
                {/* Add cliente route as an alias to the home route for backward compatibility */}
                <Route 
                  path="/cliente" 
                  element={<Navigate to="/" replace />} 
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
                
                {/* Catch all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              <Toaster />
              <Sonner />
            </BrowserRouter>
          </TooltipProvider>
        </HelmetProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
