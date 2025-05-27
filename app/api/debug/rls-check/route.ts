import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()
    const tableName = "Bali Yoga Studios and Retreats"

    // Test 1: Try to read with anon key
    const { data: anonData, error: anonError } = await supabase.from(tableName).select("*", { count: "exact" }).limit(5)

    // Test 2: Check if RLS is enabled
    const { data: rlsInfo, error: rlsError } = await supabase
      .from("pg_tables")
      .select("tablename, rowsecurity")
      .eq("tablename", tableName)

    // Test 3: Try to get table info
    const { data: tableInfo, error: tableError } = await supabase
      .from("information_schema.tables")
      .select("*")
      .eq("table_name", tableName)
      .eq("table_schema", "public")

    return NextResponse.json({
      success: true,
      tableName,
      tests: {
        anonAccess: {
          canRead: !anonError,
          recordCount: anonData?.length || 0,
          error: anonError?.message,
          errorCode: anonError?.code,
        },
        rlsStatus: {
          info: rlsInfo,
          error: rlsError?.message,
        },
        tableExists: {
          exists: !tableError && tableInfo && tableInfo.length > 0,
          info: tableInfo,
          error: tableError?.message,
        },
      },
      diagnosis: {
        isRLSBlocking: anonError?.message?.includes("permission") || anonError?.message?.includes("policy"),
        tableAccessible: !tableError,
        hasData: (anonData?.length || 0) > 0,
      },
      solution:
        anonError?.message?.includes("permission") || anonError?.message?.includes("policy")
          ? {
              problem: "Row Level Security (RLS) is blocking access",
              steps: [
                "1. Go to your Supabase dashboard",
                "2. Navigate to Authentication > Policies",
                "3. Find your table 'Bali Yoga Studios and Retreats'",
                "4. Either disable RLS or create a policy to allow public read access",
                "5. To disable RLS: Click the table, then 'Disable RLS'",
                "6. To create a policy: Click 'New Policy' > 'Enable read access for all users'",
              ],
            }
          : null,
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
