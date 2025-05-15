
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PasswordGeneratorProps {
  password: string;
  setPassword: (password: string) => void;
  generatePassword: () => string;
  disabled?: boolean;
}

const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({
  password,
  setPassword,
  generatePassword,
  disabled = false
}) => {
  const generateAndSetPassword = () => {
    const newPassword = generatePassword();
    console.log('Generated password:', newPassword); // Log the generated password
    setPassword(newPassword);
  };

  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(password);
    toast({
      title: 'Senha copiada',
      description: 'A senha foi copiada para a área de transferência.'
    });
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="password">Senha Temporária *</Label>
      <div className="flex gap-2">
        <Input
          id="password"
          value={password}
          readOnly
          placeholder="Clique em 'Gerar Senha'"
          disabled={disabled}
        />
        <Button
          type="button"
          variant="outline"
          onClick={generateAndSetPassword}
          className="whitespace-nowrap"
          disabled={disabled}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Gerar Senha
        </Button>
        {password && (
          <Button
            type="button"
            variant="outline"
            onClick={copyPasswordToClipboard}
            disabled={disabled}
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copiar</span>
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Uma senha temporária será gerada para o primeiro acesso.
      </p>
    </div>
  );
};

export default PasswordGenerator;
