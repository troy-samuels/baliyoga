import { NextResponse } from "next/server"
import { ensureDataDir, getStudios, getRetreats } from "@/lib/data-utils"

export async function GET() {
  try {
    // Ensure data directory and files exist
    ensureDataDir()

    // Get the data to verify it's working
    const studios = getStudios()
    const retreats = getRetreats()

    return NextResponse.json({
      success: true,
      message: "Data initialized successfully",
      studiosCount: studios.length,
      retreatsCount: retreats.length,
    })
  } catch (error) {
    console.error("Error initializing data:", error)
    return NextResponse.json(
      {
        success: false,
        message: `Error initializing data: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}
