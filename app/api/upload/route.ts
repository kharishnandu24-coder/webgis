import type { NextRequest } from "next/server"
import { createSuccessResponse, createErrorResponse, requireAuth } from "@/lib/api/middleware"

interface UploadResponse {
  filename: string
  url: string
  size: number
  type: string
}

// POST /api/upload - Upload files
export async function POST(request: NextRequest) {
  return requireAuth()(request, async (req) => {
    try {
      const formData = await req.formData()
      const file = formData.get("file") as File

      if (!file) {
        return createErrorResponse("No file provided", 400)
      }

      // Validate file type
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
      if (!allowedTypes.includes(file.type)) {
        return createErrorResponse("Invalid file type. Only PDF and image files are allowed", 400)
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        return createErrorResponse("File size too large. Maximum size is 10MB", 400)
      }

      // TODO: In a real application, upload to cloud storage (e.g., Vercel Blob, AWS S3)
      // For now, we'll simulate the upload
      const filename = `${Date.now()}-${file.name}`
      const mockUrl = `/uploads/${filename}`

      const uploadResponse: UploadResponse = {
        filename,
        url: mockUrl,
        size: file.size,
        type: file.type,
      }

      return createSuccessResponse(uploadResponse, "File uploaded successfully")
    } catch (error) {
      console.error("Upload error:", error)
      return createErrorResponse("Upload failed", 500)
    }
  })
}
