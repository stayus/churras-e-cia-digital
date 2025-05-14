
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { create, verify } from "https://deno.land/x/djwt@v2.8/mod.ts";

interface LoginRequest {
  credential: string;
  credentialType: 'email' | 'username';
  password: string;
}

interface EmployeeData {
  id: string;
  name: string;
  username: string;
  password: string;
  registration_number: string;
  role: string;
  permissions: {
    manageStock: boolean;
    viewReports: boolean;
    changeOrderStatus: boolean;
  };
  created_at: string;
  // Flag to determine if it's their first login
  first_login?: boolean;
}

interface CustomerData {
  id: string;
  name: string;
  email: string;
  password: string;
  addresses: any[];
  created_at: string;
}

const key = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"],
);

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
    const { credential, credentialType, password } = await req.json() as LoginRequest;
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    // Validate required fields
    if (!credential || !credentialType || !password) {
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
    
    let userData = null;
    let isFirstLogin = false;
    
    // Check if the credential is a username (employee) or email (customer)
    if (credentialType === 'username') {
      // Employee login
      const { data: employee, error: employeeError } = await supabaseClient
        .from("employees")
        .select("*")
        .eq("username", credential)
        .single();
      
      if (employeeError) {
        if (employeeError.code === "PGRST116") {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: "Username or password is incorrect" 
            }),
            { 
              status: 401, 
              headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
              }
            }
          );
        }
        
        console.error("Database error during employee fetch:", employeeError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Database error during authentication" 
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
      
      if (!employee) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Username or password is incorrect" 
          }),
          { 
            status: 401, 
            headers: { 
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }
      
      // Check password
      const passwordMatch = await bcrypt.compare(password, employee.password);
      if (!passwordMatch) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Username or password is incorrect" 
          }),
          { 
            status: 401, 
            headers: { 
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }
      
      userData = {
        id: employee.id,
        name: employee.name,
        role: employee.role,
        username: employee.username,
        registration_number: employee.registration_number,
        permissions: employee.permissions
      };
      
      // Check if this is the first login (implementation dependent)
      // Here we're checking if the password matches a default pattern or hasn't been changed
      // This is just an example - in real apps this is tracked differently
      
      // Simple example: If their password matches their username, it's their first login
      isFirstLogin = password === credential || password === 'password';
      
    } else if (credentialType === 'email') {
      // Customer login
      const { data: customer, error: customerError } = await supabaseClient
        .from("customers")
        .select("*")
        .eq("email", credential)
        .single();
      
      if (customerError) {
        if (customerError.code === "PGRST116") {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: "Email or password is incorrect" 
            }),
            { 
              status: 401, 
              headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
              }
            }
          );
        }
        
        console.error("Database error during customer fetch:", customerError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Database error during authentication" 
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
      
      if (!customer) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Email or password is incorrect" 
          }),
          { 
            status: 401, 
            headers: { 
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }
      
      // Check password
      const passwordMatch = await bcrypt.compare(password, customer.password);
      if (!passwordMatch) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Email or password is incorrect" 
          }),
          { 
            status: 401, 
            headers: { 
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }
      
      userData = {
        id: customer.id,
        name: customer.name,
        role: 'customer',
        email: customer.email
      };
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid credential type" 
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
    
    // Generate JWT
    const jwt = await create(
      { alg: "HS512", typ: "JWT" },
      {
        sub: userData.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hour expiry
        role: userData.role,
        ...userData
      },
      key
    );
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        token: jwt,
        user: {
          ...userData,
          isFirstLogin
        }
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
