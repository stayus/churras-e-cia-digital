
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

interface PasswordUpdateRequest {
  userId: string;
  oldPassword: string;
  newPassword: string;
  userType: 'employees' | 'customers';
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), {
      status: 405,
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      },
    });
  }

  try {
    // Extract request data
    const { userId, oldPassword, newPassword, userType } = await req.json() as PasswordUpdateRequest;
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    // Validate required fields
    if (!userId || !oldPassword || !newPassword || !userType) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required fields" 
        }),
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }
    
    // Validate password (at least 8 characters)
    if (newPassword.length < 8) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Password must be at least 8 characters" 
        }),
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }
    
    // Get current user data (with password)
    const { data: userData, error: userError } = await supabaseClient
      .from(userType)
      .select("id, password")
      .eq("id", userId)
      .single();
      
    if (userError || !userData) {
      console.error("Error fetching user:", userError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "User not found" 
        }),
        { 
          status: 404, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }
    
    // Verify old password
    const isPasswordCorrect = await bcrypt.compare(oldPassword, userData.password);
    
    if (!isPasswordCorrect) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Current password is incorrect" 
        }),
        { 
          status: 401, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }
    
    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password in database
    const { error: updateError } = await supabaseClient
      .from(userType)
      .update({ password: hashedPassword })
      .eq("id", userId);
      
    if (updateError) {
      console.error("Error updating password:", updateError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to update password" 
        }),
        { 
          status: 500, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true
      }),
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
    
  } catch (error) {
    console.error("Unhandled error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Internal server error" 
      }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
});
