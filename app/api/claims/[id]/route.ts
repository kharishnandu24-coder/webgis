import type { NextRequest } from "next/server"
import { createSuccessResponse, createErrorResponse, requireAuth, validateRequestBody } from "@/lib/api/middleware"
import type { ClaimUpdateRequest, ClaimResponse } from "@/lib/api/types"

// Mock claims data (in a real app, this would be in a database)
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
]

// GET /api/claims/[id] - Get a specific claim
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return requireAuth()(request, async (req) => {
    const claim = mockClaims.find((c) => c.id === params.id)

    if (!claim) {
      return createErrorResponse("Claim not found", 404)
    }

    return createSuccessResponse(claim, "Claim retrieved successfully")
  })
}

// PUT /api/claims/[id] - Update a specific claim
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return requireAuth(["admin", "government"])(
    request,
    validateRequestBody<ClaimUpdateRequest>({})(async (req, body) => {
      const claimIndex = mockClaims.findIndex((c) => c.id === params.id)

      if (claimIndex === -1) {
        return createErrorResponse("Claim not found", 404)
      }

      const updatedClaim = {
        ...mockClaims[claimIndex],
        ...body,
        lastUpdated: new Date().toISOString(),
      }

      mockClaims[claimIndex] = updatedClaim

      return createSuccessResponse(updatedClaim, "Claim updated successfully")
    }),
  )
}

// DELETE /api/claims/[id] - Delete a specific claim
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return requireAuth(["admin"])(request, async (req) => {
    const claimIndex = mockClaims.findIndex((c) => c.id === params.id)

    if (claimIndex === -1) {
      return createErrorResponse("Claim not found", 404)
    }

    const deletedClaim = mockClaims.splice(claimIndex, 1)[0]

    return createSuccessResponse(deletedClaim, "Claim deleted successfully")
  })
}
