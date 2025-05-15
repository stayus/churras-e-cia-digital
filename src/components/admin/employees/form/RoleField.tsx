
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { EmployeeFormValues } from '../EmployeeFormDialog';

interface RoleFieldProps {
  form: UseFormReturn<EmployeeFormValues>;
}

const RoleField: React.FC<RoleFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="role"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Cargo</FormLabel>
          <FormControl>
            <Input 
              placeholder="Digite o cargo do funcionário"
              {...field}
            />
          </FormControl>
          <FormDescription>
            Digite o cargo do funcionário (ex: Administrador, Atendente)
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RoleField;
