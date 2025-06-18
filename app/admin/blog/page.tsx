"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Eye, Plus } from "lucide-react"
import { ImageUpload } from "@/components/ui/image-upload"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  categories: string[]
  tags: string[]
  author: string
  status: "draft" | "published"
  featuredImage: string
  publishDate: string
  readTime: string
  createdAt: string
  updatedAt: string
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)

  // Load existing posts
  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const response = await fetch("/api/blog")
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error("Error loading posts:", error)
    }
  }

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await fetch(`/api/blog/${id}`, { method: "DELETE" })
        if (response.ok) {
          loadPosts()
        }
      } catch (error) {
        console.error("Error deleting post:", error)
      }
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingPost(null)
    loadPosts()
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#5d4c42]">Blog Management</h1>
        <Button onClick={() => setShowForm(true)} className="bg-[#e6ceb3] text-[#5d4c42] hover:bg-[#d9b99a]">
          <Plus className="mr-2 h-4 w-4" />
          New Blog Post
        </Button>
      </div>

      {showForm ? (
        <BlogPostForm post={editingPost} onClose={handleFormClose} />
      ) : (
        <Tabs defaultValue="published" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="all">All Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="published" className="space-y-4">
            <BlogPostList
              posts={posts.filter((post) => post.status === "published")}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            <BlogPostList
              posts={posts.filter((post) => post.status === "draft")}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <BlogPostList posts={posts} onEdit={handleEdit} onDelete={handleDelete} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

function BlogPostList({
  posts,
  onEdit,
  onDelete,
}: {
  posts: BlogPost[]
  onEdit: (post: BlogPost) => void
  onDelete: (id: string) => void
}) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[#5d4c42]/60">No posts found</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {posts.map((post) => (
        <Card key={post.id} className="border-[#e6ceb3]">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-[#5d4c42]">{post.title}</CardTitle>
                <p className="text-sm text-[#5d4c42]/60 mt-1">{post.excerpt}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={post.status === "published" ? "default" : "secondary"}>{post.status}</Badge>
                  <span className="text-xs text-[#5d4c42]/60">by {post.author}</span>
                  <span className="text-xs text-[#5d4c42]/60">•</span>
                  <span className="text-xs text-[#5d4c42]/60">{post.readTime}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => window.open(`/blog/${post.slug}`, "_blank")}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => onEdit(post)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(post.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1 mb-2">
              {post.categories.map((category) => (
                <Badge key={category} variant="outline" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {post.tags.slice(0, 5).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {post.tags.length > 5 && (
                <Badge variant="secondary" className="text-xs">
                  +{post.tags.length - 5} more
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function BlogPostForm({ post, onClose }: { post: BlogPost | null; onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    categories: "",
    tags: "",
    author: "",
    status: "draft" as "draft" | "published",
    featuredImage: "",
    publishDate: "",
    readTime: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        keywords: post.keywords.join(", "),
        categories: post.categories.join(", "),
        tags: post.tags.join(", "),
        author: post.author,
        status: post.status,
        featuredImage: post.featuredImage,
        publishDate: post.publishDate,
        readTime: post.readTime,
      })
    }
  }, [post])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
      metaTitle: prev.metaTitle || title,
    }))
  }

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return `${minutes} min read`
  }

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      content,
      readTime: estimateReadTime(content),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const blogPost = {
        ...formData,
        keywords: formData.keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        categories: formData.categories
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        publishDate: formData.publishDate || new Date().toISOString().split("T")[0],
        readTime: formData.readTime || estimateReadTime(formData.content),
      }

      const url = post ? `/api/blog/${post.id}` : "/api/blog"
      const method = post ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogPost),
      })

      if (response.ok) {
        onClose()
      } else {
        alert("Error saving post")
      }
    } catch (error) {
      console.error("Error saving post:", error)
      alert("Error saving post")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-[#e6ceb3]">
      <CardHeader>
        <CardTitle className="text-[#5d4c42]">{post ? "Edit" : "Create"} Blog Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#5d4c42]">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#5d4c42] mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full rounded-lg border border-[#e6ceb3] p-2 focus:border-[#a39188] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5d4c42] mb-1">URL Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  className="w-full rounded-lg border border-[#e6ceb3] p-2 focus:border-[#a39188] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5d4c42] mb-1">Excerpt *</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
                className="w-full rounded-lg border border-[#e6ceb3] p-2 focus:border-[#a39188] focus:outline-none"
                placeholder="Brief description of the article (150-160 characters recommended)"
                required
              />
              <p className="text-xs text-[#5d4c42]/60 mt-1">{formData.excerpt.length} characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5d4c42] mb-1">Content *</label>
              <textarea
                value={formData.content}
                onChange={(e) => handleContentChange(e.target.value)}
                rows={15}
                className="w-full rounded-lg border border-[#e6ceb3] p-2 focus:border-[#a39188] focus:outline-none font-mono text-sm"
                placeholder="Write your blog content here. You can use HTML tags for formatting."
                required
              />
              <p className="text-xs text-[#5d4c42]/60 mt-1">
                {formData.content.split(/\s+/).length} words • {estimateReadTime(formData.content)}
              </p>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#5d4c42]">SEO Settings</h3>

            <div>
              <label className="block text-sm font-medium text-[#5d4c42] mb-1">Meta Title</label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))}
                className="w-full rounded-lg border border-[#e6ceb3] p-2 focus:border-[#a39188] focus:outline-none"
                placeholder="SEO title (50-60 characters recommended)"
              />
              <p className="text-xs text-[#5d4c42]/60 mt-1">{formData.metaTitle.length} characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5d4c42] mb-1">Meta Description</label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => setFormData((prev) => ({ ...prev, metaDescription: e.target.value }))}
                rows={3}
                className="w-full rounded-lg border border-[#e6ceb3] p-2 focus:border-[#a39188] focus:outline-none"
                placeholder="SEO description (150-160 characters recommended)"
              />
              <p className="text-xs text-[#5d4c42]/60 mt-1">{formData.metaDescription.length} characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5d4c42] mb-1">Keywords</label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData((prev) => ({ ...prev, keywords: e.target.value }))}
                className="w-full rounded-lg border border-[#e6ceb3] p-2 focus:border-[#a39188] focus:outline-none"
                placeholder="yoga, bali, meditation, wellness (comma separated)"
              />
            </div>
          </div>

          {/* Categorization */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#5d4c42]">Categorization</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#5d4c42] mb-1">Categories</label>
                <input
                  type="text"
                  value={formData.categories}
                  onChange={(e) => setFormData((prev) => ({ ...prev, categories: e.target.value }))}
                  className="w-full rounded-lg border border-[#e6ceb3] p-2 focus:border-[#a39188] focus:outline-none"
                  placeholder="Yoga Practice, Wellness, Travel (comma separated)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5d4c42] mb-1">Tags</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                  className="w-full rounded-lg border border-[#e6ceb3] p-2 focus:border-[#a39188] focus:outline-none"
                  placeholder="yoga, bali, meditation, ubud (comma separated)"
                />
              </div>
            </div>
          </div>

          {/* Publishing Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#5d4c42]">Publishing Settings</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#5d4c42] mb-1">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                  className="w-full rounded-lg border border-[#e6ceb3] p-2 focus:border-[#a39188] focus:outline-none"
                  placeholder="Author name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5d4c42] mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, status: e.target.value as "draft" | "published" }))
                  }
                  className="w-full rounded-lg border border-[#e6ceb3] p-2 focus:border-[#a39188] focus:outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5d4c42] mb-1">Publish Date</label>
                <input
                  type="date"
                  value={formData.publishDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, publishDate: e.target.value }))}
                  className="w-full rounded-lg border border-[#e6ceb3] p-2 focus:border-[#a39188] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5d4c42] mb-1">Featured Image</label>
              <ImageUpload
                currentImage={formData.featuredImage}
                onImageChange={(url) => setFormData((prev) => ({ ...prev, featuredImage: url }))}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="bg-[#e6ceb3] text-[#5d4c42] hover:bg-[#d9b99a]">
              {isLoading ? "Saving..." : post ? "Update Post" : "Create Post"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
