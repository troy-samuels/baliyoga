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
    
    // Validate and sanitize file path to prevent directory traversal
    if (!filePath || typeof filePath !== 'string') {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 })
    }
    
    // Resolve the file path and ensure it's within allowed directories
    const resolvedPath = path.resolve(filePath)
    const allowedUploadDir = path.resolve(process.cwd(), 'public', 'images')
    const tempDir = path.resolve('/tmp')
    
    // Check if file is in allowed directories
    if (!resolvedPath.startsWith(allowedUploadDir) && !resolvedPath.startsWith(tempDir)) {
      return NextResponse.json({ error: "Access denied: Invalid file location" }, { status: 403 })
    }
    
    if (!fs.existsSync(resolvedPath)) {
      return NextResponse.json({ error: "Source file not found" }, { status: 400 })
    }

    // Validate file type
    const ext = path.extname(resolvedPath).toLowerCase()
    const allowedExts = [".jpg", ".jpeg", ".png", ".webp"]
    if (!allowedExts.includes(ext)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP images are allowed." },
        { status: 400 }
      )
    }

    // Generate safe filename
    const timestamp = Date.now()
    const baseName = newName || path.basename(resolvedPath)
    const cleanName = baseName.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${timestamp}_${cleanName}`
    
    // Validate filename doesn't contain path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 })
    }
    
    // Create upload directory securely
    const uploadDir = path.join(process.cwd(), "public", "images", "blog")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // Copy file securely
    const destPath = path.join(uploadDir, filename)
    const resolvedDestPath = path.resolve(destPath)
    
    // Ensure destination is within the upload directory
    if (!resolvedDestPath.startsWith(path.resolve(uploadDir))) {
      return NextResponse.json({ error: "Invalid destination path" }, { status: 400 })
    }
    
    fs.copyFileSync(resolvedPath, resolvedDestPath)

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