
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Employee } from '@/types/dashboard';

interface EmployeePermissionsProps {
  permissions: Employee['permissions'];
  handlePermissionChange: (permission: keyof Employee['permissions'], checked: boolean) => void;
  disabled?: boolean;
}

const EmployeePermissions: React.FC<EmployeePermissionsProps> = ({ 
  permissions,
  handlePermissionChange,
  disabled = false
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Permissões</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="permission-status"
            checked={permissions?.changeOrderStatus || false}
            onCheckedChange={(checked) => 
              handlePermissionChange('changeOrderStatus', checked === true)
            }
            disabled={disabled}
          />
          <Label htmlFor="permission-status">Alterar status do pedido</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="permission-stock"
            checked={permissions?.manageStock || false}
            onCheckedChange={(checked) => 
              handlePermissionChange('manageStock', checked === true)
            }
            disabled={disabled}
          />
          <Label htmlFor="permission-stock">Alterar status do produto</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="permission-reports"
            checked={permissions?.viewReports || false}
            onCheckedChange={(checked) => 
              handlePermissionChange('viewReports', checked === true)
            }
            disabled={disabled}
          />
          <Label htmlFor="permission-reports">Visualizar relatório de vendas do dia</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="permission-export"
            checked={permissions?.exportOrderReportPDF || false}
            onCheckedChange={(checked) => 
              handlePermissionChange('exportOrderReportPDF', checked === true)
            }
            disabled={disabled}
          />
          <Label htmlFor="permission-export">Exportação de relatório em PDF</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="permission-promotion"
            checked={permissions?.promotionProducts || false}
            onCheckedChange={(checked) => 
              handlePermissionChange('promotionProducts', checked === true)
            }
            disabled={disabled}
          />
          <Label htmlFor="permission-promotion">Colocar produtos em promoção</Label>
        </div>
      </div>
    </div>
  );
};

export default EmployeePermissions;
