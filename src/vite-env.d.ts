
/// <reference types="vite/client" />

// Supabase JSON types
interface JsonObject {
  [key: string]: Json;
}

type Json = string | number | boolean | null | JsonObject | Json[];

