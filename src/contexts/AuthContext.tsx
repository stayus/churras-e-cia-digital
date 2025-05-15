
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
    exportOrderReportPDF?: boolean;
    promotionProducts?: boolean;
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
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            console.log('Stored user found:', parsedUser);
            setUser(parsedUser);
          } catch (error) {
            console.error('Failed to parse stored user:', error);
            // Clear invalid storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } else {
          console.log('No stored user found');
        }
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentialType: 'email' | 'username', credential: string, password: string) => {
    setIsLoading(true);
    try {
      // Ensure credentials are trimmed
      const trimmedCredential = credential.trim();
      const trimmedPassword = password.trim();
      
      console.log(`Calling login edge function with ${credentialType}:`, trimmedCredential);
      
      // Call the Supabase Edge Function for login
      const { data, error } = await supabase.functions.invoke('login', {
        body: {
          credential: trimmedCredential,
          credentialType,
          password: trimmedPassword,
        },
      });
      
      if (error) {
        console.error('Login error:', error);
        throw new Error(error.message || 'Login failed');
      }
      
      if (!data || !data.success) {
        console.error('Login failed:', data?.error || 'Unknown error');
        throw new Error(data?.error || 'Login failed');
      }
      
      console.log('Login successful, response data:', data);
      
      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      return;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updatePassword = async (oldPassword: string, newPassword: string) => {
    if (!user) throw new Error('No user is logged in');
    
    setIsLoading(true);
    try {
      // Call the Supabase Edge Function to update password
      const { data, error } = await supabase.functions.invoke('update-password', {
        body: {
          userId: user.id,
          oldPassword,
          newPassword,
          userType: user.role === 'customer' ? 'customers' : 'employees',
        },
      });
      
      if (error || !data?.success) {
        throw new Error(data?.error || 'Failed to update password');
      }
      
      // Update the local user state if isFirstLogin was true before
      if (user.isFirstLogin) {
        const updatedUser = { ...user, isFirstLogin: false };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Password update failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
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
