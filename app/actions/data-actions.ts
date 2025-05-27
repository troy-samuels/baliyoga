"use server"

import { revalidatePath } from "next/cache"
import {
  saveStudio,
  saveRetreat,
  deleteStudio as removeStudioUtil,
  deleteRetreat as removeRetreatUtil,
  importData,
} from "@/lib/data-utils"

// Function to handle studio form submission
export async function handleStudioForm(formData: FormData) {
  try {
    // Extract form data
    const name = formData.get("name") as string
    const slug = (formData.get("slug") as string) || name.toLowerCase().replace(/\s+/g, "-")
    const location = formData.get("location") as string
    const rating = Number.parseFloat(formData.get("rating") as string) || 4.5
    const reviewCount = Number.parseInt(formData.get("reviewCount") as string) || 0
    const image = formData.get("image") as string
    const styles = (formData.get("styles") as string).split(",").map((style) => style.trim())
    const tagline = formData.get("tagline") as string
    const description = formData.get("description") as string
    const dropInPrice = formData.get("dropInPrice") as string
    const weeklyPrice = formData.get("weeklyPrice") as string
    const monthlyPrice = formData.get("monthlyPrice") as string
    const address = formData.get("address") as string
    const area = formData.get("area") as string
    const id = formData.get("id") as string

    // Create studio object
    const studio = {
      id: id || Date.now().toString(),
      name,
      slug,
      location,
      rating,
      reviewCount,
      image,
      styles,
      tagline,
      description,
      price: {
        dropIn: dropInPrice,
        weekly: weeklyPrice,
        monthly: monthlyPrice,
      },
      location_details: {
        address,
        area,
      },
      type: "studio",
    }

    // Save studio
    saveStudio(studio)

    // Revalidate paths
    revalidatePath("/studios")
    revalidatePath("/admin")

    return { success: true, message: "Studio saved successfully" }
  } catch (error) {
    console.error("Error saving studio:", error)
    return { success: false, message: `Error: ${error instanceof Error ? error.message : "Unknown error"}` }
  }
}

// Function to handle retreat form submission
export async function handleRetreatForm(formData: FormData) {
  try {
    // Extract form data
    const name = formData.get("name") as string
    const slug = (formData.get("slug") as string) || name.toLowerCase().replace(/\s+/g, "-")
    const location = formData.get("location") as string
    const rating = Number.parseFloat(formData.get("rating") as string) || 4.5
    const reviewCount = Number.parseInt(formData.get("reviewCount") as string) || 0
    const image = formData.get("image") as string
    const duration = formData.get("duration") as string
    const price = formData.get("price") as string
    const tagline = formData.get("tagline") as string
    const description = formData.get("description") as string
    const styles = (formData.get("styles") as string).split(",").map((style) => style.trim())
    const includes = (formData.get("includes") as string).split(",").map((include) => include.trim())
    const address = formData.get("address") as string
    const area = formData.get("area") as string
    const id = formData.get("id") as string

    // Create retreat object
    const retreat = {
      id: id || Date.now().toString(),
      name,
      slug,
      location,
      rating,
      reviewCount,
      image,
      duration,
      price,
      tagline,
      description,
      styles,
      includes,
      location_details: {
        address,
        area,
      },
      type: "retreat",
    }

    // Save retreat
    saveRetreat(retreat)

    // Revalidate paths
    revalidatePath("/retreats")
    revalidatePath("/admin")

    return { success: true, message: "Retreat saved successfully" }
  } catch (error) {
    console.error("Error saving retreat:", error)
    return { success: false, message: `Error: ${error instanceof Error ? error.message : "Unknown error"}` }
  }
}

// Function to remove a studio
export async function removeStudio(id: number | string) {
  try {
    removeStudioUtil(id)

    // Revalidate paths
    revalidatePath("/studios")
    revalidatePath("/admin")

    return { success: true, message: "Studio deleted successfully" }
  } catch (error) {
    console.error("Error deleting studio:", error)
    return { success: false, message: `Error: ${error instanceof Error ? error.message : "Unknown error"}` }
  }
}

// Function to remove a retreat
export async function removeRetreat(id: number | string) {
  try {
    removeRetreatUtil(id)

    // Revalidate paths
    revalidatePath("/retreats")
    revalidatePath("/admin")

    return { success: true, message: "Retreat deleted successfully" }
  } catch (error) {
    console.error("Error deleting retreat:", error)
    return { success: false, message: `Error: ${error instanceof Error ? error.message : "Unknown error"}` }
  }
}

// Function to upload JSON data
export async function uploadJsonData(formData: FormData) {
  try {
    const type = formData.get("type") as "studios" | "retreats"
    const file = formData.get("file") as File

    if (!file) {
      return { success: false, message: "No file provided" }
    }

    // Read file content
    const fileContent = await file.text()
    const data = JSON.parse(fileContent)

    if (!Array.isArray(data)) {
      return { success: false, message: "Invalid JSON format. Expected an array." }
    }

    // Import data
    importData(type, data)

    // Revalidate paths
    revalidatePath("/studios")
    revalidatePath("/retreats")
    revalidatePath("/admin")

    return { success: true, message: `${data.length} ${type} imported successfully` }
  } catch (error) {
    console.error("Error uploading JSON data:", error)
    return { success: false, message: `Error: ${error instanceof Error ? error.message : "Unknown error"}` }
  }
}
