
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

// Define headers for CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Define o tipo do produto
interface Product {
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: 'lanche' | 'bebida' | 'refeicao' | 'sobremesa' | 'outro';
  is_out_of_stock?: boolean;
  promotion_price?: number | null;
  extras?: any[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204,
    });
  }
  
  try {
    // Verificar método
    if (req.method !== "POST") {
      throw new Error(`Método ${req.method} não suportado`);
    }

    console.log("Iniciando função add-product");
    
    // Pegar dados do corpo da requisição
    const product: Product = await req.json();
    
    console.log("Dados recebidos:", product);
    
    // Verificar dados obrigatórios
    if (!product.name || !product.description || product.price === undefined || !product.category) {
      throw new Error("Dados de produto incompletos. Nome, descrição, categoria e preço são obrigatórios.");
    }

    // Criar cliente Supabase com chave de serviço para ter acesso total ao banco
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Variáveis de ambiente do Supabase não configuradas");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Inserir produto usando a chave de serviço (ignora RLS)
    const { data, error } = await supabase
      .from("products")
      .insert([{
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        image_url: product.image_url || "https://placehold.co/300x200?text=Produto",
        is_out_of_stock: product.is_out_of_stock || false,
        promotion_price: product.promotion_price || null,
        extras: product.extras || []
      }])
      .select()
      .single();
    
    if (error) {
      console.error("Erro ao inserir produto:", error);
      throw error;
    }
    
    console.log("Produto adicionado com sucesso:", data);
    
    // Retornar o produto adicionado
    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 201 
      }
    );

  } catch (error) {
    console.error("Erro na função add-product:", error.message);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Ocorreu um erro ao adicionar o produto" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400 
      }
    );
  }
});
