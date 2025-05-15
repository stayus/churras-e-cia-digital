
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { WorkingHours } from '@/types/dashboard';
import { toast } from '@/hooks/use-toast';

interface WorkingHoursSettingsProps {
  workingHours: WorkingHours[];
  onSave: (workingHours: WorkingHours[]) => void;
}

const dayNames = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado'
];

const WorkingHoursSettings: React.FC<WorkingHoursSettingsProps> = ({ workingHours, onSave }) => {
  const [hours, setHours] = useState<WorkingHours[]>(workingHours);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleDay = (dayIndex: number) => {
    const updatedHours = [...hours];
    const dayToUpdate = updatedHours.find(day => day.dayOfWeek === dayIndex);
    
    if (dayToUpdate) {
      dayToUpdate.isOpen = !dayToUpdate.isOpen;
      setHours(updatedHours);
    }
  };

  const handleTimeChange = (dayIndex: number, field: 'openTime' | 'closeTime', value: string) => {
    const updatedHours = [...hours];
    const dayToUpdate = updatedHours.find(day => day.dayOfWeek === dayIndex);
    
    if (dayToUpdate) {
      dayToUpdate[field] = value;
      setHours(updatedHours);
    }
  };

  const validateHours = (): boolean => {
    for (const day of hours) {
      if (day.isOpen) {
        // Valida formato HH:MM
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        
        if (!timeRegex.test(day.openTime) || !timeRegex.test(day.closeTime)) {
          toast({
            variant: 'destructive',
            title: 'Formato de horário inválido',
            description: `O horário para ${dayNames[day.dayOfWeek]} deve estar no formato HH:MM.`
          });
          return false;
        }
        
        // Verifica se hora de fechamento é depois da abertura
        const [openHour, openMinute] = day.openTime.split(':').map(Number);
        const [closeHour, closeMinute] = day.closeTime.split(':').map(Number);
        
        const openMinutes = openHour * 60 + openMinute;
        const closeMinutes = closeHour * 60 + closeMinute;
        
        if (closeMinutes <= openMinutes) {
          toast({
            variant: 'destructive',
            title: 'Horário inválido',
            description: `Para ${dayNames[day.dayOfWeek]}, o horário de fechamento deve ser posterior ao de abertura.`
          });
          return false;
        }
      }
    }
    
    return true;
  };

  const handleSave = async () => {
    if (!validateHours()) {
      return;
    }
    
    setIsSaving(true);
    try {
      await onSave(hours);
      toast({
        title: 'Horários atualizados',
        description: 'Os horários de funcionamento foram atualizados com sucesso.'
      });
    } catch (error) {
      console.error('Erro ao salvar horários:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {hours.map((day) => (
          <div key={day.dayOfWeek} className="flex items-center space-x-4 p-2 border rounded-md bg-white">
            <div className="flex items-center space-x-2 w-48">
              <Switch 
                id={`day-${day.dayOfWeek}`}
                checked={day.isOpen}
                onCheckedChange={() => handleToggleDay(day.dayOfWeek)}
              />
              <Label htmlFor={`day-${day.dayOfWeek}`} className="font-medium">
                {dayNames[day.dayOfWeek]}
              </Label>
            </div>
            
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`open-${day.dayOfWeek}`} className="text-sm">
                  Abertura
                </Label>
                <Input
                  id={`open-${day.dayOfWeek}`}
                  type="time"
                  value={day.openTime}
                  onChange={(e) => handleTimeChange(day.dayOfWeek, 'openTime', e.target.value)}
                  disabled={!day.isOpen}
                />
              </div>
              
              <div>
                <Label htmlFor={`close-${day.dayOfWeek}`} className="text-sm">
                  Fechamento
                </Label>
                <Input
                  id={`close-${day.dayOfWeek}`}
                  type="time"
                  value={day.closeTime}
                  onChange={(e) => handleTimeChange(day.dayOfWeek, 'closeTime', e.target.value)}
                  disabled={!day.isOpen}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <Button 
        onClick={handleSave} 
        className="w-full bg-red-600 hover:bg-red-700"
        disabled={isSaving}
      >
        {isSaving ? 'Salvando...' : 'Salvar Horários'}
      </Button>
    </div>
  );
};

export default WorkingHoursSettings;
