
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
    console.log('delete-employee function called');
    
    // Parse request body
    const { id } = await req.json();

    // Validate required fields
    if (!id) {
      console.error('Missing employee ID');
      return new Response(
        JSON.stringify({ success: false, error: 'Missing employee ID' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Check if employee is admin
    const { data: employee, error: checkError } = await supabaseAdmin
      .from('employees')
      .select('username')
      .eq('id', id)
      .single();
    
    if (checkError) {
      console.error('Error checking employee:', checkError);
      return new Response(
        JSON.stringify({ success: false, error: checkError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
      
    if (employee && employee.username === 'admin') {
      console.error('Cannot delete admin user');
      return new Response(
        JSON.stringify({ success: false, error: 'O usuário administrador não pode ser removido.' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log('Deleting employee:', id);
    
    // Delete the employee
    const { error } = await supabaseAdmin
      .from('employees')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting employee:', error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log('Employee deleted successfully:', id);
    
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error('Unexpected error in delete-employee function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
