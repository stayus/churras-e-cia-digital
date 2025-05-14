
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types for our auth context
export type UserRole = 'admin' | 'employee' | 'motoboy' | 'customer';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  username?: string;
  registration_number?: string;
  permissions?: {
    manageStock: boolean;
    viewReports: boolean;
    changeOrderStatus: boolean;
  };
  isFirstLogin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentialType: 'email' | 'username', credential: string, password: string) => Promise<void>;
  logout: () => void;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Here we would typically check for a JWT in localStorage and validate it
        // For now we'll just simulate checking auth status
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function - in the real app this would call the Supabase edge function
  const login = async (credentialType: 'email' | 'username', credential: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would call the Supabase login edge function
      // For now, we'll simulate a successful login

      // This is just for demo purposes - in a real app we'd get this from the API
      let mockUser: User;
      
      if (credentialType === 'username' && credential === 'admin' && password === 'Churr@squinhoAdm2025') {
        mockUser = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Administrador',
          role: 'admin',
          username: 'admin',
          registration_number: 'MC-0000',
          permissions: {
            manageStock: true,
            viewReports: true,
            changeOrderStatus: true,
          }
        };
      } else {
        // For demo purposes, create a mock user based on the login type
        mockUser = {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: credentialType === 'email' ? 'Cliente Teste' : 'Funcionário Teste',
          role: credentialType === 'email' ? 'customer' : 'employee',
          ...(credentialType === 'email' ? { email: credential } : { username: credential }),
          ...(credentialType !== 'email' && {
            registration_number: 'MC-0001',
            permissions: {
              manageStock: false,
              viewReports: false,
              changeOrderStatus: true,
            },
            isFirstLogin: true
          })
        };
      }
      
      // Store the user in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Update password function
  const updatePassword = async (oldPassword: string, newPassword: string) => {
    // This would call the Supabase edge function to update the password
    try {
      // Simulate password update
      if (user) {
        const updatedUser = { ...user, isFirstLogin: false };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Password update failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      updatePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}
