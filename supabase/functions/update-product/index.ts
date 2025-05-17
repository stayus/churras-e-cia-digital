
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

    const { productId, data } = await req.json()

    if (!productId) {
      throw new Error('ID do produto não fornecido')
    }

    console.log(`Atualizando produto ${productId} com dados:`, data)

    // Atualizar o produto no banco de dados
    const { data: updatedProduct, error } = await supabaseClient
      .from('products')
      .update(data)
      .eq('id', productId)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar produto:', error)
      throw error
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: updatedProduct
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Erro na função update-product:', error)
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
