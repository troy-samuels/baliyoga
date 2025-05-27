import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()

    // Get the Supabase URL to see the project
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL

    // Extract project reference from URL
    const projectRef = supabaseUrl ? supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] : null

    // Try to get all tables in the public schema using a simpler approach
    let tables = []
    let tablesError = null

    try {
      const { data: tableData, error } = await supabase
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_schema", "public")

      tables = tableData || []
      tablesError = error?.message
    } catch (err) {
      tablesError = err instanceof Error ? err.message : "Could not fetch table list"
    }

    // Try the exact table name we're using
    const targetTableName = "Bali Yoga Studios and Retreats"
    const {
      data: targetTableData,
      error: targetTableError,
      count,
    } = await supabase.from(targetTableName).select("*", { count: "exact" }).limit(3)

    // Also try some variations of the table name
    const tableVariations = [
      "Bali Yoga Studios and Retreats",
      "bali_yoga_studios_and_retreats",
      "Bali_Yoga_Studios_and_Retreats",
      "bali-yoga-studios-and-retreats",
      "yoga_studios",
      "retreats",
      "studios",
      "listings",
    ]

    const variationResults = []
    for (const tableName of tableVariations) {
      try {
        const { data, error, count } = await supabase
          .from(tableName)
          .select("id, name, category_name", { count: "exact" })
          .limit(2)

        variationResults.push({
          tableName,
          exists: !error,
          count: count || 0,
          error: error?.message,
          sampleData: data || [],
        })
      } catch (err) {
        variationResults.push({
          tableName,
          exists: false,
          count: 0,
          error: err instanceof Error ? err.message : "Unknown error",
          sampleData: [],
        })
      }
    }

    return NextResponse.json({
      success: true,
      connection: {
        supabaseUrl: supabaseUrl ? `${supabaseUrl.substring(0, 50)}...` : "Not found",
        projectReference: projectRef || "Could not extract",
        fullUrl: supabaseUrl,
      },
      targetTable: {
        name: targetTableName,
        exists: !targetTableError,
        recordCount: count || 0,
        error: targetTableError?.message,
        sampleData: targetTableData || [],
      },
      allTables: tables,
      tablesError: tablesError,
      tableVariations: variationResults,
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
