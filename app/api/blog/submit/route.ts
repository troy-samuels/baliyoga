import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { z } from "zod"

const SUBMISSIONS_FILE = path.join(process.cwd(), "data", "blog-submissions.json")

// Validation schema
const blogSubmissionSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  content: z.string().min(10).max(10000).trim(),
  authorName: z.string().min(1).max(100).trim(),
  email: z.string().email().max(255).trim().toLowerCase(),
  category: z.string().min(1).max(50).trim(),
  tags: z.array(z.string().min(1).max(30).trim()).max(10).optional(),
})

// Simple in-memory rate limiting (use Redis in production)
const rateLimitMap = new Map()

function rateLimit(ip: string, limit = 5, windowMs = 60000) {
  const now = Date.now()
  const windowStart = now - windowMs
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, [])
  }
  
  const requests = rateLimitMap.get(ip).filter((time: number) => time > windowStart)
  
  if (requests.length >= limit) {
    return false
  }
  
  requests.push(now)
  rateLimitMap.set(ip, requests)
  return true
}

// Ensure submissions file exists
function ensureSubmissionsFile() {
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  if (!fs.existsSync(SUBMISSIONS_FILE)) {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify([], null, 2))
  }
}

function loadSubmissions() {
  ensureSubmissionsFile()
  try {
    const data = fs.readFileSync(SUBMISSIONS_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

function saveSubmissions(submissions: any[]) {
  ensureSubmissionsFile()
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2))
}

export async function POST(request: Request) {
  // Get client IP
  const ip = request.headers.get('x-forwarded-for') || 
            request.headers.get('x-real-ip') || 
            'unknown'
  
  // Apply rate limiting
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }

  try {
    const submissionData = await request.json()
    
    // Validate input data
    const validatedData = blogSubmissionSchema.parse(submissionData)

    const submissions = loadSubmissions()

    const newSubmission = {
      id: Date.now().toString(),
      ...validatedData,
      status: "pending",
      submittedAt: new Date().toISOString(),
      wordCount: validatedData.content.split(/\s+/).filter((word: string) => word.length > 0).length,
    }

    submissions.push(newSubmission)
    saveSubmissions(submissions)

    // In a real app, you might want to send an email notification here
    console.log("New blog submission received:", {
      id: newSubmission.id,
      title: newSubmission.title,
      author: newSubmission.authorName,
      wordCount: newSubmission.wordCount,
    })

    return NextResponse.json({ success: true, id: newSubmission.id }, { status: 201 })
  } catch (error) {
    console.error("Error saving blog submission:", error)
    return NextResponse.json({ error: "Failed to submit blog post" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const submissions = loadSubmissions()
    return NextResponse.json(submissions)
  } catch (error) {
    return NextResponse.json({ error: "Failed to load submissions" }, { status: 500 })
  }
}
