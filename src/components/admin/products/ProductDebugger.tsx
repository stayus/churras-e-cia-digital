
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Product, useProducts } from '@/hooks/useProducts';
import { Loader2, RefreshCw, Database, Zap, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ProductDebugger: React.FC = () => {
  const { toast } = useToast();
  const { products, fetchProducts, setupRealtime, checkProducts } = useProducts();
  const [isChecking, setIsChecking] = useState(false);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [isEnablingRealtime, setIsEnablingRealtime] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [directQueryResult, setDirectQueryResult] = useState<any>(null);

  const handleCheckDatabase = async () => {
    try {
      setIsChecking(true);
      setCheckError(null);
      
      console.log("Verificando produtos no banco de dados...");
      const result = await checkProducts();
      
      if (result) {
        setDbProducts(result);
        toast({
          title: "Verificação concluída",
          description: `Encontrados ${result.length} produtos no banco de dados.`
        });
      } else {
        setCheckError("A verificação não retornou nenhum produto");
        throw new Error("A verificação não retornou nenhum produto");
      }
    } catch (error: any) {
      console.error("Erro ao verificar banco de dados:", error);
      setCheckError(error.message || "Erro desconhecido");
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível verificar os produtos no banco de dados."
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleDirectQuery = async () => {
    try {
      setIsChecking(true);
      setCheckError(null);
      
      console.log("Executando consulta direta para produtos...");
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) {
        setCheckError(error.message);
        throw error;
      }
      
      setDirectQueryResult(data);
      toast({
        title: "Consulta direta concluída",
        description: `Encontrados ${data?.length || 0} produtos no banco de dados.`
      });
    } catch (error: any) {
      console.error("Erro na consulta direta:", error);
      setCheckError(error.message || "Erro desconhecido");
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível realizar a consulta direta."
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleEnableRealtime = async () => {
    try {
      setIsEnablingRealtime(true);
      
      await setupRealtime();
      
      toast({
        title: "Realtime configurado",
        description: "Configuração de Realtime para a tabela de produtos foi aplicada com sucesso."
      });
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
            onClick={handleDirectQuery}
            disabled={isChecking}
            className="flex items-center gap-2"
          >
            {isChecking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            Consulta Direta
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
              <Zap className="h-4 w-4" />
            )}
            Configurar Realtime
          </Button>
        </div>
        
        {checkError && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            <p className="font-medium">Erro ao verificar banco de dados:</p>
            <p>{checkError}</p>
          </div>
        )}
        
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Carregados no aplicativo ({products.length}):</h3>
          {products.length > 0 ? (
            <ul className="text-sm border rounded-md p-2 max-h-40 overflow-y-auto">
              {products.map(product => (
                <li key={product.id} className="py-1 border-b last:border-0">
                  {product.name} - R$ {product.price.toFixed(2)} - {product.category}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum produto carregado no aplicativo.</p>
          )}
        </div>
        
        {dbProducts.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Encontrados pela função check-products ({dbProducts.length}):</h3>
            <ul className="text-sm border rounded-md p-2 max-h-40 overflow-y-auto">
              {dbProducts.map(product => (
                <li key={product.id} className="py-1 border-b last:border-0">
                  {product.name} - R$ {product.price.toFixed(2)} - {product.category}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {directQueryResult && directQueryResult.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Resultado da consulta direta ({directQueryResult.length}):</h3>
            <ul className="text-sm border rounded-md p-2 max-h-40 overflow-y-auto">
              {directQueryResult.map((product: any) => (
                <li key={product.id} className="py-1 border-b last:border-0">
                  {product.name} - R$ {product.price.toFixed(2)} - {product.category}
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
