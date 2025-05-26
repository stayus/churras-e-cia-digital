import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Plus, Pencil, Trash, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Address } from '@/contexts/CartContext';
import { Json } from '@/integrations/supabase/types';

interface AddressSelectorProps {
  userId: string;
  onAddressSelected: (addressId: string | null) => void;
  selectedAddressId: string | null;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({ 
  userId, 
  onAddressSelected,
  selectedAddressId 
}) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    street: '',
    number: '',
    city: '',
    zip: '',
    complement: '',
    label: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Carregar endereços do usuário
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('customers')
          .select('addresses')
          .eq('id', userId)
          .single();
          
        if (error) throw error;
        
        // Type cast the JSON data to Address[]
        const addressList = data?.addresses ? (data.addresses as any as Address[]) : [];
        setAddresses(addressList);
        
        // Se houver endereços e nenhum foi selecionado, selecione o primeiro
        if (addressList.length > 0 && !selectedAddressId) {
          onAddressSelected(addressList[0].id);
        }
        
      } catch (error) {
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
    
    fetchAddresses();
  }, [userId, selectedAddressId, onAddressSelected]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Aplicar máscara para o CEP
    if (name === 'zip') {
      let formattedZip = value.replace(/\D/g, '');
      if (formattedZip.length > 5) {
        formattedZip = `${formattedZip.substring(0, 5)}-${formattedZip.substring(5, 8)}`;
      }
      setFormData({ ...formData, [name]: formattedZip });
      return;
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleAddAddress = () => {
    setFormData({
      street: '',
      number: '',
      city: '',
      zip: '',
      complement: '',
      label: 'Casa'
    });
    setIsAddDialogOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setCurrentAddress(address);
    setFormData({
      street: address.street,
      number: address.number,
      city: address.city,
      zip: address.zip,
      complement: address.complement || '',
      label: address.label || ''
    });
    setIsEditDialogOpen(true);
  };

  const saveAddress = async () => {
    if (!formData.street || !formData.number || !formData.city || !formData.zip) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios"
      });
      return;
    }

    try {
      setSubmitting(true);
      
      // Consultar endereços atuais
      const { data, error } = await supabase
        .from('customers')
        .select('addresses')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      let updatedAddresses = [...((data?.addresses as any) as Address[] || [])];
      
      // Adicionar ou atualizar endereço
      const newAddress: Address = {
        id: currentAddress?.id || `addr_${Date.now()}`,
        street: formData.street,
        number: formData.number,
        city: formData.city,
        state: 'CE', // Default state
        zip: formData.zip,
        zipCode: formData.zip, // Same as zip for compatibility
        complement: formData.complement || undefined,
        label: formData.label || undefined
      };
      
      if (isEditDialogOpen && currentAddress) {
        // Atualizar endereço existente
        updatedAddresses = updatedAddresses.map(addr => 
          addr.id === currentAddress.id ? newAddress : addr
        );
      } else {
        // Adicionar novo endereço
        updatedAddresses.push(newAddress);
      }
      
      // Salvar no banco de dados - Cast Address[] to Json for Supabase
      const { error: updateError } = await supabase
        .from('customers')
        .update({
          addresses: updatedAddresses as unknown as Json
        })
        .eq('id', userId);
        
      if (updateError) throw updateError;
      
      setAddresses(updatedAddresses);
      toast({
        title: isEditDialogOpen ? "Endereço atualizado" : "Endereço adicionado",
        description: "Seu endereço foi salvo com sucesso"
      });
      
      // Selecionar o novo endereço
      onAddressSelected(newAddress.id);
      
      // Fechar diálogos
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar o endereço"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteAddress = async (addressId: string) => {
    if (!confirm('Tem certeza que deseja excluir este endereço?')) {
      return;
    }
    
    try {
      // Consultar endereços atuais
      const { data, error } = await supabase
        .from('customers')
        .select('addresses')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      const currentAddresses = (data?.addresses as any) as Address[] || [];
      const updatedAddresses = currentAddresses.filter(addr => addr.id !== addressId);
      
      // Salvar no banco de dados
      const { error: updateError } = await supabase
        .from('customers')
        .update({
          addresses: updatedAddresses as unknown as Json
        })
        .eq('id', userId);
        
      if (updateError) throw updateError;
      
      setAddresses(updatedAddresses);
      
      // Se o endereço excluído era o selecionado
      if (selectedAddressId === addressId) {
        onAddressSelected(updatedAddresses.length > 0 ? updatedAddresses[0].id : null);
      }
      
      toast({
        title: "Endereço excluído",
        description: "O endereço foi removido com sucesso"
      });
      
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir o endereço"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {addresses.length === 0 ? (
        <div className="text-center p-6">
          <p className="text-muted-foreground mb-4">
            Você ainda não tem endereços cadastrados
          </p>
          <Button onClick={handleAddAddress}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar endereço
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {addresses.map((address) => (
              <Card 
                key={address.id}
                className={`cursor-pointer transition-colors ${selectedAddressId === address.id ? 'border-primary' : 'hover:border-gray-300'}`}
                onClick={() => onAddressSelected(address.id)}
              >
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex-1">
                    {address.label && (
                      <p className="font-medium text-sm text-gray-500">{address.label}</p>
                    )}
                    <p>{address.street}, {address.number}</p>
                    <p className="text-sm text-muted-foreground">
                      {address.city} - CEP {address.zip}
                    </p>
                    {address.complement && (
                      <p className="text-sm text-muted-foreground">
                        {address.complement}
                      </p>
                    )}
                  </div>
                  
                  <div className="ml-4 flex items-center space-x-2">
                    {selectedAddressId === address.id && (
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                    
                    <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditAddress(address)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => deleteAddress(address.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Button variant="outline" onClick={handleAddAddress} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar novo endereço
          </Button>
        </>
      )}
      
      {/* Diálogo de adicionar endereço */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar endereço</DialogTitle>
            <DialogDescription>
              Preencha os dados do seu novo endereço
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="label">Nome do endereço (opcional)</Label>
                <Input
                  id="label"
                  name="label"
                  placeholder="Ex.: Casa, Trabalho"
                  value={formData.label}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <Label htmlFor="street">Rua / Avenida *</Label>
                  <Input
                    id="street"
                    name="street"
                    required
                    placeholder="Nome da rua"
                    value={formData.street}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="number">Número *</Label>
                  <Input
                    id="number"
                    name="number"
                    required
                    placeholder="123"
                    value={formData.number}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  name="complement"
                  placeholder="Apto, bloco, referência"
                  value={formData.complement}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="city">Cidade *</Label>
                  <Input
                    id="city"
                    name="city"
                    required
                    placeholder="Nome da cidade"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="zip">CEP *</Label>
                  <Input
                    id="zip"
                    name="zip"
                    required
                    placeholder="00000-000"
                    value={formData.zip}
                    onChange={handleInputChange}
                    maxLength={9}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveAddress} disabled={submitting}>
              {submitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de editar endereço */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar endereço</DialogTitle>
            <DialogDescription>
              Atualize os dados do seu endereço
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="edit-label">Nome do endereço (opcional)</Label>
                <Input
                  id="edit-label"
                  name="label"
                  placeholder="Ex.: Casa, Trabalho"
                  value={formData.label}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <Label htmlFor="edit-street">Rua / Avenida *</Label>
                  <Input
                    id="edit-street"
                    name="street"
                    required
                    placeholder="Nome da rua"
                    value={formData.street}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-number">Número *</Label>
                  <Input
                    id="edit-number"
                    name="number"
                    required
                    placeholder="123"
                    value={formData.number}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-complement">Complemento</Label>
                <Input
                  id="edit-complement"
                  name="complement"
                  placeholder="Apto, bloco, referência"
                  value={formData.complement}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="edit-city">Cidade *</Label>
                  <Input
                    id="edit-city"
                    name="city"
                    required
                    placeholder="Nome da cidade"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-zip">CEP *</Label>
                  <Input
                    id="edit-zip"
                    name="zip"
                    required
                    placeholder="00000-000"
                    value={formData.zip}
                    onChange={handleInputChange}
                    maxLength={9}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveAddress} disabled={submitting}>
              {submitting ? "Salvando..." : "Atualizar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddressSelector;
