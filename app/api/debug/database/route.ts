import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  // Disable debug endpoints in production for security
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  try {
    const supabase = createServerClient()

    // First, let's try to list all tables in the database
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")

    // Try different possible table names
    const possibleTableNames = [
      "Bali Yoga Studios and Retreats",
      "bali_yoga_studios_and_retreats",
      "yoga_studios",
      "retreats",
      "studios",
      "bali_yoga",
      "yoga_data",
      "listings",
    ]

    const tableResults = []

    for (const tableName of possibleTableNames) {
      try {
        const { data, error, count } = await supabase.from(tableName).select("*", { count: "exact" }).limit(3)

        tableResults.push({
          tableName,
          exists: !error,
          error: error?.message,
          count: count || 0,
          sampleData: data || [],
        })
      } catch (err) {
        tableResults.push({
          tableName,
          exists: false,
          error: err instanceof Error ? err.message : "Unknown error",
          count: 0,
          sampleData: [],
        })
      }
    }

    // Try to get database info
    let dbInfo = null
    try {
      const { data: dbData } = await supabase.from("pg_database").select("datname").limit(1)
      dbInfo = dbData
    } catch (err) {
      // Ignore this error, it's just for extra info
    }

    return NextResponse.json({
      success: true,
      availableTables: tables || [],
      tablesError: tablesError?.message,
      tableTests: tableResults,
      databaseInfo: dbInfo,
      connectionDetails: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30)}...`
          : "Not set",
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
