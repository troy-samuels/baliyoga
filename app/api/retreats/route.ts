import { NextResponse } from "next/server"
import { getSupabaseRetreats } from "@/lib/supabase-data-utils"

export async function GET() {
  try {
    const retreats = await getSupabaseRetreats()
    return NextResponse.json(retreats)
  } catch (error) {
    console.error("Error fetching retreats:", error)
    return NextResponse.json({ error: "Failed to fetch retreats" }, { status: 500 })
  }
}
