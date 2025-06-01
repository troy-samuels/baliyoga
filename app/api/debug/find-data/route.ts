import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()

    // 1. Try to find all tables in the database using a different approach
    const tableSearchResults: any[] = []

    // Common table name patterns for your data
    const possibleTableNames = [
      "Bali Yoga Studios and Retreats",
      "bali_yoga_studios_and_retreats",
      "Bali_Yoga_Studios_and_Retreats",
      "bali-yoga-studios-and-retreats",
      "yoga_studios",
      "retreats",
      "studios",
      "listings",
      "yoga_data",
      "bali_yoga",
      "yoga_listings",
      "bali_listings",
      "yoga_centers",
      "wellness_centers",
      // Try some variations with different casing
      "BALI YOGA STUDIOS AND RETREATS",
      "bali yoga studios and retreats",
    ]

    // Test each possible table name
    for (const tableName of possibleTableNames) {
      try {
        const { data, error, count } = await supabase.from(tableName).select("*", { count: "exact" }).limit(3)

        tableSearchResults.push({
          tableName,
          exists: !error,
          recordCount: count || 0,
          error: error?.message,
          sampleData: data || [],
          hasData: (count || 0) > 0,
          columns: []
        })

        // If we find data, also get column info
        if (!error && count && count > 0) {
          const sampleRecord = data?.[0]
          if (sampleRecord) {
            tableSearchResults[tableSearchResults.length - 1].columns = Object.keys(sampleRecord)
          }
        }
      } catch (error) {
        tableSearchResults.push({
          tableName,
          exists: false,
          recordCount: 0,
          error: error instanceof Error ? error.message : "Unknown error",
          sampleData: [],
          hasData: false,
          columns: []
        })
      }
    }

    // 2. Try to get schema information using pg_tables
    let schemaInfo = null
    try {
      const { data: schemaData, error: schemaError } = await supabase.rpc("get_schema_info").select()

      if (!schemaError) {
        schemaInfo = schemaData
      }
    } catch (error) {
      // This might not work, that's okay
    }

    // 3. Try a direct SQL query to find tables (if RPC is available)
    let sqlTableList = null
    try {
      const { data: sqlData, error: sqlError } = await supabase.rpc("exec_sql", {
        query: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
      })

      if (!sqlError) {
        sqlTableList = sqlData
      }
    } catch (error) {
      // This might not work either
    }

    // 4. Check if there are any tables with yoga/bali related data by trying common patterns
    const dataSearchResults = []

    // Try searching for any table that might contain yoga/bali data
    const searchPatterns = [
      { pattern: "yoga", description: "Tables containing 'yoga'" },
      { pattern: "bali", description: "Tables containing 'bali'" },
      { pattern: "studio", description: "Tables containing 'studio'" },
      { pattern: "retreat", description: "Tables containing 'retreat'" },
    ]

    // 5. Summary of findings
    const tablesWithData = tableSearchResults.filter((t) => t.hasData)
    const accessibleTables = tableSearchResults.filter((t) => t.exists)

    return NextResponse.json({
      success: true,
      summary: {
        totalTablesChecked: possibleTableNames.length,
        accessibleTables: accessibleTables.length,
        tablesWithData: tablesWithData.length,
        totalRecordsFound: tablesWithData.reduce((sum, t) => sum + t.recordCount, 0),
      },
      tableSearchResults,
      tablesWithData,
      schemaInfo,
      sqlTableList,
      recommendations: [
        tablesWithData.length === 0
          ? "❌ No tables found with data - your 459 records may be in a different database/project"
          : "✅ Found tables with data",
        accessibleTables.length === 0
          ? "❌ No accessible tables found - check permissions"
          : `✅ Found ${accessibleTables.length} accessible tables`,
        "💡 Check if you're connected to the correct Supabase project",
        "💡 Verify the data wasn't accidentally deleted",
        "💡 Check if data is in a different schema (not 'public')",
      ],
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
