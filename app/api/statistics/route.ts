import type { NextRequest } from "next/server"
import { createSuccessResponse } from "@/lib/api/middleware"
import type { StatisticsResponse } from "@/lib/api/types"

// Mock statistics data
const mockStatistics: StatisticsResponse = {
  totalClaims: 1247,
  approvedClaims: 789,
  pendingClaims: 342,
  rejectedClaims: 116,
  totalVillages: 156,
  participatingVillages: 98,
  forestAreaClaimed: 12345,
  totalForestArea: 45678,
  avgProcessingDays: 45,
  monthlySubmissions: 89,
  stateWiseData: [
    { state: "Madhya Pradesh", claims: 234, approved: 156 },
    { state: "Chhattisgarh", claims: 189, approved: 134 },
    { state: "Odisha", claims: 167, approved: 98 },
    { state: "Jharkhand", claims: 145, approved: 87 },
    { state: "Maharashtra", claims: 123, approved: 76 },
    { state: "Others", claims: 389, approved: 238 },
  ],
  claimTypeDistribution: [
    { type: "Individual Forest Rights", count: 456 },
    { type: "Community Forest Rights", count: 234 },
    { type: "Traditional Rights", count: 189 },
    { type: "Habitat Rights", count: 123 },
  ],
}

// GET /api/statistics - Get public statistics
export async function GET(request: NextRequest) {
  // No authentication required for public statistics
  return createSuccessResponse(mockStatistics, "Statistics retrieved successfully")
}
