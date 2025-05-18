
import { Input } from "@/components/ui/input";

interface PromotionSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const PromotionSearch = ({ 
  searchTerm, 
  onSearchChange 
}: PromotionSearchProps) => {
  return (
    <Input
      className="w-full sm:w-72"
      placeholder="Pesquisar produtos..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  );
};

export default PromotionSearch;
