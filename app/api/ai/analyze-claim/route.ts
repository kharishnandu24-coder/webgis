import type { NextRequest } from "next/server"
import { createSuccessResponse, createErrorResponse, requireAuth } from "@/lib/api/middleware"
import { analyzeClaimWithAI, generateDecisionRecommendation } from "@/lib/ai/decision-support"

// POST /api/ai/analyze-claim - Analyze a claim using AI
export async function POST(request: NextRequest) {
  return requireAuth(["admin", "government"])(request, async (req) => {
    try {
      const body = await req.json()
      const { claimId, claimData } = body

      if (!claimId || !claimData) {
        return createErrorResponse("Missing claimId or claimData", 400)
      }

      // Run AI analysis
      const analysis = await analyzeClaimWithAI(claimData)
      const recommendation = await generateDecisionRecommendation(claimData, analysis)

      return createSuccessResponse(
        {
          analysis,
          recommendation,
        },
        "AI analysis completed successfully",
      )
    } catch (error) {
      console.error("AI analysis error:", error)
      return createErrorResponse("AI analysis failed", 500)
    }
  })
}
