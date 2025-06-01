import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const BLOG_DATA_FILE = path.join(process.cwd(), "data", "blog-posts.json")

function loadBlogPosts() {
  try {
    const data = fs.readFileSync(BLOG_DATA_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

function saveBlogPosts(posts: any[]) {
  fs.writeFileSync(BLOG_DATA_FILE, JSON.stringify(posts, null, 2))
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const postData = await request.json()
    const posts = loadBlogPosts()

    const index = posts.findIndex((post: any) => post.id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    posts[index] = {
      ...posts[index],
      ...postData,
      updatedAt: new Date().toISOString(),
    }

    saveBlogPosts(posts)

    return NextResponse.json(posts[index])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const posts = loadBlogPosts()
    const filteredPosts = posts.filter((post: any) => post.id !== id)

    if (posts.length === filteredPosts.length) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    saveBlogPosts(filteredPosts)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 })
  }
}
