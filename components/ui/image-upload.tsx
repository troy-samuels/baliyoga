"use client"

import React, { useState, useRef } from "react"
import Image from "next/image"
import { Upload, X, FolderOpen, Image as ImageIcon, AlertCircle, Link, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "./button"

interface ImageUploadProps {
  currentImage?: string
  onImageChange: (url: string) => void
}

export function ImageUpload({ currentImage, onImageChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [downloadPath, setDownloadPath] = useState("")
  const [showUrlInput, setShowUrlInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    setUploadError("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        onImageChange(result.url)
      } else {
        setUploadError(result.error || "Upload failed")
      }
    } catch (error) {
      setUploadError("Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleLocalFileCopy = async () => {
    if (!downloadPath.trim()) {
      setUploadError("Please enter a file path")
      return
    }

    setIsUploading(true)
    setUploadError("")

    try {
      const response = await fetch("/api/upload", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filePath: downloadPath.trim(),
        }),
      })

      const result = await response.json()

      if (response.ok) {
        onImageChange(result.url)
        setDownloadPath("")
      } else {
        setUploadError(result.error || "Copy failed")
      }
    } catch (error) {
      setUploadError("Copy failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const removeImage = () => {
    onImageChange("")
    setUploadError("")
  }

  const openFileBrowser = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {/* Current Image Preview */}
      {currentImage && (
        <div className="relative inline-block">
          <Image
            src={currentImage}
            alt="Featured image preview"
            width={200}
            height={120}
            className="rounded-lg object-cover border border-[#e6ceb3]"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Primary Upload Methods */}
      <div className="space-y-4">
        {/* Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-[#e6ceb3] rounded-lg p-6 text-center hover:border-[#a39188] transition-colors"
        >
          <div className="space-y-4">
            <ImageIcon className="mx-auto h-12 w-12 text-[#a39188]" />
            <div>
              <p className="text-[#5d4c42] font-medium">Upload Featured Image</p>
              <p className="text-sm text-[#5d4c42]/60">
                Drag & drop your image here, or click to browse
              </p>
              <p className="text-xs text-[#5d4c42]/50 mt-1">
                Supports: JPEG, PNG, WebP (max 5MB)
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={openFileBrowser}
                disabled={isUploading}
                className="border-[#e6ceb3] text-[#5d4c42] hover:bg-[#f2e8dc]"
              >
                <Upload className="mr-2 h-4 w-4" />
                Browse Files
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileUpload(file)
            }}
            className="hidden"
          />
        </div>

        {/* Local File Integration */}
        <div className="border border-[#e6ceb3] rounded-lg p-4 bg-[#f9f7f4]">
          <div className="flex items-center gap-2 mb-3">
            <FolderOpen className="h-4 w-4 text-[#5d4c42]" />
            <span className="font-medium text-[#5d4c42]">Copy from Local Files</span>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-[#5d4c42]/80 mb-1">
                Full path to your image file:
              </label>
              <input
                type="text"
                value={downloadPath}
                onChange={(e) => setDownloadPath(e.target.value)}
                placeholder="/Users/username/my-image.png"
                className="w-full rounded-lg border border-[#e6ceb3] p-2 focus:border-[#a39188] focus:outline-none text-sm"
              />
            </div>
            
            <div className="text-xs text-[#5d4c42]/60">
              <p><strong>Example paths:</strong></p>
              <p>• macOS: <code>/Users/yourname/image.png</code></p>
              <p>• Windows: <code>C:\Users\yourname\image.png</code></p>
            </div>

            <Button
              type="button"
              onClick={handleLocalFileCopy}
              disabled={isUploading || !downloadPath.trim()}
              className="bg-[#e6ceb3] text-[#5d4c42] hover:bg-[#d9b99a]"
            >
              {isUploading ? "Copying..." : "Copy File"}
            </Button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {uploadError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-700">{uploadError}</span>
        </div>
      )}

      {/* Collapsible URL Input */}
      <div className="border-t border-[#e6ceb3] pt-4">
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="flex items-center gap-2 text-sm text-[#5d4c42]/70 hover:text-[#5d4c42] transition-colors"
        >
          <Link className="h-4 w-4" />
          <span>Advanced: Use image URL instead</span>
          {showUrlInput ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        
        {showUrlInput && (
          <div className="mt-3 space-y-2">
            <label className="block text-sm font-medium text-[#5d4c42]">
              Image URL:
            </label>
            <input
              type="url"
              value={currentImage || ""}
              onChange={(e) => onImageChange(e.target.value)}
              className="w-full rounded-lg border border-[#e6ceb3] p-2 focus:border-[#a39188] focus:outline-none"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-[#5d4c42]/60">
              Only use this if you have an image already hosted online
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 