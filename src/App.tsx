
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

// Pages
import LoginPage from "@/pages/Login";
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
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redirect based on user role
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'employee') {
      return <Navigate to="/employee" replace />;
    } else if (user.role === 'motoboy') {
      return <Navigate to="/motoboy" replace />;
    } else {
      return <Navigate to="/" replace />;
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
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/employee-login" element={<EmployeeLoginPage />} />
              
              {/* Protected routes with role-based access */}
              <Route 
                path="/change-password" 
                element={
                  <ProtectedRoute 
                    element={<PasswordChangePage />} 
                    allowedRoles={['admin', 'employee', 'motoboy']} 
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
                path="/admin/configuracoes" 
                element={<ProtectedRoute element={<AdminSettings />} allowedRoles={['admin']} />} 
              />
              <Route 
                path="/admin/pedidos" 
                element={<ProtectedRoute element={<AdminOrders />} allowedRoles={['admin']} />} 
              />
              
              {/* Employee routes */}
              <Route 
                path="/employee" 
                element={<ProtectedRoute element={<EmployeePanel />} allowedRoles={['employee']} />} 
              />
              
              {/* Motoboy routes */}
              <Route 
                path="/motoboy" 
                element={<ProtectedRoute element={<MotoboyPanel />} allowedRoles={['motoboy']} />} 
              />
              
              {/* Customer routes */}
              <Route 
                path="/" 
                element={<HomePage />} 
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
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
