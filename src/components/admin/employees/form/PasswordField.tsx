
import React from 'react';
import { Clipboard } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { EmployeeFormValues } from '../EmployeeFormDialog';

interface PasswordFieldProps {
  form: UseFormReturn<EmployeeFormValues>;
  generatedPassword: string;
  setGeneratedPassword: React.Dispatch<React.SetStateAction<string>>;
  generatePassword: () => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ 
  form, 
  generatedPassword, 
  generatePassword,
  setGeneratedPassword 
}) => {
  // Copy password to clipboard
  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword);
    toast({
      title: 'Senha copiada!',
      description: 'A senha foi copiada para a área de transferência.',
    });
  };

  return (
    <div className="space-y-2">
      <FormLabel>Senha Temporária</FormLabel>
      <div className="flex items-center space-x-2">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <div className="flex">
                  <Input
                    type="text"
                    placeholder="Senha temporária"
                    {...field}
                    value={generatedPassword || field.value}
                    readOnly
                  />
                  {generatedPassword && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={copyPasswordToClipboard}
                      className="ml-2"
                    >
                      <Clipboard className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="button" onClick={generatePassword}>
          Gerar Senha
        </Button>
      </div>
      <FormDescription>
        Gere uma senha temporária para o primeiro acesso do funcionário.
      </FormDescription>
    </div>
  );
};

export default PasswordField;
