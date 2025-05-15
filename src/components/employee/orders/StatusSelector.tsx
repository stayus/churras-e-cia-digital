
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatusOption {
  value: string;
  label: string;
}

interface StatusSelectorProps {
  options: StatusOption[];
  disabled: boolean;
  onStatusChange: (value: string) => void;
}

export const StatusSelector = ({ 
  options, 
  disabled, 
  onStatusChange 
}: StatusSelectorProps) => {
  if (options.length === 0) {
    return null;
  }
  
  return (
    <Select onValueChange={onStatusChange} disabled={disabled}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Selecione" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
