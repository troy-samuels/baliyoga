import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const SUBMISSIONS_FILE = path.join(process.cwd(), "data", "blog-submissions.json")

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
  try {
    const submissionData = await request.json()
    const submissions = loadSubmissions()

    const newSubmission = {
      id: Date.now().toString(),
      ...submissionData,
      status: "pending",
      submittedAt: new Date().toISOString(),
      wordCount: submissionData.content.split(/\s+/).filter((word: string) => word.length > 0).length,
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
