
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
    console.log('get-products function called');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing environment variables for Supabase connection');
    }
    
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceKey
    );

    console.log('Buscando produtos do banco de dados com papel de serviço');
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*');
    
    if (error) {
      console.error('Error fetching products from database:', error);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: error.message 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Successfully fetched ${data?.length || 0} products`);
    if (data && data.length > 0) {
      console.log('Sample product:', data[0]);
      data.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} (${product.id}) - ${product.price} - ${product.category || 'sem categoria'}`);
      });
    } else {
      console.log('No products found in database');
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        data: data || [],
        count: data?.length || 0
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error('Unexpected error in get-products function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
