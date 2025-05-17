
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Product, useProducts } from '@/hooks/useProducts';
import { Loader2, RefreshCw, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ProductDebugger: React.FC = () => {
  const { toast } = useToast();
  const { products, fetchProducts } = useProducts();
  const [isChecking, setIsChecking] = useState(false);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [isEnablingRealtime, setIsEnablingRealtime] = useState(false);

  const handleCheckDatabase = async () => {
    try {
      setIsChecking(true);
      
      const { data, error } = await supabase.functions.invoke('check-products', {
        body: {}
      });
      
      if (error) {
        throw error;
      }
      
      if (data.success) {
        setDbProducts(data.data);
        toast({
          title: "Verificação concluída",
          description: `Encontrados ${data.count} produtos no banco de dados.`
        });
      } else {
        throw new Error(data.error || "Erro ao verificar produtos no banco de dados");
      }
    } catch (error: any) {
      console.error("Erro ao verificar banco de dados:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível verificar os produtos no banco de dados."
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleEnableRealtime = async () => {
    try {
      setIsEnablingRealtime(true);
      
      const { data, error } = await supabase.functions.invoke('enable-realtime', {
        body: {}
      });
      
      if (error) {
        throw error;
      }
      
      if (data.success) {
        toast({
          title: "Realtime configurado",
          description: "Configuração de Realtime para a tabela de produtos foi aplicada com sucesso."
        });
      } else {
        throw new Error(data.error || "Erro ao configurar Realtime");
      }
    } catch (error: any) {
      console.error("Erro ao configurar Realtime:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível configurar o Realtime para a tabela de produtos."
      });
    } finally {
      setIsEnablingRealtime(false);
    }
  };

  const handleRefreshProducts = () => {
    fetchProducts();
    toast({
      title: "Atualizando",
      description: "Lista de produtos está sendo atualizada."
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Ferramentas de Diagnóstico</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            onClick={handleCheckDatabase}
            disabled={isChecking}
            className="flex items-center gap-2"
          >
            {isChecking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Database className="h-4 w-4" />
            )}
            Verificar Banco de Dados
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleRefreshProducts}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar Lista
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleEnableRealtime}
            disabled={isEnablingRealtime}
            className="flex items-center gap-2"
          >
            {isEnablingRealtime ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Configurar Realtime
          </Button>
        </div>
        
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Carregados no aplicativo ({products.length}):</h3>
          {products.length > 0 ? (
            <ul className="text-sm border rounded-md p-2 max-h-40 overflow-y-auto">
              {products.map(product => (
                <li key={product.id} className="py-1 border-b last:border-0">
                  {product.name} - R$ {product.price.toFixed(2)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum produto carregado no aplicativo.</p>
          )}
        </div>
        
        {dbProducts.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Encontrados no banco de dados ({dbProducts.length}):</h3>
            <ul className="text-sm border rounded-md p-2 max-h-40 overflow-y-auto">
              {dbProducts.map(product => (
                <li key={product.id} className="py-1 border-b last:border-0">
                  {product.name} - R$ {product.price.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductDebugger;
