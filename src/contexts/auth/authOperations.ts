
import { supabase } from '@/integrations/supabase/client';
import { UserData } from './types';

export async function loginWithEmail(email: string, password: string): Promise<UserData> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  
  if (error) throw error;
  
  if (!data.user.email_confirmed_at) {
    localStorage.setItem('confirmationEmail', email);
    throw new Error("Email não confirmado. Por favor, verifique seu email para ativar sua conta.");
  }
  
  const userData: UserData = {
    id: data.user.id,
    name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Cliente',
    role: 'customer',
    email: data.user.email,
    email_confirmed_at: data.user.email_confirmed_at
  };
  
  return userData;
}

export async function loginWithUsername(username: string, password: string): Promise<UserData> {
  const { data, error } = await supabase.functions.invoke('login', {
    body: {
      credential: username,
      credentialType: 'username',
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
  
  // Store token in localStorage
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  return data.user;
}

export async function logoutUser() {
  await supabase.auth.signOut();
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export async function updateUserPassword(userId: string, oldPassword: string, newPassword: string, userRole: string) {
  // Call the Supabase Edge Function to update password
  const { data, error } = await supabase.functions.invoke('update-password', {
    body: {
      userId,
      oldPassword,
      newPassword,
      userType: userRole === 'customer' ? 'customers' : 'employees',
    },
  });
  
  if (error || !data?.success) {
    throw new Error(data?.error || 'Failed to update password');
  }
  
  return data;
}
