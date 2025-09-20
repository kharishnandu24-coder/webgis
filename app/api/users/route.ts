import type { NextRequest } from "next/server"
import { createSuccessResponse, createErrorResponse, requireAuth, validateRequestBody } from "@/lib/api/middleware"
import type { UserCreateRequest, UserResponse } from "@/lib/api/types"

// Mock users data
const mockUsers: UserResponse[] = [
  {
    id: "1",
    email: "admin@fra-atlas.gov.in",
    name: "System Administrator",
    role: "admin",
    organization: "Ministry of Environment",
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-03-01T10:30:00Z",
    isActive: true,
  },
  {
    id: "2",
    email: "officer@forest.mp.gov.in",
    name: "Forest Officer",
    role: "government",
    organization: "MP Forest Department",
    createdAt: "2024-01-15T00:00:00Z",
    lastLogin: "2024-02-28T14:20:00Z",
    isActive: true,
  },
]

// GET /api/users - List all users (admin only)
export async function GET(request: NextRequest) {
  return requireAuth(["admin"])(request, async (req) => {
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const role = searchParams.get("role")

    let filteredUsers = mockUsers

    // Filter by role
    if (role) {
      filteredUsers = filteredUsers.filter((user) => user.role === role)
    }

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

    return createSuccessResponse(paginatedUsers, "Users retrieved successfully")
  })
}

// POST /api/users - Create a new user (admin only)
export async function POST(request: NextRequest) {
  return requireAuth(["admin"])(
    request,
    validateRequestBody<UserCreateRequest>({})(async (req, body) => {
      // Check if user already exists
      const existingUser = mockUsers.find((user) => user.email === body.email)
      if (existingUser) {
        return createErrorResponse("User with this email already exists", 409)
      }

      const newUser: UserResponse = {
        id: String(mockUsers.length + 1),
        email: body.email,
        name: body.name,
        role: body.role,
        organization: body.organization,
        createdAt: new Date().toISOString(),
        isActive: true,
      }

      mockUsers.push(newUser)

      return createSuccessResponse(newUser, "User created successfully")
    }),
  )
}
