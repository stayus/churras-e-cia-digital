
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Plus, Pencil, Trash, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CustomerAddress, useAddressManager } from '@/hooks/useAddressManager';

interface NewAddressSelectorProps {
  userId: string;
  onAddressSelected: (address: CustomerAddress | null) => void;
  selectedAddress: CustomerAddress | null;
}

const NewAddressSelector: React.FC<NewAddressSelectorProps> = ({ 
  userId, 
  onAddressSelected,
  selectedAddress 
}) => {
  const { addresses, loading, addAddress, updateAddress, deleteAddress } = useAddressManager(userId);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<CustomerAddress | null>(null);
  const [formData, setFormData] = useState({
    street: '',
    number: '',
    city: '',
    state: 'CE',
    zip_code: '',
    complement: '',
    neighborhood: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Aplicar máscara para o CEP
    if (name === 'zip_code') {
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
      state: 'CE',
      zip_code: '',
      complement: '',
      neighborhood: ''
    });
    setIsAddDialogOpen(true);
  };

  const handleEditAddress = (address: CustomerAddress) => {
    setCurrentAddress(address);
    setFormData({
      street: address.street,
      number: address.number,
      city: address.city,
      state: address.state,
      zip_code: address.zip_code,
      complement: address.complement || '',
      neighborhood: address.neighborhood
    });
    setIsEditDialogOpen(true);
  };

  const saveAddress = async () => {
    if (!formData.street || !formData.number || !formData.city || !formData.zip_code || !formData.neighborhood) {
      return;
    }

    try {
      setSubmitting(true);
      
      const addressData = {
        street: formData.street,
        number: formData.number,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        complement: formData.complement || undefined,
        neighborhood: formData.neighborhood
      };
      
      let savedAddress;
      
      if (isEditDialogOpen && currentAddress) {
        savedAddress = await updateAddress(currentAddress.id, addressData);
      } else {
        savedAddress = await addAddress(addressData);
      }
      
      // Select the new/updated address
      if (savedAddress) {
        onAddressSelected(savedAddress);
      }
      
      // Close dialogs
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Tem certeza que deseja excluir este endereço?')) {
      return;
    }
    
    try {
      await deleteAddress(addressId);
      
      // If the deleted address was selected, clear selection
      if (selectedAddress?.id === addressId) {
        onAddressSelected(null);
      }
    } catch (error) {
      // Error is handled in the hook
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
                className={`cursor-pointer transition-colors ${selectedAddress?.id === address.id ? 'border-primary' : 'hover:border-gray-300'}`}
                onClick={() => onAddressSelected(address)}
              >
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex-1">
                    <p>{address.street}, {address.number}</p>
                    <p className="text-sm text-muted-foreground">
                      {address.neighborhood}, {address.city} - {address.state}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      CEP {address.zip_code}
                    </p>
                    {address.complement && (
                      <p className="text-sm text-muted-foreground">
                        {address.complement}
                      </p>
                    )}
                  </div>
                  
                  <div className="ml-4 flex items-center space-x-2">
                    {selectedAddress?.id === address.id && (
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
                        onClick={() => handleDeleteAddress(address.id)}
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
      
      {/* Add Address Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar endereço</DialogTitle>
            <DialogDescription>
              Preencha os dados do seu novo endereço
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
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
              <Label htmlFor="neighborhood">Bairro *</Label>
              <Input
                id="neighborhood"
                name="neighborhood"
                required
                placeholder="Nome do bairro"
                value={formData.neighborhood}
                onChange={handleInputChange}
              />
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
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  maxLength={2}
                />
              </div>
              
              <div>
                <Label htmlFor="zip_code">CEP *</Label>
                <Input
                  id="zip_code"
                  name="zip_code"
                  required
                  placeholder="00000-000"
                  value={formData.zip_code}
                  onChange={handleInputChange}
                  maxLength={9}
                />
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
      
      {/* Edit Address Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar endereço</DialogTitle>
            <DialogDescription>
              Atualize os dados do seu endereço
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
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
              <Label htmlFor="edit-neighborhood">Bairro *</Label>
              <Input
                id="edit-neighborhood"
                name="neighborhood"
                required
                placeholder="Nome do bairro"
                value={formData.neighborhood}
                onChange={handleInputChange}
              />
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
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                <Label htmlFor="edit-state">Estado</Label>
                <Input
                  id="edit-state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  maxLength={2}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-zip_code">CEP *</Label>
                <Input
                  id="edit-zip_code"
                  name="zip_code"
                  required
                  placeholder="00000-000"
                  value={formData.zip_code}
                  onChange={handleInputChange}
                  maxLength={9}
                />
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

export default NewAddressSelector;
