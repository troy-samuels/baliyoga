import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const BLOG_DATA_FILE = path.join(process.cwd(), "data", "blog-posts.json")

// Ensure blog data file exists
function ensureBlogDataFile() {
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  if (!fs.existsSync(BLOG_DATA_FILE)) {
    fs.writeFileSync(BLOG_DATA_FILE, JSON.stringify([], null, 2))
  }
}

function loadBlogPosts() {
  ensureBlogDataFile()
  try {
    const data = fs.readFileSync(BLOG_DATA_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

function saveBlogPosts(posts: any[]) {
  ensureBlogDataFile()
  fs.writeFileSync(BLOG_DATA_FILE, JSON.stringify(posts, null, 2))
}

export async function GET() {
  try {
    const posts = loadBlogPosts()
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: "Failed to load blog posts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const postData = await request.json()
    const posts = loadBlogPosts()

    const newPost = {
      id: Date.now().toString(),
      ...postData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    posts.push(newPost)
    saveBlogPosts(posts)

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
  }
}
