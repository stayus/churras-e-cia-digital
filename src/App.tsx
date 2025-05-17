
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/auth";
import { CartProvider } from "@/contexts/cart";

// Route imports
import AdminRoutes from "./routes/AdminRoutes";
import EmployeeRoutes from "./routes/EmployeeRoutes";
import MotoboyRoutes from "./routes/MotoboyRoutes";
import CustomerRoutes from "./routes/CustomerRoutes";
import PublicRoutes from "./routes/PublicRoutes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <HelmetProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                <PublicRoutes />
                <AdminRoutes />
                <EmployeeRoutes />
                <MotoboyRoutes />
                <CustomerRoutes />
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
