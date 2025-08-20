import { NextResponse } from "next/server"

export async function GET() {
  // Disable debug endpoints in production for security
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  
  try {
    const envVars = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing",
      SUPABASE_URL: process.env.SUPABASE_URL ? "✅ Set" : "❌ Missing",
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing",
    }

    // Also check the actual values (first few characters for security)
    const values = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 20)}...`
        : "Not set",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...`
        : "Not set",
    }

    return NextResponse.json({
      status: envVars,
      values: values,
      nodeEnv: process.env.NODE_ENV,
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
