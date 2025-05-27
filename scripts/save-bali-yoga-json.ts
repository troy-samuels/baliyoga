import { ensureDataDir, mockStudios, mockRetreats, saveStudios, saveRetreats } from "../lib/data-utils"

// Function to save mock data
async function saveMockData() {
  try {
    // Ensure the data directory exists
    ensureDataDir()

    // Save the mock data
    saveStudios(mockStudios)
    saveRetreats(mockRetreats)

    console.log(`Successfully saved ${mockStudios.length} mock studios and ${mockRetreats.length} mock retreats.`)
  } catch (error) {
    console.error("Error saving mock data:", error)
  }
}

// Run the function
saveMockData()
