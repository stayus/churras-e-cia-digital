
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { compare } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { create } from "https://deno.land/x/djwt@v2.8/mod.ts";

interface LoginRequest {
  credential: string;
  credentialType: "email" | "username";
  password: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Generate a secure key for JWT signing
const key = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"],
);

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
    // Extract login credentials and create Supabase client
    const { credential, credentialType, password } = await req.json() as LoginRequest;
    
    // Trim whitespace from credential and password
    const trimmedCredential = credential.trim();
    const trimmedPassword = password.trim();
    
    console.log(`Processing login request for ${credentialType}: "${trimmedCredential}"`);
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    // Validate required fields
    if (!trimmedCredential || !credentialType || !trimmedPassword) {
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
    
    let userData;
    let table;
    
    if (credentialType === "email") {
      // Customer login (email)
      table = "customers";
      const { data, error } = await supabaseClient
        .from(table)
        .select("id, name, email, password")
        .eq("email", trimmedCredential)
        .single();
      
      if (error || !data) {
        console.error("Error fetching customer:", error);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Invalid email or password" 
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
      
      userData = data;
    } else {
      // Employee login (username)
      table = "employees";
      
      // Special case for admin/admin
      if (trimmedCredential === "admin" && trimmedPassword === "admin") {
        console.log("Checking for admin user");
        // Check if admin user exists first
        const { data: adminData, error: adminError } = await supabaseClient
          .from(table)
          .select("id, name, username, password, role, permissions, registration_number")
          .eq("username", "admin")
          .maybeSingle();
          
        if (!adminError && adminData) {
          console.log("Found existing admin user");
          userData = adminData;
        } else {
          // If no admin user, create a default one for demo purposes
          console.log("Admin user not found, creating default admin");
          const defaultAdmin = {
            name: "Administrador",
            username: "admin",
            password: "admin", // In production this would be hashed
            role: "admin",
            registration_number: "ADM-0001",
            permissions: {
              manageStock: true,
              viewReports: true,
              changeOrderStatus: true,
              exportOrderReportPDF: true,
              promotionProducts: true
            }
          };
          
          const { data: newAdmin, error: createError } = await supabaseClient
            .from(table)
            .insert(defaultAdmin)
            .select()
            .single();
            
          if (createError) {
            console.error("Error creating admin:", createError);
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: "Failed to authenticate" 
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
          
          userData = newAdmin;
        }
      } else {
        // Regular employee login
        console.log(`Looking for employee with username: "${trimmedCredential}"`);
        const { data, error } = await supabaseClient
          .from(table)
          .select("id, name, username, password, role, permissions, registration_number")
          .eq("username", trimmedCredential)
          .maybeSingle(); // Use maybeSingle instead of single to avoid error when no rows found
        
        if (error) {
          console.error("Error fetching employee:", error);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: "Database error during authentication" 
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
        
        if (!data) {
          console.error("Employee not found for username:", trimmedCredential);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: "Invalid username or password" 
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
        
        userData = data;
      }
    }
    
    // Password check - simplify for admin/admin case
    let isPasswordCorrect = false;
    
    // Direct check for admin/admin credentials
    if (trimmedCredential === "admin" && trimmedPassword === "admin") {
      isPasswordCorrect = true;
    } else if (userData) {
      // For other users, try bcrypt compare first
      try {
        isPasswordCorrect = await compare(trimmedPassword, userData.password);
      } catch (e) {
        console.error("Bcrypt compare error:", e);
        // Fallback to direct comparison
        isPasswordCorrect = trimmedPassword === userData.password;
      }
    }
    
    if (!isPasswordCorrect) {
      console.log("Password incorrect for user:", trimmedCredential);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid credentials" 
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
    
    // Check if it's the employee's first login (using the default password pattern)
    const isFirstLogin = table === "employees" && /^MC-\d{4}/.test(trimmedPassword);
    
    // Create JWT payload
    const payload = {
      id: userData.id,
      name: userData.name,
      role: table === "customers" ? "customer" : userData.role,
      ...(table === "customers" ? { email: userData.email } : { 
        username: userData.username,
        registration_number: userData.registration_number,
        permissions: userData.permissions
      }),
      ...(isFirstLogin && { isFirstLogin: true }),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // Token expires in 7 days
    };
    
    // Sign JWT
    const jwt = await create({ alg: "HS512", typ: "JWT" }, payload, key);
    
    // Remove password from userData before returning
    delete userData.password;
    
    console.log("Login successful for:", trimmedCredential);
    return new Response(
      JSON.stringify({ 
        success: true, 
        token: jwt,
        user: {
          ...userData,
          ...(isFirstLogin && { isFirstLogin }),
          role: table === "customers" ? "customer" : userData.role
        }
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
