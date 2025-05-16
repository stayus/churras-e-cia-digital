
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

// Types for our auth context
export type UserRole = 'admin' | 'employee' | 'motoboy' | 'customer';

export interface UserData {
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
  email_confirmed_at?: string | null;
}

interface AuthContextType {
  user: UserData | null;
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
  const [user, setUser] = useState<UserData | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is already logged in
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state change:", event, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          // If using Supabase Auth directly
          const userData: UserData = {
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Cliente',
            role: 'customer',
            email: session.user.email,
            email_confirmed_at: session.user.email_confirmed_at
          };
          
          setUser(userData);
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Existing session:", session?.user?.id);
      setSession(session);
      
      if (session?.user) {
        // If using Supabase Auth directly
        const userData: UserData = {
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Cliente',
          role: 'customer',
          email: session.user.email,
          email_confirmed_at: session.user.email_confirmed_at
        };
        
        setUser(userData);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (credentialType: 'email' | 'username', credential: string, password: string) => {
    setIsLoading(true);
    try {
      if (credentialType === 'email') {
        // Customer login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credential,
          password: password,
        });
        
        if (error) throw error;
        
        if (!data.user.email_confirmed_at) {
          throw new Error("Email not confirmed");
        }
        
        const userData: UserData = {
          id: data.user.id,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Cliente',
          role: 'customer',
          email: data.user.email,
          email_confirmed_at: data.user.email_confirmed_at
        };
        
        setUser(userData);
        return;
      } else {
        // Employee login with username - use the login edge function
        const { data, error } = await supabase.functions.invoke('login', {
          body: {
            credential,
            credentialType,
            password,
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
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setSession(null);
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
      isAuthenticated: !!user && !!user.email_confirmed_at,
      isLoading,
      login,
      logout,
      updatePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}
