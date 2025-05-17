
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.14.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    console.log('Verificando todos os produtos no banco de dados')

    // Execute a SQL query to check if the products table exists and has data
    const { data: tableCheck, error: tableError } = await supabaseClient.rpc(
      'execute_sql',
      { 
        sql: `SELECT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'products'
        ) AS table_exists;` 
      }
    )

    if (tableError) {
      console.error('Erro ao verificar tabela products:', tableError)
      throw tableError
    }

    console.log('Verificação da tabela:', tableCheck)
    
    if (!tableCheck || !tableCheck[0].table_exists) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'A tabela products não existe no banco de dados'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Buscar todos os produtos utilizando o service role para ignorar RLS
    const { data: products, error } = await supabaseClient
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar produtos:', error)
      throw error
    }

    console.log(`Encontrados ${products.length} produtos no banco de dados:`)
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.id}) - ${product.price}`)
    })

    return new Response(
      JSON.stringify({
        success: true,
        data: products,
        count: products.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Erro na função check-products:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
