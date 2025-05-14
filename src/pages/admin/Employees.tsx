
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserPlus, Search, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/AdminSidebar';
import EmployeeFormDialog from '@/components/EmployeeFormDialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Employee {
  id: string;
  name: string;
  username: string;
  registration_number: string;
  role: string;
  cpf?: string;
  phone?: string;
  birth_date?: Date;
  pix_key?: string;
  permissions: {
    manageStock: boolean;
    viewReports: boolean;
    changeOrderStatus: boolean;
  };
  created_at: string;
}

// Mock data for employee list
const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Administrador',
    username: 'admin',
    registration_number: 'MC-0000',
    role: 'admin',
    permissions: {
      manageStock: true,
      viewReports: true,
      changeOrderStatus: true,
    },
    created_at: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'João Silva',
    username: 'joaosilva',
    registration_number: 'MC-0001',
    role: 'atendente',
    cpf: '123.456.789-00',
    phone: '(11) 98765-4321',
    birth_date: new Date('1990-01-15'),
    permissions: {
      manageStock: true,
      viewReports: false,
      changeOrderStatus: true,
    },
    created_at: '2023-01-15T00:00:00Z',
  },
  {
    id: '3',
    name: 'Maria Oliveira',
    username: 'mariaoliveira',
    registration_number: 'MC-0002',
    role: 'cozinheiro',
    phone: '(11) 91234-5678',
    permissions: {
      manageStock: true,
      viewReports: false,
      changeOrderStatus: false,
    },
    created_at: '2023-02-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Pedro Santos',
    username: 'pedrosantos',
    registration_number: 'MC-0003',
    role: 'motoboy',
    cpf: '987.654.321-00',
    permissions: {
      manageStock: false,
      viewReports: false,
      changeOrderStatus: true,
    },
    created_at: '2023-02-15T00:00:00Z',
  },
];

const AdminEmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewEmployeeDialogOpen, setIsNewEmployeeDialogOpen] = useState(false);
  const [isEditEmployeeDialogOpen, setIsEditEmployeeDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  const navigate = useNavigate();

  // Filter employees based on search term
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.registration_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle new employee creation
  const handleCreateEmployee = (data: any) => {
    // Generate a new registration number
    const lastRegNumber = Math.max(
      ...employees.map((e) => parseInt(e.registration_number.substring(3))),
      0
    );
    const newRegNumber = `MC-${String(lastRegNumber + 1).padStart(4, '0')}`;

    // Create new employee
    const newEmployee: Employee = {
      id: Date.now().toString(),
      name: data.name,
      username: data.username,
      registration_number: newRegNumber,
      role: data.role,
      cpf: data.cpf,
      phone: data.phone,
      birth_date: data.birth_date,
      pix_key: data.pix_key,
      permissions: data.permissions,
      created_at: new Date().toISOString(),
    };

    // Add to employee list
    setEmployees([...employees, newEmployee]);
    setIsNewEmployeeDialogOpen(false);
    
    toast({
      title: 'Funcionário cadastrado!',
      description: `${newEmployee.name} foi adicionado com sucesso.`,
    });
  };

  // Handle employee update
  const handleUpdateEmployee = (data: any) => {
    if (!selectedEmployee) return;

    const updatedEmployees = employees.map((employee) => {
      if (employee.id === selectedEmployee.id) {
        return {
          ...employee,
          name: data.name,
          username: data.username,
          role: data.role,
          cpf: data.cpf,
          phone: data.phone,
          birth_date: data.birth_date,
          pix_key: data.pix_key,
          permissions: data.permissions,
        };
      }
      return employee;
    });

    setEmployees(updatedEmployees);
    setIsEditEmployeeDialogOpen(false);
    setSelectedEmployee(null);
    
    toast({
      title: 'Funcionário atualizado!',
      description: `As informações de ${data.name} foram atualizadas com sucesso.`,
    });
  };

  // Handle employee deletion
  const handleDeleteEmployee = () => {
    if (!selectedEmployee) return;

    // Don't allow deletion of admin (ID 1)
    if (selectedEmployee.username === 'admin') {
      toast({
        variant: 'destructive',
        title: 'Operação não permitida',
        description: 'Não é possível excluir o administrador principal.',
      });
      setIsDeleteDialogOpen(false);
      setSelectedEmployee(null);
      return;
    }

    const updatedEmployees = employees.filter(
      (employee) => employee.id !== selectedEmployee.id
    );

    setEmployees(updatedEmployees);
    setIsDeleteDialogOpen(false);
    setSelectedEmployee(null);
    
    toast({
      title: 'Funcionário excluído!',
      description: `${selectedEmployee.name} foi removido com sucesso.`,
    });
  };

  // Format role to a more readable format
  const formatRole = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'atendente':
        return 'Atendente';
      case 'cozinheiro':
        return 'Cozinheiro';
      case 'motoboy':
        return 'Motoboy';
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Funcionários</h1>
            <p className="text-gray-600">Gerenciamento de funcionários do Churrasquinho & Cia</p>
          </div>
          
          <Button onClick={() => setIsNewEmployeeDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Funcionário
          </Button>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center">
              <Search className="h-4 w-4 mr-2 text-gray-400" />
              <Input
                placeholder="Buscar funcionários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Permissões</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <User className="h-12 w-12 mb-2" />
                          <p>Nenhum funcionário encontrado</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>{employee.username}</TableCell>
                        <TableCell>{employee.registration_number}</TableCell>
                        <TableCell>{formatRole(employee.role)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1 text-xs">
                            {employee.permissions.manageStock && (
                              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                Gerenciar Estoque
                              </span>
                            )}
                            {employee.permissions.viewReports && (
                              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                                Visualizar Relatórios
                              </span>
                            )}
                            {employee.permissions.changeOrderStatus && (
                              <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-600/20">
                                Alterar Status de Pedidos
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setIsEditEmployeeDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        {/* New Employee Dialog */}
        <EmployeeFormDialog
          open={isNewEmployeeDialogOpen}
          onOpenChange={setIsNewEmployeeDialogOpen}
          onSubmit={handleCreateEmployee}
        />
        
        {/* Edit Employee Dialog */}
        {selectedEmployee && (
          <EmployeeFormDialog
            open={isEditEmployeeDialogOpen}
            onOpenChange={setIsEditEmployeeDialogOpen}
            onSubmit={handleUpdateEmployee}
            defaultValues={{
              name: selectedEmployee.name,
              username: selectedEmployee.username,
              cpf: selectedEmployee.cpf || '',
              phone: selectedEmployee.phone || '',
              birth_date: selectedEmployee.birth_date,
              pix_key: selectedEmployee.pix_key || '',
              role: selectedEmployee.role,
              permissions: selectedEmployee.permissions,
              password: 'unchanged', // This is a placeholder to satisfy the form
            }}
            isEditing={true}
          />
        )}
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
              <DialogDescription>
                Esta ação não pode ser desfeita. O funcionário será removido permanentemente do sistema.
              </DialogDescription>
            </DialogHeader>
            
            {selectedEmployee && (
              <div className="py-4">
                <p>
                  Você tem certeza que deseja excluir <span className="font-medium">{selectedEmployee.name}</span>?
                </p>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteEmployee}>
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminEmployeesPage;
