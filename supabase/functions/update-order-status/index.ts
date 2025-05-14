
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { create, verify } from "https://deno.land/x/djwt@v2.8/mod.ts";

interface UpdateOrderStatusRequest {
  orderId: string;
  status: 'received' | 'preparing' | 'delivering' | 'completed';
  token: string;
}

// This key would be stored securely and matched with the login function
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
    // Get request body and validate
    const { orderId, status, token } = await req.json() as UpdateOrderStatusRequest;
    
    if (!orderId || !status || !token) {
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
    
    // Validate order status
    const validStatuses = ['received', 'preparing', 'delivering', 'completed'];
    if (!validStatuses.includes(status)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid order status" 
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
    
    // Verify JWT token
    try {
      const payload = await verify(token, key);
      
      // Check if user has permission to update order status
      if (payload.role !== 'admin' && payload.role !== 'employee' && payload.role !== 'motoboy') {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Insufficient permissions" 
          }),
          { 
            status: 403, 
            headers: { 
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }
      
      // For non-admin employees, check if they have the changeOrderStatus permission
      if (payload.role === 'employee' && (!payload.permissions || !payload.permissions.changeOrderStatus)) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Employee doesn't have permission to change order status" 
          }),
          { 
            status: 403, 
            headers: { 
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }
      
      // If user is motoboy, they can only update orders to 'completed' and only if they're currently 'delivering'
      if (payload.role === 'motoboy') {
        // Create Supabase client
        const supabaseClient = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_ANON_KEY") ?? ""
        );
        
        // Get current order status
        const { data: order, error: orderError } = await supabaseClient
          .from("orders")
          .select("status")
          .eq("id", orderId)
          .single();
        
        if (orderError) {
          console.error("Error fetching order:", orderError);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: "Error fetching order status"
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
        
        if (!order) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: "Order not found"
            }),
            { 
              status: 404, 
              headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
              }
            }
          );
        }
        
        if (status !== 'completed' || order.status !== 'delivering') {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: "Motoboys can only change orders from 'delivering' to 'completed'"
            }),
            { 
              status: 403, 
              headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
              }
            }
          );
        }
      }
      
      // Create Supabase client
      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? ""
      );
      
      // Update order status
      const { data, error } = await supabaseClient
        .from("orders")
        .update({ status })
        .eq("id", orderId)
        .select("id, status")
        .single();
      
      if (error) {
        console.error("Error updating order status:", error);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Database error while updating order status"
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
      
      if (!data) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Order not found"
          }),
          { 
            status: 404, 
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
          order: data
        }),
        { 
          status: 200, 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
      
    } catch (jwtError) {
      console.error("JWT verification error:", jwtError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid or expired token" 
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
