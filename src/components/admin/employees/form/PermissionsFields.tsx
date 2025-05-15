
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { EmployeeFormValues } from '../EmployeeFormDialog';

interface PermissionsFieldsProps {
  form: UseFormReturn<EmployeeFormValues>;
}

const PermissionsFields: React.FC<PermissionsFieldsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
      <FormField
        control={form.control}
        name="permissions.manageStock"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className="font-normal">
              Alterar status do produto
            </FormLabel>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="permissions.viewReports"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className="font-normal">
              Visualizar relatório de vendas do dia
            </FormLabel>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="permissions.changeOrderStatus"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className="font-normal">
              Alterar status de pedidos
            </FormLabel>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="permissions.exportOrderReportPDF"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className="font-normal">
              Exportação de relatório em PDF
            </FormLabel>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="permissions.promotionProducts"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className="font-normal">
              Colocar produtos em promoção
            </FormLabel>
          </FormItem>
        )}
      />
    </div>
  );
};

export default PermissionsFields;
