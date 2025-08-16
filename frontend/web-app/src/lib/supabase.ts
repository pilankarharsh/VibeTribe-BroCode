import { createClient } from "@supabase/supabase-js";

// Create the Supabase client only on the client side
export const supabase = typeof window !== 'undefined' 
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  : null;

export function getSupabaseClient() {
  if (typeof window === 'undefined') {
    throw new Error('Supabase client can only be used on the client side');
  }
  
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }
  
  return supabase;
}