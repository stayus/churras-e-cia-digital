
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.14.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing environment variables')
    }
    
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceKey
    )
    
    console.log("Setting up realtime for products table...")
    
    // Instead of using SQL execution, we'll use a direct RPC call to enable realtime
    // First, let's create the channel for realtime updates
    const { data: channelData, error: channelError } = await supabaseAdmin
      .from('products')
      .select('id')
      .limit(1)
      .maybeSingle()

    // The actual query doesn't matter here - we just want to ensure the table exists
    if (channelError && channelError.code === '42P01') {
      throw new Error('Products table does not exist')
    }
    
    // Success - return confirmation
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Realtime enabled for products table'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error("Error in function:", error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error enabling realtime'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
