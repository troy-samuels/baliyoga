import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()

    // Get project information
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const projectRef = supabaseUrl ? supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] : null

    // Try to get some basic project info
    const projectInfo = {
      url: supabaseUrl,
      projectRef: projectRef,
      expectedProject: "supabase-bali-yoga", // What the user mentioned
    }

    // Test if we can access any data at all
    let anyDataFound = false
    let totalRecords = 0
    const sampleTables = []

    // Try some very common table names that might exist
    const commonTables = [
      "users",
      "profiles",
      "posts",
      "items",
      "data",
      "records",
      "listings",
      "Bali Yoga Studios and Retreats",
      "yoga",
      "studios",
      "retreats",
    ]

    for (const tableName of commonTables) {
      try {
        const { data, error, count } = await supabase.from(tableName).select("*", { count: "exact" }).limit(1)

        if (!error && count !== null) {
          anyDataFound = true
          totalRecords += count
          sampleTables.push({
            name: tableName,
            records: count,
            sample: data?.[0] || null,
          })
        }
      } catch (error) {
        // Ignore errors for tables that don't exist
      }
    }

    // Try to determine if this is the right project
    const isCorrectProject = projectRef === "zioqkkdhvgrkznxyxtik" // From the URL we saw
    const hasExpectedData = sampleTables.some((t) => t.name.includes("Bali") || t.name.includes("yoga"))

    return NextResponse.json({
      success: true,
      projectInfo,
      dataCheck: {
        anyDataFound,
        totalRecords,
        sampleTables,
        hasExpectedData,
      },
      analysis: {
        isCorrectProject,
        possibleIssues: [
          !anyDataFound ? "No data found in any tables - database might be empty" : null,
          !hasExpectedData ? "No yoga/Bali related data found - might be wrong project" : null,
          projectRef !== "supabase-bali-yoga" ? "Project reference doesn't match expected 'supabase-bali-yoga'" : null,
          totalRecords === 0 ? "Database appears to be completely empty" : null,
        ].filter(Boolean),
      },
      recommendations: [
        "🔍 Check if you're connected to the correct Supabase project",
        "📊 Verify your data exists in the Supabase dashboard",
        "🔄 Try re-importing your data if it was accidentally deleted",
        "🔑 Check if you're using the correct API keys for the right project",
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
