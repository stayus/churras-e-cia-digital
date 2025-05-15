
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface WorkingHoursRequest {
  workingHours: {
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isOpen: boolean;
  }[];
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
    // Extract data and create Supabase client
    const requestData: WorkingHoursRequest = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    // Validate required fields
    if (!requestData.workingHours || !Array.isArray(requestData.workingHours)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing or invalid working hours" 
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
    
    // Get settings
    const { data: settingsData, error: settingsError } = await supabaseClient
      .from("settings")
      .select("id")
      .single();
    
    if (settingsError) {
      console.error("Error fetching settings:", settingsError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to fetch settings" 
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
    
    // Update store settings with working hours
    const { data, error } = await supabaseClient
      .from("settings")
      .update({
        working_hours: requestData.workingHours
      })
      .eq("id", settingsData.id)
      .select();
    
    if (error) {
      console.error("Error updating working hours:", error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message 
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
        success: true, 
        data
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
