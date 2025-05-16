
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
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    
    console.log("Creating Supabase client with URL:", supabaseUrl);
    const supabaseClient = createClient(supabaseUrl, supabaseKey);
    
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
    
    // Check if email is already in use
    console.log("Checking if email is already in use:", email);
    const { data: existingUser, error: userCheckError } = await supabaseClient
      .from("customers")
      .select("id")
      .eq("email", email)
      .single();
    
    if (userCheckError && userCheckError.code !== "PGRST116") {
      console.error("Error checking for existing user:", userCheckError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Database error while checking email"
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
    
    if (existingUser) {
      console.error("Email already in use:", email);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Email already in use" 
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
    
    // Hash password
    console.log("Hashing password");
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Format the address
    // Adicionar um ID para o endereço para facilitar operações futuras
    const formattedAddress = {
      id: `addr_${Date.now()}`,
      ...address
    };
    
    const addresses = [formattedAddress];
    
    // Create customer data object
    const customerData = {
      name,
      email,
      password: hashedPassword,
      addresses
    };
    
    // Adicionar data de nascimento se fornecida
    if (birthDate) {
      customerData.birth_date = birthDate;
    }
    
    console.log("Creating customer with data:", JSON.stringify(customerData));
    
    // Create customer record
    const { data, error } = await supabaseClient
      .from("customers")
      .insert([customerData])
      .select("id")
      .single();
    
    if (error) {
      console.error("Error creating customer:", error);
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
    
    console.log("Customer created successfully:", data);
    
    // Aqui você normalmente enviaria um email de confirmação
    // Mas para este exemplo, vamos apenas retornar sucesso
    
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
