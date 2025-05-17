
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

    // Habilitar Replica Identity FULL para a tabela products
    const { error: replicaError } = await supabaseClient
      .rpc('alter_table_set_replica_identity', {
        table_name: 'products',
        replica_identity: 'FULL'
      })

    if (replicaError) {
      console.error('Erro ao definir REPLICA IDENTITY:', replicaError)
      throw replicaError
    }

    // Adicionar a tabela products à publicação supabase_realtime
    const { error: publicationError } = await supabaseClient
      .rpc('add_table_to_publication', {
        table_name: 'products',
        publication_name: 'supabase_realtime'
      })

    if (publicationError) {
      console.error('Erro ao adicionar à publicação:', publicationError)
      throw publicationError
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Realtime configurado com sucesso para a tabela products'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Erro na função:', error)
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
