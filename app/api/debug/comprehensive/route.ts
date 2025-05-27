import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  const debugResults = {
    timestamp: new Date().toISOString(),
    environment: {},
    connection: {},
    tableAccess: {},
    dataQuery: {},
    errors: [],
  }

  try {
    // 1. Check Environment Variables
    debugResults.environment = {
      nodeEnv: process.env.NODE_ENV,
      hasPublicUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasPublicKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServerUrl: !!process.env.SUPABASE_URL,
      hasServerKey: !!process.env.SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      publicUrlValue: process.env.NEXT_PUBLIC_SUPABASE_URL
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30)}...`
        : "Not set",
      publicKeyValue: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...`
        : "Not set",
    }

    // 2. Test Supabase Connection
    let supabase
    try {
      supabase = createServerClient()
      debugResults.connection.clientCreated = true
    } catch (error) {
      debugResults.connection.clientCreated = false
      debugResults.connection.clientError = error instanceof Error ? error.message : "Unknown error"
      debugResults.errors.push(`Failed to create Supabase client: ${error}`)
    }

    if (supabase) {
      // 3. Test Basic Connection
      try {
        const { data, error } = await supabase.from("information_schema.tables").select("table_name").limit(1)

        debugResults.connection.basicConnection = !error
        debugResults.connection.basicError = error?.message
        if (error) debugResults.errors.push(`Basic connection failed: ${error.message}`)
      } catch (error) {
        debugResults.connection.basicConnection = false
        debugResults.connection.basicError = error instanceof Error ? error.message : "Unknown error"
        debugResults.errors.push(`Basic connection exception: ${error}`)
      }

      // 4. Test Table Access - Try Multiple Variations
      const tableVariations = [
        "Bali Yoga Studios and Retreats",
        "bali_yoga_studios_and_retreats",
        "Bali_Yoga_Studios_and_Retreats",
        "bali-yoga-studios-and-retreats",
        "yoga_studios_and_retreats",
        "yoga_data",
        "listings",
      ]

      debugResults.tableAccess.variations = []

      for (const tableName of tableVariations) {
        try {
          const { data, error, count } = await supabase.from(tableName).select("*", { count: "exact" }).limit(1)

          debugResults.tableAccess.variations.push({
            tableName,
            accessible: !error,
            recordCount: count || 0,
            error: error?.message,
            sampleRecord: data?.[0] || null,
          })

          if (!error && count && count > 0) {
            debugResults.tableAccess.workingTable = tableName
            debugResults.tableAccess.totalRecords = count
          }
        } catch (error) {
          debugResults.tableAccess.variations.push({
            tableName,
            accessible: false,
            recordCount: 0,
            error: error instanceof Error ? error.message : "Unknown error",
            sampleRecord: null,
          })
        }
      }

      // 5. Test Specific Data Queries (if we found a working table)
      if (debugResults.tableAccess.workingTable) {
        const workingTable = debugResults.tableAccess.workingTable

        try {
          // Test studio categories
          const studioCategories = ["Yoga studio", "Pilates studio", "Fitness center", "Gym", "Meditation center"]
          const { data: studioData, error: studioError } = await supabase
            .from(workingTable)
            .select("id, name, category_name, city")
            .in("category_name", studioCategories)
            .limit(5)

          debugResults.dataQuery.studios = {
            found: studioData?.length || 0,
            error: studioError?.message,
            sample: studioData || [],
          }

          // Test retreat categories
          const retreatCategories = [
            "Yoga retreat center",
            "Retreat center",
            "Wellness center",
            "Wellness hotel",
            "Resort hotel",
            "Ashram",
            "Health spa",
            "Spa",
          ]
          const { data: retreatData, error: retreatError } = await supabase
            .from(workingTable)
            .select("id, name, category_name, city")
            .in("category_name", retreatCategories)
            .limit(5)

          debugResults.dataQuery.retreats = {
            found: retreatData?.length || 0,
            error: retreatError?.message,
            sample: retreatData || [],
          }

          // Get all unique categories
          const { data: categoryData, error: categoryError } = await supabase.from(workingTable).select("category_name")

          if (!categoryError && categoryData) {
            const categories = categoryData.map((item) => item.category_name)
            const uniqueCategories = [...new Set(categories)]
            debugResults.dataQuery.allCategories = uniqueCategories.sort()
            debugResults.dataQuery.categoryCount = uniqueCategories.length
          }
        } catch (error) {
          debugResults.dataQuery.error = error instanceof Error ? error.message : "Unknown error"
          debugResults.errors.push(`Data query failed: ${error}`)
        }
      }

      // 6. Test RLS (Row Level Security) Policies
      try {
        const { data, error } = await supabase
          .from(debugResults.tableAccess.workingTable || "Bali Yoga Studios and Retreats")
          .select("id")
          .limit(1)

        debugResults.connection.rlsTest = {
          canRead: !error,
          error: error?.message,
        }

        if (error && error.message.includes("permission")) {
          debugResults.errors.push("RLS (Row Level Security) may be blocking access")
        }
      } catch (error) {
        debugResults.connection.rlsTest = {
          canRead: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    }

    // 7. Summary and Recommendations
    debugResults.summary = {
      hasWorkingConnection: debugResults.connection.basicConnection,
      hasAccessibleTable: !!debugResults.tableAccess.workingTable,
      hasData: (debugResults.dataQuery.studios?.found || 0) + (debugResults.dataQuery.retreats?.found || 0) > 0,
      totalErrors: debugResults.errors.length,
    }

    debugResults.recommendations = []

    if (!debugResults.environment.hasPublicUrl || !debugResults.environment.hasPublicKey) {
      debugResults.recommendations.push(
        "❌ Missing environment variables - check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
      )
    }

    if (!debugResults.connection.basicConnection) {
      debugResults.recommendations.push("❌ Cannot connect to Supabase - check your URL and API key")
    }

    if (!debugResults.tableAccess.workingTable) {
      debugResults.recommendations.push("❌ Cannot access any tables - check table name and permissions")
    }

    if (debugResults.connection.rlsTest && !debugResults.connection.rlsTest.canRead) {
      debugResults.recommendations.push("❌ Row Level Security may be blocking access - check RLS policies")
    }

    if (
      debugResults.tableAccess.workingTable &&
      !debugResults.dataQuery.studios?.found &&
      !debugResults.dataQuery.retreats?.found
    ) {
      debugResults.recommendations.push("⚠️ Table accessible but no matching categories found - check category filters")
    }

    if (
      debugResults.summary.hasWorkingConnection &&
      debugResults.summary.hasAccessibleTable &&
      debugResults.summary.hasData
    ) {
      debugResults.recommendations.push("✅ Everything looks good! The issue may be in the frontend code.")
    }

    return NextResponse.json(debugResults)
  } catch (error) {
    debugResults.errors.push(`Critical error: ${error instanceof Error ? error.message : "Unknown error"}`)
    return NextResponse.json(debugResults, { status: 500 })
  }
}
