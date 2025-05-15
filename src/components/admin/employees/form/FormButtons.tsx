
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormButtonsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isNew: boolean;
}

const FormButtons: React.FC<FormButtonsProps> = ({
  onCancel,
  isSubmitting,
  isNew
}) => {
  return (
    <div className="flex justify-end space-x-4 pt-4">
      <Button variant="outline" type="button" onClick={onCancel}>
        Cancelar
      </Button>
      <Button 
        type="submit" 
        className="bg-red-600 hover:bg-red-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Salvando...' : isNew ? 'Adicionar Funcionário' : 'Salvar Alterações'}
      </Button>
    </div>
  );
};

export default FormButtons;
