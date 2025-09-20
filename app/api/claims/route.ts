import type { NextRequest } from "next/server"
import { createSuccessResponse, requireAuth, validateRequestBody } from "@/lib/api/middleware"
import type { ClaimCreateRequest, ClaimResponse, ApiResponse } from "@/lib/api/types"

// Mock claims data
const mockClaims: ClaimResponse[] = [
  {
    id: "1",
    applicationNumber: "FRA-2024-MP-001",
    claimType: "individual",
    claimantName: "Ramesh Kumar",
    claimantId: "AADHAAR-123456789012",
    village: "Bamhani",
    district: "Mandla",
    state: "Madhya Pradesh",
    area: 2.5,
    coordinates: [
      [78.58, 22.38],
      [78.62, 22.38],
      [78.62, 22.42],
      [78.58, 22.42],
    ],
    description: "Individual forest rights claim for traditional cultivation",
    status: "pending",
    submissionDate: "2024-01-15T00:00:00Z",
    lastUpdated: "2024-03-01T00:00:00Z",
    documents: ["land_survey.pdf", "identity_proof.pdf"],
    createdBy: "user-123",
  },
  {
    id: "2",
    applicationNumber: "FRA-2024-CG-045",
    claimType: "community",
    claimantName: "Khatiya Gram Sabha",
    claimantId: "GRAM-SABHA-456",
    village: "Khatiya",
    district: "Bastar",
    state: "Chhattisgarh",
    area: 15.0,
    coordinates: [
      [80.68, 22.28],
      [80.72, 22.28],
      [80.72, 22.32],
      [80.68, 22.32],
    ],
    description: "Community forest rights for traditional forest management",
    status: "approved",
    submissionDate: "2024-02-10T00:00:00Z",
    lastUpdated: "2024-02-28T00:00:00Z",
    reviewComments: "All documentation verified and approved",
    assignedOfficer: "officer-789",
    documents: ["community_resolution.pdf", "forest_survey.pdf", "usage_plan.pdf"],
    createdBy: "user-456",
  },
]

// GET /api/claims - List all claims with pagination and filtering
export async function GET(request: NextRequest) {
  return requireAuth()(request, async (req) => {
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const state = searchParams.get("state")
    const claimType = searchParams.get("claimType")

    let filteredClaims = mockClaims

    // Apply filters
    if (status) {
      filteredClaims = filteredClaims.filter((claim) => claim.status === status)
    }
    if (state) {
      filteredClaims = filteredClaims.filter((claim) => claim.state === state)
    }
    if (claimType) {
      filteredClaims = filteredClaims.filter((claim) => claim.claimType === claimType)
    }

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedClaims = filteredClaims.slice(startIndex, endIndex)

    const response: ApiResponse<ClaimResponse[]> = {
      success: true,
      data: paginatedClaims,
      pagination: {
        page,
        limit,
        total: filteredClaims.length,
        totalPages: Math.ceil(filteredClaims.length / limit),
      },
    }

    return createSuccessResponse(response.data, "Claims retrieved successfully")
  })
}

// POST /api/claims - Create a new claim
export async function POST(request: NextRequest) {
  return requireAuth(["admin", "government", "public", "tribal", "ngo"])(
    request,
    validateRequestBody<ClaimCreateRequest>({})(async (req, body) => {
      const user = (req as any).user

      // Generate application number
      const applicationNumber = `FRA-${new Date().getFullYear()}-${body.state.substring(0, 2).toUpperCase()}-${String(mockClaims.length + 1).padStart(3, "0")}`

      const newClaim: ClaimResponse = {
        id: String(mockClaims.length + 1),
        applicationNumber,
        claimType: body.claimType,
        claimantName: body.claimantName,
        claimantId: body.claimantId,
        village: body.village,
        district: body.district,
        state: body.state,
        area: body.area,
        coordinates: body.coordinates,
        description: body.description,
        status: "pending",
        submissionDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        documents: body.documents || [],
        createdBy: user.id,
      }

      mockClaims.push(newClaim)

      return createSuccessResponse(newClaim, "Claim created successfully")
    }),
  )
}
