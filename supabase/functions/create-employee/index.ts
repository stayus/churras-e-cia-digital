
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// Using a Deno-compatible crypto library instead of bcrypt
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";
import { encode as hexEncode } from "https://deno.land/std@0.177.0/encoding/hex.ts";
import { encode as base64Encode } from "https://deno.land/std@0.177.0/encoding/base64.ts";

interface EmployeeData {
  name: string;
  username: string;
  cpf?: string;
  phone?: string;
  birth_date?: string;
  pix_key?: string;
  role: string;
  password: string;
  registration_number?: string;
  permissions: {
    manageStock: boolean;
    viewReports: boolean;
    changeOrderStatus: boolean;
    exportOrderReportPDF: boolean;
    promotionProducts: boolean;
  };
}

// CORS headers for allowing cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info',
};

// Helper function to hash passwords with SHA-256 + salt
async function hashPassword(password: string): Promise<string> {
  // Generate a random salt
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = hexEncode(salt);
  
  // Encode password as UTF-8
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password + saltHex);
  
  // Hash the password with the salt
  const hashBuffer = await crypto.subtle.digest('SHA-256', passwordData);
  const hashArray = new Uint8Array(hashBuffer);
  const hashHex = hexEncode(hashArray);
  
  // Return salt and hash together
  return `${saltHex}:${hashHex}`;
}

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
    console.log("Create-employee function called");
    
    // Get request body and create Supabase client
    const requestData = await req.json();
    console.log("Received data:", JSON.stringify(requestData));
    
    const { name, username, cpf, phone, birth_date, pix_key, role, password, permissions } = requestData as EmployeeData;
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Server configuration error" 
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
    
    console.log("Creating Supabase client");
    const supabaseClient = createClient(supabaseUrl, supabaseKey);
    
    // Validate required fields
    if (!name || !username || !role || !password) {
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
    
    // Validate name (at least 2 words)
    const nameWords = name.trim().split(/\s+/);
    if (nameWords.length < 2) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Name must contain at least first and last name" 
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
    
    // Validate username (only lowercase letters)
    if (!/^[a-z]+$/.test(username)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Username must contain only lowercase letters, no numbers or spaces" 
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
    
    // Validate password (at least 8 characters, including uppercase, lowercase, number, and special character)
    if (password.length < 8 || 
        !/[A-Z]/.test(password) || 
        !/[a-z]/.test(password) || 
        !/[0-9]/.test(password) || 
        !/[^A-Za-z0-9]/.test(password)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character" 
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
    
    console.log("Checking if username is already taken");
    // Check if username is already taken
    const { data: existingUser, error: userCheckError } = await supabaseClient
      .from("employees")
      .select("id")
      .eq("username", username)
      .single();
    
    if (userCheckError && userCheckError.code !== "PGRST116") {
      console.error("Error checking for existing user:", userCheckError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Database error while checking username"
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
    
    if (existingUser) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Username already taken" 
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
    
    // Generate registration number
    console.log("Generating registration number");
    let registrationNumber;
    const { data: lastEmployee, error: registrationError } = await supabaseClient
      .from("employees")
      .select("registration_number")
      .order("registration_number", { ascending: false })
      .limit(1)
      .single();
    
    if (registrationError && registrationError.code !== "PGRST116") {
      console.error("Error fetching last registration number:", registrationError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Database error while generating registration number"
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
    
    // Calculate next registration number
    if (lastEmployee) {
      const lastNumber = parseInt(lastEmployee.registration_number.substring(3));
      registrationNumber = `MC-${String(lastNumber + 1).padStart(4, '0')}`;
    } else {
      registrationNumber = "MC-0001";
    }
    
    // Hash password with our Deno-compatible method
    console.log("Hashing password");
    const hashedPassword = await hashPassword(password);
    
    console.log("Creating employee record");
    // Create employee record with expanded permissions object
    const { data, error } = await supabaseClient
      .from("employees")
      .insert([
        {
          name,
          username,
          password: hashedPassword,
          registration_number: registrationNumber,
          role,
          cpf,
          phone,
          birth_date: birth_date ? new Date(birth_date).toISOString() : null,
          pix_key,
          permissions: {
            manageStock: permissions?.manageStock || false,
            viewReports: permissions?.viewReports || false,
            changeOrderStatus: permissions?.changeOrderStatus || false,
            exportOrderReportPDF: permissions?.exportOrderReportPDF || false,
            promotionProducts: permissions?.promotionProducts || false
          }
        }
      ])
      .select("id")
      .single();
    
    if (error) {
      console.error("Error creating employee:", error);
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
    
    console.log("Employee created successfully:", data);
    return new Response(
      JSON.stringify({ 
        success: true, 
        employeeId: data.id,
        registrationNumber 
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
