import fs from "fs"
import path from "path"
import { ensureDataDir, mockStudios, mockRetreats } from "../lib/data-utils"

// Function to initialize data files
async function initializeData() {
  try {
    // Ensure the data directory exists
    ensureDataDir()

    const studiosPath = path.join(process.cwd(), "data", "studios.json")
    const retreatsPath = path.join(process.cwd(), "data", "retreats.json")

    // Write mock studios data
    fs.writeFileSync(studiosPath, JSON.stringify(mockStudios, null, 2))
    console.log(`Created mock studios data with ${mockStudios.length} entries`)

    // Write mock retreats data
    fs.writeFileSync(retreatsPath, JSON.stringify(mockRetreats, null, 2))
    console.log(`Created mock retreats data with ${mockRetreats.length} entries`)

    console.log("Data initialization complete")
  } catch (error) {
    console.error("Error initializing data:", error)
  }
}

// Run the initialization
initializeData()
