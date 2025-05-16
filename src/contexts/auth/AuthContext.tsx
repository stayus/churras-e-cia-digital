
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { AuthContextType, UserData } from './types';
import { loginWithEmail, loginWithUsername, logoutUser, updateUserPassword } from './authOperations';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
        const userData = await loginWithEmail(credential, password);
        setUser(userData);
      } else {
        // Employee login with username
        const userData = await loginWithUsername(credential, password);
        setUser(userData);
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setSession(null);
  };

  const updatePassword = async (oldPassword: string, newPassword: string) => {
    if (!user) throw new Error('No user is logged in');
    
    setIsLoading(true);
    try {
      await updateUserPassword(user.id, oldPassword, newPassword, user.role);
      
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

  const resendEmailConfirmation = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: window.location.origin + '/email-confirmado'
        }
      });
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Failed to resend confirmation email:', error);
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
      updatePassword,
      resendEmailConfirmation
    }}>
      {children}
    </AuthContext.Provider>
  );
}
