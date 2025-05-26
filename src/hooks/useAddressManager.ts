
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CustomerAddress {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  is_default: boolean;
}

export const useAddressManager = () => {
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      
      // Get current user from Supabase Auth
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.log('No authenticated user found');
        setAddresses([]);
        return;
      }
      
      const { data, error } = await supabase
        .from('customer_addresses')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching addresses:', error);
        throw error;
      }
      
      setAddresses(data || []);
    } catch (error: any) {
      console.error('Error fetching addresses:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os endereços"
      });
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (addressData: Omit<CustomerAddress, 'id' | 'is_default'>) => {
    try {
      // Get current user from Supabase Auth
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('Usuário não autenticado');
      }
      
      const { data, error } = await supabase
        .from('customer_addresses')
        .insert({
          ...addressData,
          customer_id: user.id,
          is_default: addresses.length === 0 // First address is default
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error adding address:', error);
        throw error;
      }
      
      setAddresses(prev => [data, ...prev]);
      
      toast({
        title: "Endereço adicionado",
        description: "Seu endereço foi salvo com sucesso"
      });
      
      return data;
    } catch (error: any) {
      console.error('Error adding address:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível salvar o endereço"
      });
      throw error;
    }
  };

  const updateAddress = async (addressId: string, addressData: Partial<CustomerAddress>) => {
    try {
      // Get current user from Supabase Auth
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('Usuário não autenticado');
      }
      
      const { data, error } = await supabase
        .from('customer_addresses')
        .update(addressData)
        .eq('id', addressId)
        .eq('customer_id', user.id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating address:', error);
        throw error;
      }
      
      setAddresses(prev => prev.map(addr => 
        addr.id === addressId ? { ...addr, ...data } : addr
      ));
      
      toast({
        title: "Endereço atualizado",
        description: "Seu endereço foi atualizado com sucesso"
      });
      
      return data;
    } catch (error: any) {
      console.error('Error updating address:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o endereço"
      });
      throw error;
    }
  };

  const deleteAddress = async (addressId: string) => {
    try {
      // Get current user from Supabase Auth
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('Usuário não autenticado');
      }
      
      const { error } = await supabase
        .from('customer_addresses')
        .delete()
        .eq('id', addressId)
        .eq('customer_id', user.id);
        
      if (error) {
        console.error('Error deleting address:', error);
        throw error;
      }
      
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      
      toast({
        title: "Endereço excluído",
        description: "O endereço foi removido com sucesso"
      });
    } catch (error: any) {
      console.error('Error deleting address:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir o endereço"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return {
    addresses,
    loading,
    addAddress,
    updateAddress,
    deleteAddress,
    refetch: fetchAddresses
  };
};
