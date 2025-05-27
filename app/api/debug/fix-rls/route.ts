import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST() {
  try {
    const supabase = createServerClient()
    const tableName = "Bali Yoga Studios and Retreats"

    // Try to disable RLS using service role key
    const { data, error } = await supabase.rpc("disable_rls_for_table", {
      table_name: tableName,
    })

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        manualSteps: [
          "Since we can't disable RLS programmatically, please do this manually:",
          "1. Go to https://supabase.com/dashboard/project/zioqkkdhvgrkznxyxtik/auth/policies",
          "2. Find your table 'Bali Yoga Studios and Retreats'",
          "3. Click 'Disable RLS' or create a policy for public read access",
          '4. SQL to disable RLS: ALTER TABLE "Bali Yoga Studios and Retreats" DISABLE ROW LEVEL SECURITY;',
          '5. Or create a policy: CREATE POLICY "Enable read access for all users" ON "Bali Yoga Studios and Retreats" FOR SELECT USING (true);',
        ],
      })
    }

    return NextResponse.json({
      success: true,
      message: "RLS disabled successfully",
      data,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        manualSteps: [
          "Please disable RLS manually:",
          "1. Go to https://supabase.com/dashboard/project/zioqkkdhvgrkznxyxtik/auth/policies",
          "2. Find your table 'Bali Yoga Studios and Retreats'",
          "3. Click 'Disable RLS' or create a policy for public read access",
        ],
      },
      { status: 500 },
    )
  }
}
