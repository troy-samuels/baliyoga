import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { writeFile } from "fs/promises"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP images are allowed." },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${timestamp}_${originalName}`
    
    // Create the upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public", "images", "blog")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // Write the file
    const filepath = path.join(uploadDir, filename)
    await writeFile(filepath, buffer)

    // Return the public URL
    const publicUrl = `/images/blog/${filename}`
    
    return NextResponse.json({ 
      message: "Upload successful", 
      url: publicUrl,
      filename: filename 
    })

  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    )
  }
}

// API to copy file from downloads folder
export async function PUT(request: Request) {
  try {
    const { filePath, newName } = await request.json()
    
    if (!filePath || !fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Source file not found" }, { status: 400 })
    }

    // Validate file type
    const ext = path.extname(filePath).toLowerCase()
    const allowedExts = [".jpg", ".jpeg", ".png", ".webp"]
    if (!allowedExts.includes(ext)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP images are allowed." },
        { status: 400 }
      )
    }

    // Generate filename
    const timestamp = Date.now()
    const cleanName = (newName || path.basename(filePath)).replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${timestamp}_${cleanName}`
    
    // Create upload directory
    const uploadDir = path.join(process.cwd(), "public", "images", "blog")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // Copy file
    const destPath = path.join(uploadDir, filename)
    fs.copyFileSync(filePath, destPath)

    const publicUrl = `/images/blog/${filename}`
    
    return NextResponse.json({ 
      message: "File copied successfully", 
      url: publicUrl,
      filename: filename 
    })

  } catch (error) {
    console.error("Error copying file:", error)
    return NextResponse.json(
      { error: "Failed to copy file" },
      { status: 500 }
    )
  }
} 