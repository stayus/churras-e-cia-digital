
import React from 'react';
import { FormDescription } from '@/components/ui/form';

interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ 
  title, 
  description, 
  children 
}) => {
  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-lg font-medium">{title}</h3>
      )}
      {description && (
        <FormDescription>
          {description}
        </FormDescription>
      )}
      {children}
    </div>
  );
};

export default FormSection;
