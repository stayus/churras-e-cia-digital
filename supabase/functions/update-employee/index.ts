
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
    console.log('update-employee function called');
    
    // Parse request body
    const { id, name, username, cpf, phone, birth_date, pix_key, role, permissions } = await req.json();

    // Validate required fields
    if (!id || !name || !username || !role) {
      console.error('Missing required fields');
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Check if employee exists
    const { data: existingEmployee, error: checkError } = await supabaseAdmin
      .from('employees')
      .select('id')
      .eq('id', id)
      .single();
    
    if (checkError || !existingEmployee) {
      console.error('Employee not found:', id);
      return new Response(
        JSON.stringify({ success: false, error: 'Employee not found' }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Check if username is already taken by another employee
    const { data: usernameCheck, error: usernameError } = await supabaseAdmin
      .from('employees')
      .select('id')
      .eq('username', username)
      .neq('id', id);
    
    if (usernameError) {
      console.error('Error checking username uniqueness:', usernameError);
      return new Response(
        JSON.stringify({ success: false, error: usernameError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (usernameCheck && usernameCheck.length > 0) {
      console.error('Username already taken:', username);
      return new Response(
        JSON.stringify({ success: false, error: 'Este nome de usuário já está em uso' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('Updating employee:', id);
    
    // Update the employee
    const { data, error } = await supabaseAdmin
      .from('employees')
      .update({
        name: name,
        username: username,
        cpf: cpf,
        phone: phone,
        birth_date: birth_date,
        pix_key: pix_key,
        role: role,
        permissions: permissions
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating employee:', error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log('Employee updated successfully:', id);
    
    return new Response(
      JSON.stringify({ success: true, id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error('Unexpected error in update-employee function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
