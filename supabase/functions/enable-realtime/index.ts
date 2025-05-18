
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
    
    console.log('Setting up realtime for products table...')

    // Execute direct SQL to set REPLICA IDENTITY FULL
    const { data: replicaData, error: replicaError } = await supabaseClient.rpc(
      'exec_sql',
      { 
        query: 'ALTER TABLE products REPLICA IDENTITY FULL;' 
      }
    )

    if (replicaError) {
      console.error('Error setting REPLICA IDENTITY FULL:', replicaError)
      throw replicaError
    }
    
    console.log('REPLICA IDENTITY set successfully', replicaData)

    // Add the table to the realtime publication
    const { data: pubData, error: pubError } = await supabaseClient.rpc(
      'exec_sql',
      { 
        query: 'ALTER PUBLICATION supabase_realtime ADD TABLE products;' 
      }
    )

    if (pubError) {
      console.error('Error adding table to publication:', pubError)
      throw pubError
    }
    
    console.log('Table added to publication successfully', pubData)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Realtime configured successfully for the products table'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in function:', error)
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
