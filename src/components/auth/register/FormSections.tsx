
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormData } from './registerSchema';

interface FormSectionProps {
  form: UseFormReturn<RegisterFormData>;
  isLoading: boolean;
}

export const PersonalInfoSection: React.FC<FormSectionProps> = ({ form, isLoading }) => {
  // Mascarar o campo de data de nascimento
  const handleBirthDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 0) {
      value = value.substring(0, 8);
      if (value.length > 4) {
        value = `${value.substring(0, 2)}/${value.substring(2, 4)}/${value.substring(4)}`;
      } else if (value.length > 2) {
        value = `${value.substring(0, 2)}/${value.substring(2)}`;
      }
    }
    form.setValue('birthDate', value);
  };

  return (
    <>
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome Completo</FormLabel>
            <FormControl>
              <Input placeholder="Digite seu nome completo" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="seu@email.com" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="birthDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de Nascimento</FormLabel>
            <FormControl>
              <Input 
                placeholder="DD/MM/AAAA" 
                {...field} 
                onChange={handleBirthDateChange}
                disabled={isLoading} 
              />
            </FormControl>
            <FormDescription>
              Digite sua data de nascimento no formato DD/MM/AAAA
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export const AddressSection: React.FC<FormSectionProps> = ({ form, isLoading }) => {
  // Mascarar o campo de CEP
  const handleZipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 0) {
      value = value.substring(0, 8);
      if (value.length > 5) {
        value = `${value.substring(0, 5)}-${value.substring(5)}`;
      }
    }
    form.setValue('zip', value);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input placeholder="Rua / Avenida" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input placeholder="Número" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input placeholder="Cidade" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="zip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP</FormLabel>
              <FormControl>
                <Input 
                  placeholder="00000-000" 
                  {...field} 
                  onChange={handleZipChange}
                  disabled={isLoading} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export const PasswordSection: React.FC<FormSectionProps> = ({ form, isLoading }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Senha</FormLabel>
            <FormControl>
              <Input type="password" placeholder="********" {...field} disabled={isLoading} />
            </FormControl>
            <FormDescription>
              Mínimo 8 caracteres com letra maiúscula, número e caractere especial
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirme sua Senha</FormLabel>
            <FormControl>
              <Input type="password" placeholder="********" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
