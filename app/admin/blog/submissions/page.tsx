"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, CheckCircle, XCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface BlogSubmission {
  id: string
  title: string
  authorName: string
  authorEmail: string
  authorBio: string
  category: string
  content: string
  excerpt: string
  tags: string
  authorWebsite: string
  socialMedia: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
  wordCount: number
}

export default function BlogSubmissionsPage() {
  const [submissions, setSubmissions] = useState<BlogSubmission[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<BlogSubmission | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSubmissions()
  }, [])

  const loadSubmissions = async () => {
    try {
      const response = await fetch("/api/blog/submit")
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data)
      }
    } catch (error) {
      console.error("Error loading submissions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateSubmissionStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      const response = await fetch(`/api/blog/submit/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        loadSubmissions()
        setSelectedSubmission(null)
      }
    } catch (error) {
      console.error("Error updating submission:", error)
    }
  }

  const convertToPost = async (submission: BlogSubmission) => {
    const blogPost = {
      title: submission.title,
      slug: submission.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-"),
      excerpt: submission.excerpt,
      content: submission.content,
      metaTitle: submission.title,
      metaDescription: submission.excerpt,
      keywords: submission.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      categories: [submission.category],
      tags: submission.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      author: submission.authorName,
      status: "published",
      featuredImage: "",
      publishDate: new Date().toISOString().split("T")[0],
      readTime: `${Math.ceil(submission.wordCount / 200)} min read`,
    }

    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogPost),
      })

      if (response.ok) {
        await updateSubmissionStatus(submission.id, "approved")
        alert("Blog post published successfully!")
      }
    } catch (error) {
      console.error("Error publishing post:", error)
      alert("Error publishing post")
    }
  }

  if (selectedSubmission) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Button variant="outline" onClick={() => setSelectedSubmission(null)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Submissions
          </Button>
          <h1 className="text-3xl font-bold text-[#5d4c42]">Review Submission</h1>
        </div>

        <Card className="border-[#e6ceb3]">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-[#5d4c42]">{selectedSubmission.title}</CardTitle>
                <p className="text-[#5d4c42]/60 mt-1">by {selectedSubmission.authorName}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{selectedSubmission.category}</Badge>
                  <Badge variant="secondary">{selectedSubmission.wordCount} words</Badge>
                  <Badge
                    variant={
                      selectedSubmission.status === "pending"
                        ? "default"
                        : selectedSubmission.status === "approved"
                          ? "default"
                          : "destructive"
                    }
                  >
                    {selectedSubmission.status}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => convertToPost(selectedSubmission)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={selectedSubmission.status !== "pending"}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Publish
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => updateSubmissionStatus(selectedSubmission.id, "rejected")}
                  disabled={selectedSubmission.status !== "pending"}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-[#5d4c42] mb-2">Author Information</h3>
              <div className="bg-[#f2e8dc] rounded-lg p-4 space-y-2">
                <p>
                  <strong>Name:</strong> {selectedSubmission.authorName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedSubmission.authorEmail}
                </p>
                {selectedSubmission.authorBio && (
                  <p>
                    <strong>Bio:</strong> {selectedSubmission.authorBio}
                  </p>
                )}
                {selectedSubmission.authorWebsite && (
                  <p>
                    <strong>Website:</strong> {selectedSubmission.authorWebsite}
                  </p>
                )}
                {selectedSubmission.socialMedia && (
                  <p>
                    <strong>Social:</strong> {selectedSubmission.socialMedia}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-[#5d4c42] mb-2">Excerpt</h3>
              <p className="text-[#5d4c42]/80">{selectedSubmission.excerpt}</p>
            </div>

            <div>
              <h3 className="font-semibold text-[#5d4c42] mb-2">Content</h3>
              <div className="bg-white border border-[#e6ceb3] rounded-lg p-4 max-h-96 overflow-y-auto">
                <div className="whitespace-pre-wrap text-[#5d4c42]/80">{selectedSubmission.content}</div>
              </div>
            </div>

            {selectedSubmission.tags && (
              <div>
                <h3 className="font-semibold text-[#5d4c42] mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSubmission.tags.split(",").map((tag, index) => (
                    <Badge key={index} variant="outline">
                      #{tag.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#5d4c42]">Blog Submissions</h1>
        <Link href="/admin/blog">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog Admin
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <SubmissionsList
            submissions={submissions.filter((s) => s.status === "pending")}
            onView={setSelectedSubmission}
          />
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <SubmissionsList
            submissions={submissions.filter((s) => s.status === "approved")}
            onView={setSelectedSubmission}
          />
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <SubmissionsList
            submissions={submissions.filter((s) => s.status === "rejected")}
            onView={setSelectedSubmission}
          />
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <SubmissionsList submissions={submissions} onView={setSelectedSubmission} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SubmissionsList({
  submissions,
  onView,
}: {
  submissions: BlogSubmission[]
  onView: (submission: BlogSubmission) => void
}) {
  if (submissions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[#5d4c42]/60">No submissions found</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {submissions.map((submission) => (
        <Card key={submission.id} className="border-[#e6ceb3]">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-[#5d4c42]">{submission.title}</CardTitle>
                <p className="text-sm text-[#5d4c42]/60 mt-1">{submission.excerpt}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant={
                      submission.status === "pending"
                        ? "default"
                        : submission.status === "approved"
                          ? "default"
                          : "destructive"
                    }
                  >
                    {submission.status}
                  </Badge>
                  <Badge variant="outline">{submission.category}</Badge>
                  <span className="text-xs text-[#5d4c42]/60">by {submission.authorName}</span>
                  <span className="text-xs text-[#5d4c42]/60">•</span>
                  <span className="text-xs text-[#5d4c42]/60">{submission.wordCount} words</span>
                  <span className="text-xs text-[#5d4c42]/60">•</span>
                  <span className="text-xs text-[#5d4c42]/60">
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => onView(submission)}>
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
