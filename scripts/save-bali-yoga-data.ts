import fs from "fs"
import path from "path"
import { ensureDataDir } from "../lib/data-utils"

// The raw JSON data from the file
const rawData = `
[
  {
    "name": "Daily Bliss Yoga",
    "address": "Medewi, Pekutatan, Jembrana Regency, Bali 82262, Indonesia",
    "city": "Jembrana Regency",
    "postcode": "82262",
    "category_name": "Yoga studio",
    "images": [
      "https://lh5.googleusercontent.com/p/AF1QipM_f22kn9XBpG4_kWMHOcDgdllghU66wQ0nIxs5=w1920-h1080-k-no"
    ],
    "website": "https://www.instagram.com/dailyblissyoga/",
    "opening_hours": [
      {
        "day": "Monday",
        "hours": "7 AM to 6 PM"
      },
      {
        "day": "Tuesday",
        "hours": "7 AM to 6 PM"
      },
      {
        "day": "Wednesday",
        "hours": "7 AM to 6 PM"
      },
      {
        "day": "Thursday",
        "hours": "7 AM to 6 PM"
      },
      {
        "day": "Friday",
        "hours": "7 AM to 6 PM"
      },
      {
        "day": "Saturday",
        "hours": "7 AM to 6 PM"
      },
      {
        "day": "Sunday",
        "hours": "7 AM to 6 PM"
      }
    ],
    "phone_number": "+62 831-1499-3538",
    "review_score": 5,
    "review_count": 89
  },
  // ... all other entries from the JSON file would be here
]
`

// Function to save the raw JSON data
async function saveBaliYogaData() {
  try {
    // Ensure the data directory exists
    ensureDataDir()

    // Parse the JSON data to validate it
    const jsonData = JSON.parse(rawData)

    console.log(`Saving ${jsonData.length} entries to bali-yoga-data.json...`)

    // Save the raw data to a file
    fs.writeFileSync(path.join(process.cwd(), "data", "bali-yoga-data.json"), JSON.stringify(jsonData, null, 2))

    console.log("Successfully saved raw data to bali-yoga-data.json")
  } catch (error) {
    console.error("Error saving data:", error)
  }
}

// Run the function
saveBaliYogaData()
