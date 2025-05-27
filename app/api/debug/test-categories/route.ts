import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()

    // Get a sample of records to see the data structure
    const { data: sampleData, error: sampleError } = await supabase
      .from("Bali Yoga Studios and Retreats")
      .select("*")
      .limit(5)

    if (sampleError) {
      return NextResponse.json({ error: sampleError.message }, { status: 500 })
    }

    // Get all unique categories
    const { data: categories, error: catError } = await supabase
      .from("Bali Yoga Studios and Retreats")
      .select("category_name")
      .not("category_name", "is", null)

    if (catError) {
      return NextResponse.json({ error: catError.message }, { status: 500 })
    }

    const uniqueCategories = [...new Set(categories?.map((item) => item.category_name) || [])]

    // Check what columns exist in the table
    const { data: tableInfo, error: tableError } = await supabase
      .from("Bali Yoga Studios and Retreats")
      .select("*")
      .limit(1)

    const availableColumns = tableInfo && tableInfo.length > 0 ? Object.keys(tableInfo[0]) : []

    return NextResponse.json({
      success: true,
      totalRecords: categories?.length || 0,
      uniqueCategories: uniqueCategories.sort(),
      availableColumns: availableColumns.sort(),
      sampleRecord: sampleData?.[0] || null,
      message: "Data structure analysis complete",
    })
  } catch (error) {
    console.error("Error analyzing data:", error)
    return NextResponse.json({ error: "Failed to analyze data structure" }, { status: 500 })
  }
}
