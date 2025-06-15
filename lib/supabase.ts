import { createClient } from "@supabase/supabase-js"
import { config, validateEnvironment } from "./config"

// Create a browser client
export const getSupabaseBrowserClient = () => {
  // Validate environment variables first
  validateEnvironment()
  
  return createClient(config.supabase.url, config.supabase.anonKey)
}

// Create a server client (to be used in Server Components and Server Actions)
export const createServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    throw new Error("Missing Supabase URL. Please set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL environment variable")
  }

  if (!supabaseServiceKey) {
    throw new Error(
      "Missing Supabase key. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY environment variable",
    )
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}
