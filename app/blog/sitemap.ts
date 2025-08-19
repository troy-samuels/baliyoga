import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

interface BlogPost {
  slug: string
  publishDate: string
  updatedAt?: string
  status?: string
}

function loadBlogPosts(): BlogPost[] {
  try {
    const filePath = path.join(process.cwd(), "data", "blog-posts.json")
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf8")
      return JSON.parse(data).filter((post: BlogPost) => post.status === "published")
    }
  } catch (error) {
    console.error("Error loading blog posts:", error)
  }
  return []
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = loadBlogPosts()
  const baseUrl = 'https://baliyoga.com'
  
  // Blog main page
  const blogPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]
  
  // Individual blog posts
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishDate),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))
  
  return [...blogPages, ...postPages]
}