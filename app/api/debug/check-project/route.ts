import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  // Disable debug endpoints in production for security
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const supabase = createServerClient()

    // Get project information
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const projectRef = supabaseUrl ? supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] : null

    return NextResponse.json({
      project: {
        ref: projectRef,
        url: supabaseUrl,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}