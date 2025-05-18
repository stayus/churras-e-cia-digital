
import { Input } from "@/components/ui/input";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
}

const ProductSearch = ({ searchTerm, onSearchChange, onRefresh }: ProductSearchProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <Input
        className="w-full sm:w-72"
        placeholder="Pesquisar produtos..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Button
        variant="outline"
        onClick={onRefresh}
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Atualizar
      </Button>
    </div>
  );
};

export default ProductSearch;
