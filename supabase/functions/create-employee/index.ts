
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

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
  };
}

serve(async (req) => {
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
    // Get request body and create Supabase client
    const { name, username, cpf, phone, birth_date, pix_key, role, password, permissions } = await req.json() as EmployeeData;
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
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
            "Access-Control-Allow-Origin": "*"
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
            "Access-Control-Allow-Origin": "*"
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
            "Access-Control-Allow-Origin": "*"
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
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }
    
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
            "Access-Control-Allow-Origin": "*"
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
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }
    
    // Generate registration number
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
            "Access-Control-Allow-Origin": "*"
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
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create employee record
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
          birth_date: birth_date ? new Date(birth_date) : null,
          pix_key,
          permissions
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
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }
    
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
