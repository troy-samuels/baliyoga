import fs from "fs"
import path from "path"
import { ensureDataDir } from "../lib/data-utils"

// Save the JSON data to a file
async function saveJsonData() {
  try {
    // Ensure the data directory exists
    ensureDataDir()

    // The JSON data as a string (this would be the content of the uploaded file)
    const jsonData = `[
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
  /* ... rest of the JSON data ... */
]`

    // Save the JSON data to a file
    fs.writeFileSync(path.join(process.cwd(), "data", "bali-yoga-data.json"), jsonData)

    console.log("Successfully saved JSON data to file.")
  } catch (error) {
    console.error("Error saving JSON data:", error)
  }
}

// Run the save function
saveJsonData()
