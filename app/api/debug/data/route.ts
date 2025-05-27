import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()

    // Get all records with their images
    const { data, error } = await supabase
      .from("Bali Yoga Studios and Retreats")
      .select("id, name, images, category_name")
      .limit(5)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: data.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category_name,
        hasImages: !!item.images,
        imageCount: item.images?.length || 0,
        firstImage: item.images?.[0] || null
      }))
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
