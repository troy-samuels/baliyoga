import fs from "fs"
import path from "path"
import { ensureDataDir, type Studio, type Retreat } from "../lib/data-utils"

// Function to process the JSON data and save it to the data directory
async function processBaliYogaJson() {
  try {
    // Ensure the data directory exists
    ensureDataDir()

    // Read the JSON file from the provided URL
    const jsonFilePath = path.join(process.cwd(), "data", "bali-yoga-data.json")

    if (!fs.existsSync(jsonFilePath)) {
      console.error("JSON file not found. Please save the JSON data first.")
      return
    }

    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"))

    console.log(`Processing ${jsonData.length} entries from the JSON file...`)

    // Arrays to store processed data
    const studios: Studio[] = []
    const retreats: Retreat[] = []

    // Process each entry
    jsonData.forEach((item: any, index: number) => {
      // Determine if it's a studio or retreat based on category_name
      const categoryName = (item.category_name || "").toLowerCase()

      const isRetreat =
        categoryName.includes("retreat") ||
        categoryName.includes("hotel") ||
        categoryName.includes("resort") ||
        categoryName.includes("wellness") ||
        categoryName.includes("spa")

      // Create a slug from the name
      const slug = item.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "")

      // Extract styles from category or set defaults
      const styles = ["Hatha", "Vinyasa"]
      if (categoryName.includes("yin")) styles.push("Yin")
      if (categoryName.includes("meditation")) styles.push("Meditation")
      if (categoryName.includes("ashtanga")) styles.push("Ashtanga")

      // Get the first valid image or use placeholder
      const image =
        item.images && item.images.length > 0 && item.images[0]
          ? item.images[0]
          : "/placeholder.svg?height=200&width=300&text=" + encodeURIComponent(item.name)

      // Format opening hours for display
      const formattedHours =
        item.opening_hours && item.opening_hours.length > 0
          ? item.opening_hours.map((hour: any) => ({
              day: hour.day,
              hours: hour.hours,
            }))
          : []

      if (isRetreat) {
        // Process as retreat
        const retreat: Retreat = {
          id: index + 1,
          name: item.name,
          slug: slug,
          location: item.city || "Bali",
          rating: item.review_score || 4.5,
          reviewCount: item.review_count || 0,
          image: image,
          duration: "7-14 days",
          price: item.price || "$1,200",
          tagline: `Experience tranquility at ${item.name}`,
          description: `Located in ${item.city || "Bali"}, ${item.name} offers a peaceful retreat experience.`,
          longDescription:
            item.description ||
            `${item.name} is a beautiful retreat center located in ${item.city || "Bali"}. Offering a range of wellness activities and yoga classes, this is the perfect place to relax and rejuvenate.`,
          styles: styles,
          includes: ["Accommodation", "Daily yoga classes", "Healthy meals"],
          type: "retreat",
          location_details: {
            address: item.address || "",
            area: item.city || "Bali",
          },
          phone_number: item.phone_number || "",
          website: item.website || "",
          opening_hours: formattedHours,
          category: item.category_name || "Retreat center",
        }
        retreats.push(retreat)
      } else {
        // Process as studio
        const studio: Studio = {
          id: index + 1,
          name: item.name,
          slug: slug,
          location: item.city || "Bali",
          rating: item.review_score || 4.5,
          reviewCount: item.review_count || 0,
          image: image,
          styles: styles,
          tagline: `Discover yoga at ${item.name}`,
          description: `Located in ${item.city || "Bali"}, ${item.name} offers various yoga classes.`,
          longDescription:
            item.description ||
            `${item.name} is a welcoming yoga studio in ${item.city || "Bali"} offering a variety of classes for all levels. Join us to deepen your practice in a supportive environment.`,
          price: {
            dropIn: "$15",
            weekly: "$75",
            monthly: "$220",
          },
          type: "studio",
          location_details: {
            address: item.address || "",
            area: item.city || "Bali",
          },
          phone_number: item.phone_number || "",
          website: item.website || "",
          opening_hours: formattedHours,
          category: item.category_name || "Yoga studio",
        }
        studios.push(studio)
      }
    })

    console.log(`Processed ${studios.length} studios and ${retreats.length} retreats.`)

    // Save the processed data
    fs.writeFileSync(path.join(process.cwd(), "data", "studios.json"), JSON.stringify(studios, null, 2))
    fs.writeFileSync(path.join(process.cwd(), "data", "retreats.json"), JSON.stringify(retreats, null, 2))

    console.log(`Successfully saved ${studios.length} studios and ${retreats.length} retreats.`)
  } catch (error) {
    console.error("Error processing JSON data:", error)
  }
}

import { mockStudios, mockRetreats, saveStudios, saveRetreats } from "../lib/data-utils"

// Function to initialize data with mock data
async function processMockData() {
  try {
    // Ensure the data directory exists
    ensureDataDir()

    // Save the mock data
    saveStudios(mockStudios)
    saveRetreats(mockRetreats)

    console.log(`Successfully saved ${mockStudios.length} studios and ${mockRetreats.length} retreats.`)
  } catch (error) {
    console.error("Error processing mock data:", error)
  }
}

// Run the function
// processBaliYogaJson()
processMockData()
