import fs from "fs"
import path from "path"
import { ensureDataDir, type Studio, type Retreat } from "../lib/data-utils"

// Interface for the raw JSON data items
interface RawDataItem {
  name: string
  category_name?: string
  city?: string
  review_score?: number
  review_count?: number
  images?: string[]
  price?: string
  description?: string
  address?: string
  phone_number?: string
  website?: string
  opening_hours?: Array<{
    day: string
    hours: string
  }>
}

// Function to process the JSON data and save it to the data directory
async function importBaliYogaData() {
  try {
    // Ensure the data directory exists
    ensureDataDir()

    // Read the JSON file - we'll use the raw JSON data directly
    const jsonData: RawDataItem[] = [
      // The entire JSON content would be pasted here
      // For brevity, I'm not including the full content in this code block
    ]

    console.log(`Processing ${jsonData.length} entries from the JSON file...`)

    // Arrays to store processed data
    const studios: Studio[] = []
    const retreats: Retreat[] = []

    // Process each entry
    jsonData.forEach((item: RawDataItem, index: number) => {
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
          ? item.opening_hours.map((hour) => ({
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
    console.error("Error importing data:", error)
  }
}

// Run the import function
importBaliYogaData()
