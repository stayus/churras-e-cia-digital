
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('check-products function called');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials');
    }
    
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceKey
    );

    console.log('Verificando todos os produtos no banco de dados');

    // Buscar todos os produtos utilizando o service role para ignorar RLS
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('*');

    if (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }

    console.log(`Encontrados ${products?.length || 0} produtos no banco de dados:`);
    if (products && products.length > 0) {
      console.log('Primeiro produto encontrado:', products[0]);
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} (${product.id}) - ${product.price} - ${product.category || 'sem categoria'}`);
      });
    } else {
      console.log('Nenhum produto encontrado no banco de dados');
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: products || [],
        count: products?.length || 0
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Erro na função check-products:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Erro desconhecido'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
