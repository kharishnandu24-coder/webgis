"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Brain, CheckCircle, AlertTriangle, Clock, FileText, TrendingUp } from "lucide-react"
import type { ClaimAnalysis, DecisionRecommendation } from "@/lib/ai/decision-support"
import { analyzeClaimWithAI, generateDecisionRecommendation } from "@/lib/ai/decision-support"

interface DecisionSupportPanelProps {
  claimData: any
  onDecisionMade?: (decision: DecisionRecommendation) => void
}

export function DecisionSupportPanel({ claimData, onDecisionMade }: DecisionSupportPanelProps) {
  const [analysis, setAnalysis] = useState<ClaimAnalysis | null>(null)
  const [recommendation, setRecommendation] = useState<DecisionRecommendation | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showRecommendation, setShowRecommendation] = useState(false)

  const runAIAnalysis = async () => {
    setIsAnalyzing(true)
    try {
      const claimAnalysis = await analyzeClaimWithAI(claimData)
      setAnalysis(claimAnalysis)

      const decisionRec = await generateDecisionRecommendation(claimData, claimAnalysis)
      setRecommendation(decisionRec)
    } catch (error) {
      console.error("AI analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getRiskColor = (score: number) => {
    if (score < 30) return "text-green-600"
    if (score < 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "approve":
        return "bg-green-500"
      case "reject":
        return "bg-red-500"
      case "request_more_info":
        return "bg-yellow-500"
      case "field_verification":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Analysis Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Decision Support
          </CardTitle>
          <CardDescription>
            Intelligent analysis and recommendations for claim: {claimData?.applicationNumber}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!analysis ? (
            <div className="text-center py-8">
              <Button onClick={runAIAnalysis} disabled={isAnalyzing} size="lg">
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Analyzing Claim...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Run AI Analysis
                  </>
                )}
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                AI will analyze documents, compliance, and risk factors
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Analysis Complete</span>
                <Badge variant="secondary">Confidence: {analysis.confidence}%</Badge>
              </div>
              <Progress value={analysis.confidence} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Risk Score</div>
                <div className={`text-2xl font-bold ${getRiskColor(analysis.riskScore)}`}>{analysis.riskScore}/100</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Processing Priority</div>
                <Badge className={getPriorityColor(analysis.processingPriority)}>
                  {analysis.processingPriority.toUpperCase()}
                </Badge>
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-2">Document Completeness</div>
              <Progress value={analysis.documentCompleteness} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">{analysis.documentCompleteness}% complete</div>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Estimated Processing Time</div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{analysis.estimatedProcessingDays} days</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compliance Issues */}
      {analysis && analysis.complianceIssues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Compliance Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.complianceIssues.map((issue, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  {issue}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* AI Recommendations */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Decision Recommendation */}
      {recommendation && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Decision Recommendation</CardTitle>
            <CardDescription>AI-powered decision support based on comprehensive analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Recommended Action</div>
                <Badge className={getActionColor(recommendation.action)} size="lg">
                  {recommendation.action.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Confidence</div>
                <div className="text-lg font-semibold">{recommendation.confidence}%</div>
              </div>
            </div>

            <Separator />

            <div>
              <div className="text-sm font-medium mb-2">Reasoning</div>
              <ul className="space-y-1">
                {recommendation.reasoning.map((reason, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            {recommendation.requiredDocuments && (
              <div>
                <div className="text-sm font-medium mb-2">Required Documents</div>
                <ul className="space-y-1">
                  {recommendation.requiredDocuments.map((doc, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <FileText className="h-3 w-3" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <div className="text-sm font-medium mb-2">Next Steps</div>
              <ol className="space-y-1">
                {recommendation.nextSteps.map((step, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-xs bg-muted rounded-full w-4 h-4 flex items-center justify-center mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => {
                  setShowRecommendation(true)
                  onDecisionMade?.(recommendation)
                }}
                className="flex-1"
              >
                Accept Recommendation
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                Review Manually
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Similar Cases */}
      {analysis && analysis.similarCases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Similar Cases</CardTitle>
            <CardDescription>Previously processed claims with similar characteristics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.similarCases.map((caseId, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="font-mono text-sm">{caseId}</span>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
