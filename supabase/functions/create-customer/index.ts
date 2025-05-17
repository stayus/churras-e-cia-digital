// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

interface CustomerData {
  name: string;
  email: string;
  password: string;
  birthDate?: string;
  address: {
    street: string;
    number: string;
    city: string;
    zip: string;
    complement?: string;
    lat?: number;
    lng?: number;
  };
}

serve(async (req) => {
  // Log the request for debugging
  console.log("Received request:", req.method);
  
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), {
      status: 405,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
    });
  }

  try {
    // Get request body
    const requestBody = await req.json();
    console.log("Request body:", requestBody);
    
    const { name, email, password, birthDate, address } = requestBody as CustomerData;
    console.log("Parsed customer data:", { name, email, birthDate, address });
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    console.log("Creating Supabase client with URL:", supabaseUrl);
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Validate required fields
    if (!name || !email || !password || !address) {
      console.error("Missing required fields:", { name, email, password: !!password, address });
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required fields" 
        }),
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Invalid email format:", email);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid email format" 
        }),
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }
    
    // Validate password (at least 8 characters)
    if (password.length < 8) {
      console.error("Password too short");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Password must be at least 8 characters" 
        }),
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }
    
    // Validate address
    if (!address.street || !address.number || !address.city || !address.zip) {
      console.error("Incomplete address:", address);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Address must include street, number, city, and zip" 
        }),
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    // First, create the user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: {
        name,
        birthDate
      }
    });

    if (authError) {
      console.error("Error creating auth user:", authError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: authError.message 
        }),
        { 
          status: 500, 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    if (!authData.user) {
      console.error("No user returned from auth");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to create user"
        }),
        { 
          status: 500, 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }
    
    // Format the address
    const formattedAddress = {
      id: `addr_${Date.now()}`,
      ...address
    };
    
    const addresses = [formattedAddress];
    
    // Hash password for storage in customers table
    console.log("Hashing password for customers table");
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create customer data object
    const customerData = {
      id: authData.user.id,
      name,
      email,
      password: hashedPassword,
      addresses
    };
    
    // Add birth date if provided
    if (birthDate) {
      customerData.birth_date = birthDate;
    }
    
    console.log("Creating customer record with data:", JSON.stringify(customerData));
    
    // Create customer record
    const { data, error } = await supabaseAdmin
      .from("customers")
      .insert([customerData])
      .select("id")
      .single();
    
    if (error) {
      console.error("Error creating customer record:", error);
      // If customer record fails, try to delete the auth user
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      } catch (deleteError) {
        console.error("Failed to clean up auth user after customer creation error:", deleteError);
      }
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message 
        }),
        { 
          status: 500, 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }
    
    // Define the URL for email confirmation based on environment
    // Use production URL as default, fallback to header or request URL if available
    const productionUrl = 'https://preview--churras-e-cia-digital.lovable.app';
    const requestUrl = req.headers.get('origin') || requestBody.redirectUrl;
    const baseUrl = requestUrl || productionUrl;
    console.log("Using base URL for email confirmation:", baseUrl);
    
    // Send confirmation email
    const { error: emailError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email,
      options: {
        // Always use the production URL or the request origin for email confirmation
        redirectTo: `${baseUrl}/email-confirmado`,
      }
    });
    
    if (emailError) {
      console.error("Error sending confirmation email:", emailError);
      // Continue despite email error since account was created
    }
    
    console.log("Customer created successfully:", data);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        customerId: data.id 
      }),
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
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
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
});
