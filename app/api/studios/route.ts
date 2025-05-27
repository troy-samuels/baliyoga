import { NextResponse } from "next/server"
import { getSupabaseStudios } from "@/lib/supabase-data-utils"

export async function GET() {
  try {
    const studios = await getSupabaseStudios()
    return NextResponse.json(studios)
  } catch (error) {
    console.error("Error fetching studios:", error)
    return NextResponse.json({ error: "Failed to fetch studios" }, { status: 500 })
  }
}
