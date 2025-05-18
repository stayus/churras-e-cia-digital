
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials')
    }
    
    const supabaseClient = createClient(
      supabaseUrl,
      supabaseKey,
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    console.log('Verificando todos os produtos no banco de dados')

    // Instead of using exec_sql, directly query the products table using the Supabase client
    // First, check if the table exists by trying to get metadata
    const { data: tableInfo, error: metadataError } = await supabaseClient
      .from('products')
      .select('id')
      .limit(1)
      .maybeSingle()

    if (metadataError && metadataError.code === '42P01') {
      // Table doesn't exist error
      console.error('Table products does not exist:', metadataError)
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

    console.log(`Encontrados ${products?.length || 0} produtos no banco de dados:`)
    if (products && products.length > 0) {
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} (${product.id}) - ${product.price} - ${product.category}`)
      })
    } else {
      console.log('Nenhum produto encontrado no banco de dados')
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
    )
  } catch (error) {
    console.error('Erro na função check-products:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Erro desconhecido'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
